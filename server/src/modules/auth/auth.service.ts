import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RegisterInput } from "./auth.validation";


export const registerUser = async (data: RegisterInput) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return {
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email,
    password: hashedPassword,
  };
};
export const loginUser = async (
  email: string,
  password: string
) => {
  // Temporary mock user
  const mockUser = {
    id: "123",
    name: "Jason",
    email: "jason@gmail.com",
    password: await bcrypt.hash("password123", 10),
  };

  if (email !== mockUser.email) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(
    password,
    mockUser.password
  );

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: mockUser.id,
      email: mockUser.email,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
    },
  };
};