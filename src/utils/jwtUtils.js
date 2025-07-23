import jwt from 'jsonwebtoken'

export const issueJwt = (user, otp, expire) => {
    const details = {
        userId: user._id,
        email: user.email,
        status: otp.status,
    }

    return jwt.sign(details, process.env.JWT_SECRET, {expiresIn: expire})
}