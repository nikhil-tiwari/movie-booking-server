const User = require('../models/user');
const { validateUserSignup, validateUserSignIn, generateHash, generateToken } = require('../lib/user')
const crypto = require('crypto');

const handleUserSignup = async (req, res) => {
    const safeParse = validateUserSignup(req.body);
    if (safeParse.error) {
        return res.status(400).json({ status: 'error', error: safeParse.error });
    }
    const { firstName, lastName, email, password, location: { city, lat = null, long = null } } = safeParse.data;
    // const { city } = location;
    const { salt, hashPassword } = generateHash(password);
    
    try {
        const newUser = await User.create({ firstName: firstName, lastName: lastName, email: email, password: hashPassword, salt: salt, location: { city: city, lat: lat, long: long } });
        const token = generateToken({ id: newUser._id.toString() , role: newUser.role });
        res.status(201).json({ status: "User created successfully", token: token });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: `user with email ${email} already exists!` })
        }   
        res.status(500).json({ status: 'Internal server error', error: err });
    }
}

const handleUserSignin = async (req, res) => {
    const safeParse = validateUserSignIn(req.body);
    if (safeParse.error) {
        return res.status(400).json({ status: 'error', error: safeParse.error });
    }
    const { email, password } = safeParse.data;
    try {
        const userInDB = await User.findOne({ email })
        if (!userInDB) {
            return res.status(404).json({ message: "User does not exists" });
        }
        const salt = userInDB.salt;
        const passwordFromDB = userInDB.password;
        const hashPassword = crypto.createHmac('sha256', salt).update(password).digest('hex');
        if(hashPassword !== passwordFromDB) {
            return res.status(400).json({ message: "Incorrect Password" });
        }
        const token = generateToken({ id: userInDB._id.toString() , role: userInDB.role });
        return res.status(200).json({ message: "User logged in successfully", token: token });
    } catch (err) {
        return res.status(500).json({ status: 'Internal server error', error: err });
    }
}

const handleGetUserProfile = async (req, res) => {
    const user = req.user;
    // console.log("User profile", user)
    if(!user) {
        return res.json({ profile: null })
    }  

    const userInDB = await User.findById(req.user.id);
    // console.log(userInDB)
    return res.status(201).json({ profile: {
        id: userInDB._id,
        firstName: userInDB.firstName,
        lastName: userInDB.lastName,
        email: userInDB.email,
        role: userInDB.role,
    } })
}

const handleAdminPermission = async (req, res) => {
    if(!req.user) {
        return res.status(404).json({ status: 'failed', message: 'User must be logged in' });
    }
    const { id } = req.user;
    try {
        const userToUpdate = await User.findById(id);
        userToUpdate.role = 'admin';
        await userToUpdate.save();
        const token = generateToken({ id: userToUpdate._id.toString() , role: 'admin' });
        return res.status(200).json({ status: 'success', message: 'User is an admin now', token: token });
    } catch(err) {
        return res.status(500).json({ status: 'failed', message: 'Internal server error' });
    }
    
}


module.exports = {
    handleUserSignup,
    handleUserSignin,
    handleGetUserProfile,
    handleAdminPermission,
}