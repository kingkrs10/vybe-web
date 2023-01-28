import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
// import { useAtom } from "jotai";
// import { sessionAtom } from "@/lib/atoms";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }: { account: any; profile?: any }) {
      if (account.provider === "google") {
        const user = await axios.get(
          `${process.env.NEXT_PUBLIC_APIURL}/users/getAuthToken/${profile.email}`
        );
        // account.userData = user.data.data;

        if (user.data.data.length === 0) {
          const newUser = await axios.post(
            `${process.env.NEXT_PUBLIC_APIURL}/users`,
            {
              emailAddress: profile.email,
              firstName: profile.given_name,
              lastName: profile.family_name,
            }
          );
        }
      }
      return true;
    },
    async jwt({
      token,
      account,
      profile,
    }: {
      token: any;
      account?: any;
      profile?: any;
    }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: any;
      token: any;
      user: any;
    }) {
      const userData = await axios.get(
        `${process.env.NEXT_PUBLIC_APIURL}/users/${token.email}`
      );
      session.accessToken = token.accessToken;
      session.user.userData = userData.data.data;

      return session;
    },
  },
};
export default NextAuth(authOptions);
