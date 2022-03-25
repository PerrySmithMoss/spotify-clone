import type { NextPage } from "next";
import Head from "next/head";
import { getProviders } from "next-auth/react";
import { Navbar } from "../../components/Auth/Navbar/Navbar";
import { Login as LoginComp } from "../../components/Auth/Login/Login";

const Login: NextPage = ({ providers }: any) => {
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

export const getServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
};
