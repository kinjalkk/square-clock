import { login } from "@/lib/actions/user.actions";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { decode } from "next-auth/jwt";

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Credentials missing");
        }

        const user = await login(credentials?.username, credentials?.password);
        // Add logic here to look up the user from the credentials supplied

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  session: {
    maxAge: (60 *60),
  },
  callbacks: {
    async jwt({token, user}:{token:any, user:any}): Promise<any>{
      if(user){
        token.username = user.username
        token.id=user._id
        token.isAdmin=user.isAdmin
      }
      return token;
    },
    async session({session, token}: {session: any, token: any}): Promise<any>{
      session.user.username = token.username
      session.user.id=token.id
      session.isAdmin=token.isAdmin
      return session
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
