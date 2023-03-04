import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

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

        account.data = user.data.data;

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
        const tokenDetails = await axios.get(
          `${process.env.NEXT_PUBLIC_APIURL}/users/getAuthToken/${account.email}`
        );
        // if (getuser.data.data.length > 0) {
        // console.log(`user`, user);
        token.email = account.email;
        // token.userData = account.data;
        token.accessToken = tokenDetails.data.data.authToken;
        // }
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
      session.accessToken = token.accessToken;

      return session;
    },
  },
};
export default NextAuth(authOptions);
