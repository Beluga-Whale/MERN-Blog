import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      next(errorHandler(400, "All fields are required"));
    }

    // NOTE- ทำการhash รหัสเพือจะไว้เก็บใน DB
    const hashPasword = bcryptjs.hashSync(password, 10);
    await User.create({
      username,
      email,
      password: hashPasword,
    });

    res.status(200).send("Signup Success");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      next(errorHandler(400, "All fields are required"));
    }

    // NOTE -  หาใน DB ว่ามี email นี้ไหม
    const emailCheck = await User.findOne({ email });
    if (!emailCheck) {
      next(errorHandler(404, "User not found"));
    }
    // NOTE - เอา passwordจาก input กับ passwordจากDB มาเช็คว่าตรงกันไหม
    const passwordCheck = bcryptjs.compareSync(password, emailCheck.password);

    if (!passwordCheck) {
      return next(errorHandler(400, "Invalid password"));
    }

    const token = jwt.sign(
      {
        id: emailCheck._id,
      },
      process.env.JWT_SECRET
    );

    // NOTE - เลือก response ไม่โชว์ password
    const { password: pass, ...rest } = emailCheck._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      // NOTE - ถ้า user มีอยู่ใน DB ก้ให้สามารถ set cookie ได้้เลย
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      // NOTE - แต่ถ้าไม่มี ก้ให้ทำการเก็บลง DB แล้วทำการ set cookie

      // NOTE - ต้องทำการ randompasswordมาให้่เพราะ DB Requiered password
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);

      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

      const { password, ...rest } = newUser._doc;

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
