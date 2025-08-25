import userModel from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//generating token for new user
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//Route for use register
const registerUser = async (req, res) => {
  try {
    const { name, gmail, phone, password, confirmPassword } = req.body;

    //checking user already exists or not
    const exists = await userModel.findOne({ gmail });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    //Validating email format & strong password
    if (!validator.isEmail(gmail)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    //matching password
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password Not Match",
      });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      phone,
      gmail,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        name: user.name,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Route for user login  
const loginUser = async (req, res) => {
  try {
    const { gmail, password } = req.body;
    const user = await userModel.findOne({ gmail });

    if (!user) {
      return res.json({ success: false, message: "user doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // res.status(200).json({
    //   success: true,
    //   token,
    // });

    if (isMatch) {
      const token = createToken(user._id);

      // ✅ Include user details in the response
      res.status(200).json({
        success: true,
        token,
        user: {
          name: user.name,
        },
      });
    } else {
      res.json({ success: false, message: "Invalid Credential" });
    }
  } catch (error) {}
};

//Route for Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin };
