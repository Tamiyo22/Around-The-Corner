const express = require('express');
const router = express.Router();


//route GET api/profile
//description test route
//access public

router.get('/', (request, response) => response.send('profile route'));


module.exports = router;
