import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import ApiClient from "./axios";

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

        if (user.data.data.length === 0) {
          const newUser = await axios.post(
            `${process.env.NEXT_PUBLIC_APIURL}/users`,
            {
              emailAddress: profile.email,
              firstName: profile.given_name,
              lastName: profile.family_name,
            }
          );

          if (newUser.data.data.length !== 0) {
            const user = await axios.get(
              `${process.env.NEXT_PUBLIC_APIURL}/users/getAuthToken/${profile.email}`
            );
            await ApiClient(user?.data?.data.authToken).post(
              `/stripe/createCustomer`,
              {
                name: profile.name,
                email: profile.email,
                uid: user.data.data.userId,
              }
            );
          }
        }

        if (user.data.data.stripeCustomerId === null) {
          const stripeUser = await axios.get(
            `${process.env.NEXT_PUBLIC_APIURL}/users/getAuthToken/${profile.email}`
          );
          await ApiClient(stripeUser?.data?.data.authToken).post(
            `/stripe/createCustomer`,
            {
              name: profile.name,
              email: profile.email,
              uid: stripeUser.data.data.userId,
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
        // token.accessToken = account.access_token;
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
      const getuser = await axios.get(
        `${process.env.NEXT_PUBLIC_APIURL}/users/getAuthToken/${token.email}`
      );
      session.user.token = getuser.data.data.authToken;
      session.user.data = getuser.data.data;

      return session;
    },
  },
};
export default NextAuth(authOptions);
