import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export default async function handler(req: any, res: any) {
  const session = await getCurrentUser();
  //   console.log(session);
  res.status(200).json(session);
}
