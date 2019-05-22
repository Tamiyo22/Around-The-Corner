const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},

	bio: {
		type: String
	},
	location: {
		type: String
	},
	family: {
		type: String
	},
	work: {
		type: String
		//debating on work/company
	},
	website: {
		type: String
		//useful if they are offering help or services
	},
	status: {
		//looking to help
		type: String,
		required: true
	},
	hobbies: {

		type: [String],
		required: true
	},

	skills: {
		//skills and hobbies? should be required
		type: [String],
		required: true
	},

	githubusername: {
		//for connecting skills
		type: String
	},
	experience: [
		//not sure though this maybe helpful for the volunteer aspect
		{
			title: {
				type: String,

			},
			company: {
				type: String,

			},
			location: {
				type: String
			},
			from: {
				type: Date,

			},
			to: {
				type: Date
			},
			current: {
				type: Boolean,

			},
			description: {
				type: String
			}
		}
	],
	education: [{
		//for connecting nearby school mates
		//should this be required?
		school: {
			type: String,

		},
		degree: {
			type: String,

		},
		fieldofstudy: {
			type: String,

		},
		from: {
			type: Date,

		},
		to: {
			type: Date
		},
		current: {
			type: Boolean,
		},
		description: {
			type: String
		}
	}],
	social: {
		youtube: {
			type: String
		},
		twitter: {
			type: String
		},
		facebook: {
			type: String
		},
		linkedin: {
			type: String
		},
		instagram: {
			type: String
		}
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
