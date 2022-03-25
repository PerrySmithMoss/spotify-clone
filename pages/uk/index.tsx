import type { NextPage } from "next";
import Head from "next/head";
import { Footer } from "../../components/Footer/Footer";
import { Hero } from "../../components/Hero/Hero";
import { Nabar } from "../../components/Navbar/Nabar";

const Uk: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Spotify</title>
        <meta name="description" content="A redesign of the Spotify web app." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nabar />
      <Hero />
      <Footer />
    </div>
  );
};

export default Uk;
