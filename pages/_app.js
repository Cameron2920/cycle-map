import "@/app/globals.css";
import Head from "next/head"; // adjust path if you put it in styles/global.css

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" sizes="1024x1024" href="/favicon.png" />
        <title>Cycle Log</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
