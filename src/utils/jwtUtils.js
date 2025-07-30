import jwt from 'jsonwebtoken'

export const issueJwt = (user, expire, isAdminLogin = false) => {
    const payload = {
        userId: user._id,
        email: user.email,
        isVerified: user.isVerified || false,
        isAdmin: isAdminLogin ? (user.isAdmin || false) : false
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expire });
}