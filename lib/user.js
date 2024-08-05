const crypto = require('crypto');
const { z } = require('zod');
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();
const JWT = require('jsonwebtoken');

const JWT_SIGN = process.env.JWT_SIGN;

if (!JWT_SIGN) throw new Error('JWT_SECRET is required!')

const tokenSchema = z.object({
    id: z.string(),
    role: z.string(),
})

const validateUserSignup = (data) => {
    const schema = z.object({
        firstName: z.string(),
        lastName: z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
        location: z.object({
            city: z.string(), 
            lat: z.string().optional(),
            long: z.string().optional(),
        }),
    })
    return schema.safeParse(data)
}

const validateUserSignIn = (data) => {
    const schema = z.object({
        email: z.string().email(),
        password: z.string().min(3),
    })
    return schema.safeParse(data)
}

const generateHash = (password) => {
    const salt = uuidv4();
    const hashPassword = crypto.createHmac('sha256', salt).update(password).digest('hex');
    return { salt, hashPassword };
}

const generateToken = (data) => {
    const parsedData = tokenSchema.safeParse(data).data;
    const stringdata = JSON.stringify(parsedData)
    const token = JWT.sign(stringdata, JWT_SIGN);
    return token;
}

const validateUserToken = (token) => {
    try {
        const payload = JWT.verify(token, JWT_SIGN);
        //console.log(payload);
        const safeParseResult = tokenSchema.safeParse(payload);
        if (safeParseResult.error) throw new Error(safeParseResult.error)
        return safeParseResult.data;
    } catch (error) {
        return null
    }
}

module.exports = {
    validateUserSignup,
    validateUserSignIn,
    generateHash,
    generateToken,
    validateUserToken,
}