const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({

	user: {
		type: Schema.Types.ObjectId,
		reference: 'users'
	},
	text: {
		type: String,
		required: true,
	},
	name: {
		type: String
	},
	avatar: {
		type: String
	},
	likes: [{
		//like other networking sites we keep the likes limited
		//array of user object Ids
		user: {
			type: Schema.Types.ObjectId,
			reference: 'users'
		}
	}],
	comments: [{

		user: {
			type: Schema.Types.ObjectId,
			reference: 'users'
		},
		text: {
			type: String
		},
		avatar: {
			type: String
		},
		date: {
			type: Date,
			default: Date.now
		},
	}],
	date: {
		type: Date,
		default: Date.now
	}

})

module.exports = Post = mongoose.model('post', PostSchema);
