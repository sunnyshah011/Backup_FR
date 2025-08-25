import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {

    const { token } = req.headers;
    console.log(token);

    if (!token) {
        console.log("Your are not Login");
        if (!req.body) req.body = {};   // 👈 ensure it's an object
        return res.json({ success: false, message: "Not Authorized Please Login" })
    }

    try {
        const tokendecode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = tokendecode.id; // attach to req, not req.body
        next();
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }

}

export default authUser