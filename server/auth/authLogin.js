import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import userModel from "../user/userModel.js";

const jwtSecret = process.env.JWT_SECRET || "secret";
const tokenExpiration = process.env.TOKEN_EXPIRATION || 60 * 60 * 24 * 30; // 30 days

const cookieOptions = {
  // user cant edit your http calls
  httpOnly: true,
  // requires https when true
  secure: false,
  signed: true,
  maxAge: tokenExpiration,
  sameSite: "none",
  domain: "localhost",
  path: "/",
};

// Backend Token
const createToken = (user) => {
  console.log("createToken user", user);
  return jwt.sign(user, jwtSecret, { expiresIn: tokenExpiration });
};

const authLogin = async (req, res, next) => {
  const { _id } = req.user;
  console.log("authLogin _id", _id);
  const token = createToken({ _id });
  console.log("authLogin/token", token);
  try {
    const user = await userModel.findOne({ _id });
    console.log("authLogin/user", user);
    //Lets you be logged in from multiple places at once
    if (user.token) {
      user.token.push({ token });
    } else {
      user.token = [{ token }];
    }
    user.save();
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      success: true,
      token,
      user: {
        firstName: user.firstName,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "authLogin: There was an error." });
  }
};

export default authLogin;
