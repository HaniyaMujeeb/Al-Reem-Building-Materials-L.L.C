import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {

    const { token } = req.headers;

    if (!token) {
        return res.json({ success: false, message: "Not Authorized, Please try Logging again " })
    }

    try {
    
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)

        req.body.userId = token_decode.id   // ✅ keep existing behavior
        req.user = { id: token_decode.id }  // ✅ ADD THIS LINE (important)

        next()

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
        
    }
}

export default authUser;
