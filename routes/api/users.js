const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const {
	check,
	validationResult
} = require("express-validator/check");
//bring in user model
const User = require("../../models/User");

//route POST api/users
//description register user
//access public

router.post(
	"/",
	[
		check("name", "Name is required")
		.not()
		.isEmpty(),
		check("email", "Please include a valid email").isEmail(),
		check("password", "Please enter a password 7 of more characters").isLength({
			min: 7
		})
	],

	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		const {
			name,
			email,
			password
		} = req.body;

		try {
			//see if user exists
			let user = await User.findOne({
				email
			});

			if (user) {
				return res.status(400).json({
					errors: [{
						message: "User already exists"
					}]
				});
			}
			//get users gravatar
			const avatar = gravatar.url(email, {
				//size
				s: "200",
				//rating
				r: "pg",
				//default image like in github
				d: "mm"
			});

			user = new User({
				name,
				email,
				avatar,
				password
			});
			//encrypt password
			//more rounds we have the safer but slower
			//site recommends 10 rounds
			const salt = await bcrypt.genSalt(10);

			//no .then using await infront of promises
			//plain text password and salt for protection
			user.password = await bcrypt.hash(password, salt);
			//save user
			//await instead of .then await is cleaner
			await user.save();
			//return jsonwebtoken

			const payload = {
				//using mongoose so no _id as with mongodb
				user: {
					id: user.id
				}
			};

			jwt.sign(
				payload,
				config.get("jwtSecret"), {
					expiresIn: 420000
				},
				(error, token) => {
					if (error) {
						throw error
					};
					res.json({
						token
					});
					//user token
					//gives payload data
				}
			);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("server error");
		}
	}
);

module.exports = router;
