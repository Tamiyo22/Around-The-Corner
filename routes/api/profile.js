const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
	check,
	validationResult
} = require('express-validator/check')
const Profile = require('../../models/Profile');
const User = require('../../models/User');


//route GET api/profile/me
//description get current users profile
//access private

router.get('/me', auth, async (request, response) => {

	try {

		const profile = await Profile.findOne({
			user: request.user.id
		}).populate('user', ['name',
			'avatar'
		]);

		if (!profile) {
			return response.status(400).json({
				message: 'there is no profile for user'
			})
		}

		response.json(profile)

	} catch (error) {

		console.error(error.message);
		response.status(500).useChunkedEncodingByDefault('server error');

	}

})

//route POST api/profile/me
//description create or update user profile
//access private
router.post('/',
	[
		auth,
		[
			check('status', 'status is required ')
			.not()
			.isEmpty(),
			check('skills', 'skills is required')
			.not()
			.isEmpty()
		]
	],
	async (request, response) => {
		const errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(400).json({
				errors: errors.array()
			});
		}
		const {
			status,
			bio,
			location,
			family,
			website,
			hobbies,
			skills,
			work,
			githubusername,
			youtube,
			facebook,
			twitter,
			instagram,
			linkedin

		} = request.body;

		//build profile object

		const profileFields = {}
		profileFields.user = request.user.id;
		if (status) profileFields.status = status;
		if (bio) profileFields.bio = bio;
		if (location) profileFields.location = location;
		// if (petTypes) profileFields.petTypes = petTypes.split(',').map((pet) => pet.trim());
		if (skills) profileFields.skills = skills.split(',').map((skill) => skill.trim());
		if (hobbies) profileFields.hobbies = hobbies.split(',').map((hobby) => hobby.trim());


		profileFields.social = {}
		if (facebook) profileFields.social.facebook = facebook;
		if (twitter) profileFields.social.twitter = twitter;
		if (instagram) profileFields.social.instagram = instagram;
		if (githubusername) profileFields.social.githubusername = githubusername;
		if (youtube) profileFields.social.youtube = youtube;

		try {
			//find by the user id token
			let profile = await Profile.findOne({
				user: request.user.id
			})

			if (profile) {
				//update
				profile = await Profile.findOneAndUpdate({
					// findByIdAndUpdate
					user: request.user.id
				}, {
					$set: profileFields
				}, {
					new: true
				});

				return response.json(profile)
			}
			//create profile
			profile = new Profile(profileFields)
			await profile.save()
			response.json(profile)

		} catch (error) {
			console.error(error.message)
			response.status(500).send('server error')

		}

	})
//route GET api/profile
//description get all profiles
//access public

router.get('/', async (request, response) => {

	try {

		const profiles = await Profile.find().populate('user', ['name', 'avatar']);
		response.json(profiles)

	} catch (error) {
		console.error(error.message);
		response.status(500).send('server error')

	}

})

//route GET api/profile/user/:user_id
//description get profile by user id
//access public

router.get('/user/:user_id', async (request, response) => {

	try {

		const profile = await Profile.findOne({
			user: request.params.user_id
		}).populate('user', ['name', 'avatar']);

		if (!profile) return response.status(400).json({
			message: 'There is no profile for this user'
			//change later to profile not found
		})


		response.json(profile)
	} catch (error) {
		console.error(error.message);
		if (error.kind === "ObjectId") {
			return response.status(400).json({
				message: 'Profile not found'
			})
		}
		response.status(500).send('server error')

	}

})

//route DELETE api/profile
//description delete profile user and posts
//access private

router.delete('/', auth, async (request, response) => {

	try {
		//remove users posts

		//remove profile
		await Profile.findOneAndRemove({
			user: request.user.id
		});
		//remove user
		await User.findOneAndRemove({
			_id: request.user.id
		});

		//very cool mongoose
		//https://mongoosejs.com/docs/api.html
		response.json({
			message: 'Profile deleted'
		})

	} catch (error) {
		console.error(error.message);
		response.status(500).send('server error')

	}

})



module.exports = router;
