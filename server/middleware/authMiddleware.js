const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {

    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {

        token = req.headers.authorization.split(" ")[1];

      try {

    console.log("TOKEN:", token);
    console.log("SECRET:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    req.user = decoded;

    next();

} catch (error) {

    console.log("JWT ERROR:", error);

    return res.status(401).json({
        message: "Invalid Token"
    });

}

    } else {

        return res.status(401).json({
            message: "No Token Provided"
        });

    }

};

module.exports = protect;