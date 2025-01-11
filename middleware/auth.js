const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies.accessToken || req?.header?.authorization?.split(" ")[1];

        // console.log(token);
        // Check if token exists
        if (!token) {
            return res.status(401).json({
                msg: "Provide a valid token",
                error: true,
                success: false,
            });
        }

        // Verify token
        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS);
        // console.log("Decoded token:", decode);

        if(!decode) {
            return res.status(401).json({
                msg: "unauthorized access",
                error: true,
                success: false
            })
        }
        // Attach user ID to the request object
        req.userId = decode.id;
        next();

    } catch (err) {
        return res.status(500).json({
            msg: err.message || "Authentication failed",
            error: true,
            success: false,
        });
    }

    // console.log(req.cookies.accessToken);
};

module.exports = auth;
