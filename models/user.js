const { Schema, model }  = require('mongoose')

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    location: {
        city: { type: String, required: true },
        lat: { type: String },
        long: { type: String },
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    }
}, { timestamps: true });

const User = model('user', userSchema);

module.exports = User;