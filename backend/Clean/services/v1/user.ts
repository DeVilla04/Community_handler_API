import Database from "@loaders/v1/database";
import { Snowflake } from "@theinternetfolks/snowflake";
import Validator from "validatorjs";
import bcrypt from "bcrypt";
import { generateToken } from "@services/v1/authentication";
import { User } from "@prisma/client";
class UserService {
  static async signUp(name: string, email: string, password: string) {
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
      return {
        status: false,
        errors: [
          {
            param: "name",
            message: "Name should be at least 2 characters.",
            code: "INVALID_INPUT",
          },
        ],
      };
    }
    if (flag === 2) {
      return {
        status: false,
        errors: [
          {
            param: "email",
            message: "Email is invalid.",
            code: "INVALID_INPUT",
          },
        ],
      };
    }
    if (flag === 3) {
      return {
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
      };
    }
    if (flag === 4) {
      return {
        status: false,
        errors: [
          {
            param: "password",
            message: "Password should be at least 2 characters.",
            code: "INVALID_INPUT",
          },
        ],
      };
    }
    if (flag === 5) {
      return {
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
      };
    }
    if (flag === 6) {
      return {
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
      };
    }
    if (flag === 7) {
      return {
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
      };
    }
    // Check if the user already exists
    const userExists = await Database.instance.user.findFirst({
      where: { email: email },
    });
    if (userExists) {
      return {
        status: false,
        errors: [
          {
            param: "email",
            message: "User with this email address already exists.",
            code: "RESOURCE_EXISTS",
          },
        ],
      };
    } else {
      try {
        // Create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = Snowflake.generate();
        const newUser: User = await Database.instance.user.create({
          data: {
            id: id,
            name: name,
            email: email,
            password: hashedPassword,
          },
        });

        // Generate a token
        const token = generateToken(newUser);

        // Return the response
        return { status: true, newUser, token };
      } catch (error: any) {
        return {
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
        };
      }
    }
  }

  static async signIn(email: string, password: string) {
    // Validate the input
    const emailValidation = new Validator(
      { email },
      { email: "required|email" }
    );

    if (emailValidation.fails()) {
      return {
        status: false,
        errors: [
          {
            param: "email",
            message: "Please Provide a valid email address.",
            code: "INVALID_INPUT",
          },
        ],
      };
    }

    // Check if the user exists
    try {
      // Check if the user exists
      const user = await Database.instance.user.findFirst({
        where: { email: email },
      });
      if (!user) {
        return {
          status: false,
          errors: [
            {
              param: "email",
              message: "User with this email address does not exist.",
              code: "RESOURCE_NOT_FOUND",
            },
          ],
        };
      } else {
        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          return {
            status: false,
            errors: [
              {
                param: "password",
                message: "Incorrect password.",
                code: "INVALID_CREDENTIALS",
              },
            ],
          };
        } else {
          // Generate a token
          const token = generateToken(user);

          // Return the response
          return {
            status: true,
            content: {
              data: {
                id: user.id,
                name: user.name,
                email: user.email,
                // createdAt: user.createdAt,
              },
            },
            meta: {
              access_token: token,
            },
          };
        }
      }
    } catch (error: any) {
      return {
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
      };
    }
  }

  static async getMe(userId: string) {
    try {
      const user = await Database.instance.user.findUnique({
        where: { id: userId },
      }); // find the user in the database
      if (!user) {
        return {
          status: false,
          errors: [
            {
              param: "user",
              message: "User not found.",
              code: "RESOURCE_NOT_FOUND",
            },
          ],
        };
      }
      return {
        status: "true",
        content: {
          data: {
            // return the user details
            id: user.id,
            name: user.name,
            email: user.email,
            // createdAt: user.createdAt,
          },
        },
      };
    } catch (error: any) {
      return {
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
      };
    }
  }
}

export default UserService;
