const { validateUserToken } = require('../lib/user');

const authMiddleware = () => {
    return function (req, res, next) {
        const authHeader = req.headers['Authorization'] ?? req.headers['authorization']
        if (authHeader) {
            const headerSplit = authHeader.split('Bearer ')
            if (headerSplit.length === 2) {
                const token = headerSplit[1]
                //console.log(token)
                const validateTokenResult = validateUserToken(token)
                // console.log(validateTokenResult)
                if (validateTokenResult) {
                    req.user = validateTokenResult
                }
            }
        }
        next();
    }
}

const ensureAuthentication = (allowedRoles = []) => {
    return function (req, res, next) {
        const user = req.user;
        if(!user) return res.status(401).json({ status: "Failed", message: "User must be authenticated" });
        if(!allowedRoles) return next();
        if(!allowedRoles.includes(user.role)) return res.status(403).json({ status: "Failed", message: "Access denied" });
        return next();
    }
}

module.exports = {
    authMiddleware,
    ensureAuthentication,
}