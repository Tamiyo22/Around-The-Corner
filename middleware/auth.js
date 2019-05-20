const jwt = require("jsonwebtoken");
const config = require("config");



//function that has access to request and response objects
//next so it moves on
module.exports = function (request, response, next) {
	//get token from header
	//header key x-auth-token
	const token = request.header('x-auth-token')

	if (!token) {
		return response.status(401).json({
			message: 'no token, authorization denied'
		})
	}

	//verify token
	try {
		//if valid decode to use in routes
		const decoded = jwt.verify(token, config.get('jwtSecret'));

		request.user = decoded.user
		next()
		//else return error
	} catch (error) {
		response.status(401).json({
			message: "token not valid"
		})
	}


};
