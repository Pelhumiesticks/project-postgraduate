import jwt from 'jsonwebtoken'

//user authentication middleware
const authUser = async (req, res, next) => {
    try {
        
        const {token} = req.headers
        if(!token) {
            return res.status(401).json({success:false, message: 'unauthorized login, please try again'})
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
        next()
        
    } catch (error) {
        return res.status(500).json({success:false, message: error.message})
    }
}

export default authUser 