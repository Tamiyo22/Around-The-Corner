const express = require('express');
const router = express.Router();

//route GET api/auth
//description test route
//access public

router.get('/', (request, response) => response.send('auth route'));


module.exports = router;
