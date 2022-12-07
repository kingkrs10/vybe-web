import { unstable_getServerSession } from "next-auth/next";
// import { useSession, signIn, signOut } from "next-auth/react";
import SignIn from "./signin";

export default async function Component() {
  // const { data: session } = useSession();
  const session = await unstable_getServerSession();
  if (!session) {
    return <SignIn signin={true} />;
  } else {
    return <SignIn signin={false} />;
  }
}
