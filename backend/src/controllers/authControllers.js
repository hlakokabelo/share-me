import User from "../models/User.js";

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
    if(existsingUser){
      return res.status(400).json({ message: "Email already exists, use different one" });

    }
  } catch (error) {}
};

const login = async (req, res) => {
  res.send("Login Route");
};

const logout = (req, res) => {
  res.send("Logout Route");
};

export { login, logout, signup };
