import bcrypt from "bcrypt";
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