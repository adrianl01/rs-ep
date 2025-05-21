import { User } from "../models/auth";
export async function findOrCreateUser({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  const resUser = await User.findByEmailOrCreate({ email, name });
  if (resUser) {
    return resUser;
  } else {
    throw new Error("User not found");
  }
}
