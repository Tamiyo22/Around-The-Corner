const express = require('express');
const router = express.Router();
const {
	check,
	validationResult
} = require('express-validator/check');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//route GET api/posts
//description  create a post
//access private

router.post('/', [auth,
		[check('text', 'Text is required')
			.not()
			.isEmpty()
		]

	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		try {
			const user = await User.findById(req.user.id).select('-password');

			//need to create 'new' instance
			const newPost = new Post({
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			});

			const post = await newPost.save();

			res.json(post)

		} catch (error) {
			console.error(error.message)
			res.status(500).send('server error')

		}

	});

//route GET api/posts
//description  get all posts
//access private

router.get('/', auth, async (req, res) => {

	try {

		const posts = await Post.find().sort({
			date: -1
		});
		res.json(posts)
	} catch (error) {
		console.error(error.message)
		res.status(500).send('server error')

	}

})

//route GET api/posts
//description  get post by id
//access private

router.get('/:id', auth, async (req, res) => {

	try {

		const post = await Post.findById(req, params.id)

		if (!post) {
			return res.status(404).json({
				message: 'post not found'
			})
		}
		res.json(post)
	} catch (error) {
		console.error(error.message)
		if (error.kind === 'ObjectId') {
			return res.status(404).json({
				message: 'post not found'
			})
		}
		console.error(error.message)
		res.status(500).send('server error')

	}

})

module.exports = router;
