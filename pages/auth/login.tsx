import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth/next";
import Head from "next/head";
import { Login as LoginComp } from "../../components/Auth/Login/Login";
import { Navbar } from "../../components/Auth/Navbar/Navbar";
import { authOptions } from "../../lib/auth";

const Login = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div>
      <Head>
        <title>Login | Spotify Clone</title>
        <meta name="description" content="Login to the Spotify web app." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <LoginComp providers={providers} />
    </div>
  );
};

export default Login;

export const getServerSideProps = (async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session && !session.error)
    return { redirect: { destination: "/", permanent: false } };
  const providers = { spotify: { id: "spotify", name: "Spotify" } };

  return {
    props: {
      providers,
    },
  };
}) satisfies GetServerSideProps;
