import bcrypt from "bcryptjs";
import  User  from "../models/user.model.js";
import Role from "../models/role.model.js";
import UserRole from "../models/userRole.model.js";

import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email ||!password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exist with this email.",
        success: false,
      });
    }

    const roleDoc = await Role.findOne({name: role});
    if(!roleDoc){
        return res.status(400).json({
            message: "Invalid role selected",
            success: false,
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userr = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    await UserRole.create({
        user_id : userr._id,
        role_id : roleDoc._id
    })
    return res.status(201).json({
      message: "Account created Successfully",
      success: true,
    });

  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email, deleted_at: null }).select("+password");

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }
    const userRole = await UserRole.findOne({
      user_id: user._id,
      deleted_at: null,
    }).populate("role_id");
    if (!userRole) {
      return res.status(400).json({ success: false, message: "User role not found" });
    }

    const token = jwt.sign(
      {
        user_id: user._id,
        role: userRole.role_id.name,
      },
      process.env.JWT_SECRET,
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: userRole.role_id.name,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};