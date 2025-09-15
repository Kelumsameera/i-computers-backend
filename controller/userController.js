import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Create a user
export function createUser(req, res) {
  const data = req.body;

  const haschedPassword = bcrypt.hashSync(data.password, 10);
  console.log(haschedPassword);
  // res.json({ haschedPassword });

  const user = new User({
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    password: haschedPassword,
    role: data.role,
  });
  user.save().then(() => {
    res.json({
      message: "User created successfully",
    });
  });
}

export function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  // find user by email in the database
  User.find({ email: email }).then((users) => {
    if (users[0] == null) {
      res.json({
        message: "User not found",
      });
    } else {
      //database found user password cheking
      const user = users[0];

      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (isPasswordCorrect) {
        const payload = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmailVeryfied: user.isEmailVerified,
          Image: user.Image,
        };
        const token = jwt.sign(payload, "secretKey96$2025");

        res.json({
          message: "Login Successfully",
          token: token,
        });
      } else {
        res.json({
          message: "Invalid password",
        });
      }
    }
  });
}
export function isAdmin(req) {
  if (req.user == null) {
    return false;
  }
  if (req.user.role != "admin") {
    return false;
  }
  return true;
}
