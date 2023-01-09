"use client";

import { useSession, signIn, signOut } from "next-auth/react";
// import UserInformation from "./user-information";

export default function Component({ signin }: { signin: any }) {
  //   const { data: session } = useSession();
  //   console.log(JSON.stringify(params));
  if (signin) {
    return <a onClick={() => signIn()}>Sign in</a>;
  } else {
    return <a onClick={() => signOut()}>Sign out</a>;
  }
}
