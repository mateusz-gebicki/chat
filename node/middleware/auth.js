const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken (req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        try {
            const user = jwt.verify(token, JWT_SECRET);
            req.user = user;
            next();
        } catch (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    } else {
        return res.status(401).json({ error: 'No token provided' });
    }
}

module.exports = verifyToken;
