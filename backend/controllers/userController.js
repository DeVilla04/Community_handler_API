import User from "../models/user.js";
import { generateToken } from "../middleware/authentication.js";
import validator from "validatorjs";
import { Snowflake } from "@theinternetfolks/snowflake";
import bcrypt from "bcrypt";

const signUp = async (req, res) => {
  // implement logic to sign up a user
  const { name, email, password } = req.body;
  const rules = {
    name: "required|string|min:2",
    email: "required|email",
    password: "required|string|min:6",
  };
  const validation = new validator(req.body, rules);
  if (validation.fails()) {
    return res.status(400).json(validation.errors);
  }
  const id = Snowflake.generate();
  const hashedPassword = await bcrypt.hash(password, 10);

  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    res.send("User already exists");
  } else {
    try {
      const user = await User.create({
        id: id,
        name: name,
        email: email,
        password: hashedPassword,
      });
      const token = generateToken(user);
      res
        .status(201)
        .cookie("token", token)
        .json({
          status: "true",
          content: {
            data: {
              id: user.id,
              name: user.name,
              email: user.email,
              createdAt: user.createdAt,
            },
          },
          meta: {
            access_token: token,
          },
        });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }
};

const signIn = async (req, res) => {
  // implement logic to sign in a user
  const { email, password } = req.body;
  const rules = {
    email: "required|email",
    password: "required|string|min:6",
  };
  const validation = new validator(req.body, rules);
  if (validation.fails()) {
    return res.status(400).json(validation.errors);
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (isPasswordCorrect) {
        const token = generateToken(user);
        res
          .status(200)
          .cookie("token", token, { httpOnly: true })
          .json({
            status: "true",
            content: {
              data: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
              },
            },
            meta: {
              access_token: token,
            },
          });
      } else {
        res.send("Invalid password");
      }
    } else {
      res.send("User does not exist");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

async function getMe(req, res) {
  // implement logic to retrieve the current user
  // Should return the details on the currently signed in user, using the access token.
  try {
    const decoded = req.user;
    const user = await User.findOne({ where: { id: decoded.id } });
    res.status(200).json({
      status: "true",
      content: {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export { signUp, signIn, getMe };
