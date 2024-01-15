const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(token, "live", function (err, decoded) {
        if (err) {
            return res.send({message:"please login first"})
        }
        else {
            console.log(decoded);
            req.userId = decoded.userId;
            console.log(decoded.userId);
            next();
        }
    })
}
module.exports = { authenticate };