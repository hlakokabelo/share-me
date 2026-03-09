import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existsingUser = await User.findOne({ email });
    if (existsingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, use different one" });
    }
    /*create user
     */

    //gen number btwn 1 and 100
    const index = Math.floor(Math.random() * 100 + 1);
    const randomAvatar = `https://raw.githubusercontent.com/mhshariatipour1378/Avatars-Placeholder/refs/heads/master/back-end/images/id/AV${index}.png`;

    const payload = {
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    };
    const newUser = await User.create({ ...payload });

    //create user in stream
    try {
      await upsertStreamUser({
      id: newUser._id.toString(),
      name: newUser.fullName,
      image: newUser.profilePic,
    });
    console.log("----------stream succes")
    } catch (error) {
      console.error("------stream error",error)
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" },
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 1000,
      httpOnly: true, //prevent xss attack,
      sameSute: "strict", //prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Interal Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect)
      return res.status(404).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 1000,
      httpOnly: true, //prevent xss attack,
      sameSute: "strict", //prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Interal Server error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout success" });
};

export { login, logout, signup };
