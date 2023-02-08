import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getSession() {
  // console.log(await unstable_getServerSession(authOptions));
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  // console.log(session);
  return session?.user;
}
