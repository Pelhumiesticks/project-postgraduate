import jwt from 'jsonwebtoken'

//caregiver authentication middleware
const authCaregiver = async (req, res, next) => {
    try {
        
        const {dtoken} = req.headers
        if(!dtoken) {
            return res.status(401).json({success:false, message: 'unauthorized login, please try again'})
        }
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET)
        req.body.docId = token_decode.id
        next()
        
    } catch (error) {
        return res.status(500).json({success:false, message: error.message})
    }
}

export default authCaregiver 