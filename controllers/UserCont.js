const { comparePassword, hashPassword } = require("../helpers/bcrypt");
const { jwtSign } = require("../helpers/jwt");
const { Users } = require("../models")

module.exports = class UserCont {
    static async register (req, res, next){
        try {
            const user = await Users.create(req.body);
            res.status(201).json({
                id: user.id,
                email: user.email
            });
        } catch (err) {
            console.log("Author Controller ~ register ~ Err:", err)
            if (err.name === "SequlizedValidationError" || "SequlizedUniqueConstraintError"){
                res.status(400).json({ message : err.errors[0].message })
            } else {
                res.status(500).json({ message: "Internal Server Error"});
            }
        }
    }

    static async login (req, res, next){
        try {
            const { email, password } = req.body;
            // Email Validation
            if(!email){
                res.status(400).json({ message: "Email is Required!"})
                return;
            }
            // Password Validation
            if(!password){
                res.status(400).json({ message: "Password is Required!"})
                return;
            }
            // Email Format Validation
            const user = await Users.findOne({ where: { email }});
            if(!user){
                res.status(401).json({ message: "Invalid Email or Password!"})
                return;
            }
            // Password Format Validation
            const isValidPassword = comparePassword(password, user.password);
            if(!isValidPassword){
                res.status(401).json({ message: "Invalid Email or Password"})
                return;
            }
            // Generate Token To Login
            const access_token = jwtSign({ id: user.id });
            res.status(200).json({ access_token }) 
        } catch (err) {
            console.log("Author Controller ~ login ~ Err:", err)
            res.status(500).json({ message: "Internal Server Error"});
        }
    }
}
