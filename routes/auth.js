const express = require('express');
const { handleUserSignup, handleUserSignin, handleGetUserProfile, handleAdminPermission } = require('../controllers/auth')

const router = express.Router();

router.post('/signup', handleUserSignup);
router.post('/signin', handleUserSignin);
router.get('/profile', handleGetUserProfile)
router.post('/admin', handleAdminPermission)

module.exports = router;