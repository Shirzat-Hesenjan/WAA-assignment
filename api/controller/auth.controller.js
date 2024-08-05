import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  //db operations
  const { username, email, password } = req.body;
  //hash the passwword
  try {
    // HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    //create a new user and save to db
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    console.log(newUser);

    res.status(201).json({ message: "User created succesfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to created user" });
  }
};
export const login = async (req, res) => {
  //db operations
  const { username, password } = req.body;
  try {
    //check if the user exists
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(401).json({ message: "invalid credentials" });
    //check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ message: "invalid credentials" });
    //generate coockie token and send

    // res
    //   .setHeader("Set-Cookie", "test=" + "value")
    //   .json({ message: "login successful" });
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        //secure:true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login" });
  }
};
export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "logout succesfull" });
};
