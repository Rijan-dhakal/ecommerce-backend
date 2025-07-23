export const otp = async (req, res, next) => {
    
    try {
        
        const {otp} = req.body || {}

    } catch (error) {
        next(error)
    }
}