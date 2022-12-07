import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      // token.userRole = "admin";
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      // console.log("user: " + JSON.stringify(user));
      // console.log("token: " + JSON.stringify(token));
      // console.log("session: " + JSON.stringify(session));
      session.accessToken = token.accessToken;
      session.user.id = token.id;

      return session;
    },
  },
};
export default NextAuth(authOptions);
