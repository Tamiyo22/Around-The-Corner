const jwt = require("jsonwebtoken");
const config = require("config");



//function that has access to req and res objects
//next so it moves on
module.exports = function (req, res, next) {
	//get token from header
	//header key x-auth-token
	const token = req.header('x-auth-token')

	if (!token) {
		return res.status(401).json({
			message: 'no token, authorization denied'
		})
	}

	//verify token
	try {
		//if valid decode to use in routes
		const decoded = jwt.verify(token, config.get('jwtSecret'));

		req.user = decoded.user
		next()
		//else return error
	} catch (error) {
		res.status(401).json({
			message: "token not valid"
		})
	}


};
