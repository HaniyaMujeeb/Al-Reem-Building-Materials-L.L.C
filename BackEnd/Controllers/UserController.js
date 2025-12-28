import validator from "validator";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import userModel from "../Models/UserModel.js";
import transporter from "../Config/Nodemailer.js";
import baseImage64 from "../longbase64.js";


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

    const { email, password } = req.body

    // 🔹 Add these lines for debugging
    console.log("ENV ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
    console.log("ENV ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD);

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: "Invalid Credentials, Please Enter Correct Email and Password" })
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}



/* =====================================
   GET LOGGED-IN USER PROFILE
===================================== */
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================
   UPDATE USER PROFILE
===================================== */
const updateUserProfile = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update phone
    if (phone !== undefined) user.phone = phone;

    // Update password if provided
    let passwordChanged = false;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      passwordChanged = true; // ✅ flag password change
    }

    const updatedUser = await user.save();

    // ✅ Send email if password changed
    if (passwordChanged) {
      try {
        // Logo attachment like in addProductToInquiry
        const logoAttachment = {
          filename: "logo.png",
          content: Buffer.from(
            baseImage64.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          ),
          cid: "companylogo",
        };

        await transporter.sendMail({
          from: `"Al Reem Building Materials" <${process.env.SENDER_EMAIL}>`,
          to: user.email,
          subject: "Your password has been changed",
          html: `
        <div style="font-family:Arial; max-width:700px; margin:auto; padding:20px; border:1px solid #ddd;">
          <div style="text-align:center;">
            <img src="cid:companylogo" style="height:60px;" />
          </div>

          <p>Dear <strong>${user.name}</strong>,</p>

          <p>Your password has been successfully changed. If you did NOT perform this action, please contact us immediately.</p>

          <hr />

          <p><strong>Al Reem Building Materials L.L.C</strong></p>
          <p>📞 072288872 / +971554312001 / +971556478562</p>

          <div style="text-align:center; font-size:12px; color:#999;">
            &copy; ${new Date().getFullYear()} Al Reem Building Materials L.L.C
          </div>
        </div>
      `,
          attachments: [logoAttachment],
        });
      } catch (err) {
        console.error("Failed to send password change email:", err.message);
      }
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      passwordChanged, // ✅ include flag for frontend
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        cartData: updatedUser.cartData,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile }