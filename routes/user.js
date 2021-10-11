var express = require('express')
var router = express.Router();

var user_controller = require('../controllers/user');

router.post('/islogin',user_controller.isLoggedIn);
router.post('/insert',user_controller.insertAdd);
router.post('/login',user_controller.login);
router.post('/allusers',user_controller.allUsers);
router.post('/logout',user_controller.logout)

module.exports = router;