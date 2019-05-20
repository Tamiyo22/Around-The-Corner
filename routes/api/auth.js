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
router.get('/', auth, async (request, response) => {

	try {
		//leave off password using -password
		const user = await User.findById(request.user.id).select('-password')
		//sending the response without password
		response.json(user)
	} catch (error) {
		console.error(error.message)
		response.status(500).send('server error')

	}


});

//route POST api/auth
// authenticate user and got token
//access public

router.post(
	"/",
	[
		check("email", "Please include a valid email").isEmail(),
		check("password", "password is required").exists()
	],

	async (request, response) => {
		const errors = validationResult(request);

		if (!errors.isEmpty()) {
			return response.status(400).json({
				errors: errors.array()
			});
		}

		const {
			email,
			password
		} = request.body;

		try {
			//see if user exists
			let user = await User.findOne({
				email
			});

			if (!user) {
				return response.status(400).json({
					errors: [{
						message: "invalid"
					}]
				});
			}

			//bcrypt has method to compare password data

			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return response.status(400).json({
					errors: [{
						message: "invalid"
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
					response.json({
						token
					});
					//user token
					//gives payload data
				}
			);
		} catch (error) {
			console.error(error.message);
			response.status(500).send("server error");
		}
	}
);



module.exports = router;
