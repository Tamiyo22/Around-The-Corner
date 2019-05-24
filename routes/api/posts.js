const express = require('express');
const router = express.Router();
const {
	check,
	validationResult
} = require('express-validator/check');
const auth = require('../../middleware/auth');
//connect
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//route GET api/posts
//description  create a post
//access private

router.get('/', [auth,
	[check('text', 'write something')
		.not()
		.isEmpty()
	]

], async (req, res) => {

	const errors = valudationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({
			erros: erros.array()
		})
	}

	try {
		const user = await User.findById(req.user.id).selec('-password')

		const newPost = {
			text: req.body.text,
			name: user.name,
			user: req.user.id
		}

		const post = await newPost.save();

		res.json(post)

	} catch (error) {
		console.error(error.message)
		res.status(500).send('server error')

	}

});


module.exports = router;
