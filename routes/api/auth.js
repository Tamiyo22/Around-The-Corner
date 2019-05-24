const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require("jsonwebtoken");
const config = require("config");
const {
	check,
	validationResult
} = require("express-validator/check");

//route GET api/auth
//description test route
//access public

//protected routes using middleware auth
router.get('/', auth, async (req, res) => {

	try {
		//leave off password using -password

		const user = await User.findById(req.user.id).select('-password')
		//sending the res without password
		res.json(user)
	} catch (error) {
		console.error(error.message)
		res.status(500).send('server error line 27')

	}


});

//route POST api/auth
// authenticate user and get token
//access public

router.post(
	"/",
	[
		check("email", "Please include a valid email").isEmail(),
		check("password", "password is required").exists()
	],

	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		const {
			email,
			password
		} = req.body;

		try {
			//see if user exists
			let user = await User.findOne({
				email
			});

			if (!user) {
				return res.status(400).json({
					errors: [{
						message: "invalid credentials"
					}]
				});
			}

			//bcrypt has method to compare password data

			const isMatch = await bcrypt.compare(password, user.password);



			if (!isMatch) {
				return res.status(400).json({
					errors: [{
						message: "invalid credentials "
					}]
				});
			}

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
					if (error) throw error;
					res.json({
						token
					});
					//user token
					//gives payload data
				}
			);

		} catch (error) {
			console.error(error.message);
			res.status(500).send("server error line 108");
		}
	}
);


module.exports = router;
