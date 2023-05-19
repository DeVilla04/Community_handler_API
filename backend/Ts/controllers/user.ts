import User from "../models/user";
import Validator from "validatorjs";
import { Snowflake } from "@theinternetfolks/snowflake";
import { Request, Response, RequestHandler } from "express";
import {
  generateToken,
  AuthenticatedRequest,
} from "../middlewares/authentication";
import bcrypt from "bcrypt";

// Create a new user
const signUp: RequestHandler = async (req: Request, res: Response) => {
  const name: string = req.body.name;
  const email: string = req.body.email;
  const password: string = req.body.password;

  // Validate the input

  const nameValidation = new Validator(
    { name },
    {
      name: "required|string|min:2",
    }
  );
  const emailValidation = new Validator(
    { email },
    {
      email: "required|email",
    }
  );
  const passwordValidation = new Validator(
    { password },
    {
      password: "required|string|min:2",
    }
  );
  let flag: number = 0;
  if (nameValidation.fails()) {
    flag += 1;
  }
  if (emailValidation.fails()) {
    flag += 2;
  }
  if (passwordValidation.fails()) {
    flag += 4;
  }
  if (flag === 1) {
    res.status(400).json({
      status: false,
      errors: [
        {
          param: "name",
          message: "Name should be at least 2 characters.",
          code: "INVALID_INPUT",
        },
      ],
    });
  }
  if (flag === 2) {
    res.status(400).json({
      status: false,
      errors: [
        {
          param: "email",
          message: "Email is invalid.",
          code: "INVALID_INPUT",
        },
      ],
    });
  }
  if (flag === 3) {
    res.status(400).json({
      status: false,
      errors: [
        {
          param: "name",
          message: "Name should be at least 2 characters.",
          code: "INVALID_INPUT",
        },
        {
          param: "email",
          message: "Email is invalid.",
          code: "INVALID_INPUT",
        },
      ],
    });
  }
  if (flag === 4) {
    res.status(400).json({
      status: false,
      errors: [
        {
          param: "password",
          message: "Password should be at least 2 characters.",
          code: "INVALID_INPUT",
        },
      ],
    });
  }
  if (flag === 5) {
    res.status(400).json({
      status: false,
      errors: [
        {
          param: "name",
          message: "Name should be at least 2 characters.",
          code: "INVALID_INPUT",
        },
        {
          param: "password",
          message: "Password should be at least 2 characters.",
          code: "INVALID_INPUT",
        },
      ],
    });
  }
  if (flag === 6) {
    res.status(400).json({
      status: false,
      errors: [
        {
          param: "email",
          message: "Email is invalid.",
          code: "INVALID_INPUT",
        },
        {
          param: "password",
          message: "Password should be at least 2 characters.",
          code: "INVALID_INPUT",
        },
      ],
    });
  }
  if (flag === 7) {
    res.status(400).json({
      status: false,
      errors: [
        {
          param: "name",
          message: "Name should be at least 2 characters.",
          code: "INVALID_INPUT",
        },
        {
          param: "email",
          message: "Email is invalid.",
          code: "INVALID_INPUT",
        },
        {
          param: "password",
          message: "Password should be at least 2 characters.",
          code: "INVALID_INPUT",
        },
      ],
    });
  }
  // Check if the user already exists
  const userExists = await User.findOne({ where: { email: email } });
  if (userExists) {
    res.status(409).json({
      status: false,
      errors: [
        {
          param: "email",
          message: "User with this email address already exists.",
          code: "RESOURCE_EXISTS",
        },
      ],
    });
  } else {
    try {
      // Create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = Snowflake.generate();
      const newUser: User = await User.create({
        id: id,
        name: name,
        email: email,
        password: hashedPassword,
      });

      // Generate a token
      const token = generateToken(newUser.dataValues);

      // Return the response
      res // return the created user and the token
        .status(201)
        .cookie("token", token)
        .json({
          status: "true",
          content: {
            data: {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              createdAt: newUser.createdAt,
            },
          },
          meta: {
            access_token: token,
          },
        });
    } catch (error: any) {
      res.status(500).json({
        status: false,
        errors: [
          {
            param: "server",
            message: "Something went wrong, please try again later.",
            code: "INTERNAL_SERVER_ERROR",
          },
          {
            error: error.message,
          },
        ],
      });
    }
  }
};

const signIn: RequestHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate the input
  const emailValidation = new Validator({ email }, { email: "required|email" });

  if (emailValidation.fails()) {
    return res.status(400).json({
      status: false,
      errors: [
        {
          param: "email",
          message: "Please Provide a valid email address.",
          code: "INVALID_INPUT",
        },
      ],
    });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({
        status: false,
        errors: [
          {
            param: "email",
            message: "User with this email address does not exist.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    } else {
      // Check if the password is correct
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          status: false,
          errors: [
            {
              param: "password",
              message: "Incorrect password.",
              code: "INVALID_CREDENTIALS",
            },
          ],
        });
      } else {
        // Generate a token
        const token = generateToken(user.dataValues);
        req.cookies.token = token;
        // Return the response
        return res
          .status(200)
          .cookie("token", token)
          .json({
            status: true,
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
      }
    }
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      errors: [
        {
          param: "server",
          message: "Something went wrong, please try again later.",
          code: "INTERNAL_SERVER_ERROR",
        },
        {
          error: error.message,
        },
      ],
    });
  }
};

const getMe: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  // implement logic to retrieve the current user
  // Should return the details on the currently signed in user, using the access token.
  try {
    const decoded = req.user; // get the user from the request object (set by the authentication middleware)
    const user = await User.findOne({ where: { id: decoded.id } }); // find the user in the database
    if (!user) {
      return res.status(404).json({
        status: false,
        errors: [
          {
            param: "user",
            message: "User not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }
    return res.status(200).json({
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
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      errors: [
        {
          param: "server",
          message: "Something went wrong, please try again later.",
          code: "INTERNAL_SERVER_ERROR",
        },
        {
          error: error.message,
        },
      ],
    });
  }
};

export { signUp, signIn, getMe };
