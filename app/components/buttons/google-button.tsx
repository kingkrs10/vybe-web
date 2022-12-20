"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  // const [session, loading] = useSession();
  //   const { data: session, status } = useSession();
  //   return (
  //     <div>
  //       {status == "loading" && <p>Loading..</p>}
  //       {!session && (
  //         <>
  //           Not signed in <br />
  //           <button
  //             onClick={() =>
  //               signIn("google", { callbackUrl: "http://localhost:3000/" })
  //             }
  //           >
  //             Sign in
  //           </button>
  //         </>
  //       )}
  //       {session && (
  //         <>
  //           Signed in as {session.user.name} <br />
  //           <button onClick={() => signOut()}>Sign out</button>
  //         </>
  //       )}
  //     </div>
  //   );
  const { data: session } = useSession();
  if (!session) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem" }}>Login with Google</h1>

        <button
          onClick={() =>
            signIn("google", {
              callbackUrl: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/dashboard/events`,
              // callbackUrl: "/dashboard",
            })
          }
          className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 px-6 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white"
        >
          Proceed
        </button>
      </div>
    );
  } else {
    return (
      <>
        {/* Signed in as {session.user.email} <br /> */}
        {/* <UserInformation data={session.user} /> */}
        <button onClick={() => signOut()}>Sign out</button>
        {/* {children} */}
      </>
    );
  }
}
