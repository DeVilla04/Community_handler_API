import User from "../models/user.js";
import { generateToken } from "../middleware/authentication.js";
import validator from "validatorjs";
import { Snowflake } from "@theinternetfolks/snowflake";
import bcrypt from "bcrypt";

const signUp = async (req, res) => {
  // implement logic to sign up a user
  const { name, email, password } = req.body; // get the name, email and password from the request body
  const rules = {
    // define the validation rules
    name: "required|string|min:2",
    email: "required|email",
    password: "required|string|min:6",
  };
  const validation = new validator(req.body, rules); // validate the request body
  if (validation.fails()) {
    return res.status(400).json(validation.errors); // return validation errors
  }
  const id = Snowflake.generate(); // generate a unique id
  const hashedPassword = await bcrypt.hash(password, 10); // hash the password

  const userExists = await User.findOne({ where: { email } }); // check if a user with the same email already exists
  if (userExists) {
    // if user exists
    res.send("User already exists");
  } else {
    // if user does not exist
    try {
      const user = await User.create({
        // create a new user in the database with the name, email and hashed password
        id: id,
        name: name,
        email: email,
        password: hashedPassword,
      });
      const token = generateToken(user); // generate a token for the user
      res // return the created user and the token
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
  const { email, password } = req.body; // get the email and password from the request body
  const rules = {
    // define the validation rules
    email: "required|email",
    password: "required|string|min:6",
  };
  const validation = new validator(req.body, rules);
  if (validation.fails()) {
    return res.status(400).json(validation.errors);
  }

  try {
    // try to find a user with the email provided
    const user = await User.findOne({ where: { email } }); // if user exists
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password); // check if the password provided is correct
      if (isPasswordCorrect) {
        // if password is correct
        const token = generateToken(user); // generate a token for the user
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
        res.send("Invalid password"); // if password is incorrect
      }
    } else {
      res.send("User does not exist"); // if user does not exist
    }
  } catch (error) {
    res.status(400).json({ message: error.message }); // return error
  }
};

async function getMe(req, res) {
  // implement logic to retrieve the current user
  // Should return the details on the currently signed in user, using the access token.
  try {
    const decoded = req.user; // get the user from the request object (set by the authentication middleware)
    const user = await User.findOne({ where: { id: decoded.id } }); // find the user in the database
    res.status(200).json({
      status: "true",
      content: {
        data: {
          // return the user details
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
