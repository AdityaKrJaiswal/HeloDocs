import jwt from 'jsonwebtoken'

const authAdmin = async(req, res, next) => {
    try {
        const {atoken} = req.headers
        if(!atoken){
            return res.json({success:false,message: 'Not authorized login'})
        }
    const token_decode = jwt.verify(atoken,process.env.JWT_SECRET)
    if(token_decode!==process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD)
    {
        return res.json({success:false,message: 'Not authorized login'})
    }
    next();
    } catch (error) {
        console.error(error)
        res.status(500).json({ message:error.message })
    }
}

export default authAdmin