import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      accessToken: string
      refreshToken: string
      username: string
      image: string
      name: string
      id: string
      email: string
    },
    error: unknown
  }
}