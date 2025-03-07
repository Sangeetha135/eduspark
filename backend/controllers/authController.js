import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Educator from "../models/Educator.js";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    console.log("Registration succesful");
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerEducator = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newEducator = new Educator({
      username,
      email,
      password: hashedPassword,
    });
    await newEducator.save();
    console.log("Registration succesful");
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  console.log("Login Displayed.....");
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isStudent: user.isStudent,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getuserinfo = async (req, res) => {
  console.log(req.userId);
  const user = await User.findById(req.userId);
  console.log(user);
  if (user) {
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isStudent: user.isStudent,
      },
    });
  } else {
    const educator = await Educator.findById(req.userId);
    console.log(educator);
    if (educator) {
      res.status(200).json({
        user: {
          id: educator._id,
          username: educator.username,
          email: educator.email,
          isStudent: educator.isStudent,
        },
      });
    }
  }
};

export const loginEducator = async (req, res) => {
  console.log("Login Displayed.....");
  const { email, password } = req.body;

  try {
    const educator = await Educator.findOne({ email });
    if (!educator) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, educator.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: educator._id, email: educator.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: {
        id: educator._id,
        username: educator.username,
        email: educator.email,
        isStudent: educator.isStudent,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    console.log("Logged Out....");
    res.cookie("jwt", "", {
      dur: 0,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).send("Logout Successful");
  } catch (error) {
    console.error("Error logging out", error);
    res.status(500).json({ message: "Error Logging out", error });
  }
};

export const getchat = async (req, res) => {
  try {
    const query = req.body.query;
    console.log("Received query:", query);

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `give reply in less than two lines for the question: ${query}`,
              },
            ],
          },
        ],
      },
      { params: { key: process.env.GEMINI_API_KEY } }
    );

    //console.log("Full Gemini response:", JSON.stringify(response.data, null, 2));

    const reply =
      response.data.candidates[0]?.content?.parts[0]?.text || "No response";

    //console.log("Gemini reply:", reply);

    res.json({ reply });
  } catch (error) {
    console.error("Error:", error);
    if (error.response) {
      console.error("Error details:", error.response.data);
      res.status(error.response.status).json({
        error: error.response.data.error.message || "Failed to fetch response",
      });
    } else {
      res.status(500).json({ error: "Failed to fetch response" });
    }
  }
};

export const getstudentprofile = async (req, res) => {
  const query = req.params.id;
  const user = await User.findById(query);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  } else {
    res.status(200).json(user);
  }
};
