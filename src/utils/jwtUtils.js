import jwt from 'jsonwebtoken'

export const issueJwt = (user, verif="default", expire) => {

    let details;

    if(verif === 'default'){
        details = {
        userId: user._id,
        email: user.email,
        status: verif.status,
        }
    } else{
         details = {
        userId: user._id,
        email: user.email,
        status: verif,
    }
    }

    return jwt.sign(details, process.env.JWT_SECRET, {expiresIn: expire})
}