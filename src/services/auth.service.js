import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import UserRole from "../models/userRole.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

export const registerService = async ({ name, email, password, role }) => {
  if (!name || !email || !password || !role) {
    return { success: false, message: "Something is missing", status: 400 };
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return { success: false, message: "User already exist with this email.", status: 409 };
  }

  const roleDoc = await Role.findOne({ name: role });
  if (!roleDoc) {
    return { success: false, message: "Invalid role selected", status: 400 };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  await UserRole.create({
    user_id: newUser._id,
    role_id: roleDoc._id,
  });

  return { success: true, message: "Account created Successfully", status: 201 };
};

export const loginService = async ({ email, password }) => {
  if (!email || !password) {
    return { success: false, message: "Email and password are required", status: 400 };
  }

  const user = await User.findOne({ email, deleted_at: null }).select("+password");
  if (!user) {
    return { success: false, message: "Invalid email or password", status: 400 };
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return { success: false, message: "Invalid email or password", status: 400 };
  }

  const userRole = await UserRole.findOne({ user_id: user._id, deleted_at: null }).populate("role_id");
  if (!userRole) {
    return { success: false, message: "User role not found", status: 400 };
  }

  const payload = {
    user_id: user._id,
    role: userRole.role_id.name,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  
  return {
    success: true,
    message: "Login successful",
    status: 200,
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: userRole.role_id.name,
    },
  };
};
