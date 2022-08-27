import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import Head from 'next/head';

function App({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>EY Blockchain Badge</title>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    </Head>

    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  </>;
}

export default App
