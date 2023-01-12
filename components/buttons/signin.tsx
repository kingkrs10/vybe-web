"use client";
import { useSession, signIn, signOut } from "next-auth/react";
// import UserInformation from "./user-information";

export default function Component({ signin }: { signin: any }) {
  //   const { data: session } = useSession();
  //   console.log(JSON.stringify(params));
  if (signin) {
    return (
      <a
        className={
          "block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
        }
        onClick={() => signIn()}
      >
        Sign in
      </a>
    );
  } else {
    return (
      <a
        className={
          "block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
        }
        onClick={() => signOut()}
      >
        Sign out
      </a>
    );
  }
}
