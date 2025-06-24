import validator from "validator";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import userModel from "../Models/UserModel.js";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// User Login Route
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id)
            res.json({ success: true, token })
        }

        else { 
            res.json({ success: false, message: "Invalid Credentials, Please enter correct email and password" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }
}


// User Register Route
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        //Checking if user exist
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        //validate email and password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter valid email address" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // Hashing User Password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message })

    }
}


// Admin Login Route
const adminLogin = async (req, res) => {
    try {
        
        const {email, password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            res.json({success: true, token})
        } else {
            res.json({success: false, message: "Invalid Credentials, Please Enter Correct Email and Password" })
        }

    } catch (error) { 
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}



export { loginUser, registerUser, adminLogin }