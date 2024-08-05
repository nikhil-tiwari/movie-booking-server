const express = require('express');
const { handleUserSignup, handleUserSignin, handleGetUserProfile } = require('../controllers/auth')

const router = express.Router();

router.post('/signup', handleUserSignup);
router.post('/signin', handleUserSignin);
router.get('/profile', handleGetUserProfile)

module.exports = router;