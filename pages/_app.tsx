import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import "@rainbow-me/rainbowkit/styles.css";
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import theme from "lib/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SiweProvider } from "@randombits/use-siwe";
import RainbowKitUseSiweProvider from "@randombits/rainbowkit-use-siwe-auth";
import Layout from "components/layout";

const { chains, provider } = configureChains(
  [process.env.NEXT_PUBLIC_NETWORK === "maticmum" ? polygonMumbai : polygon],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "EY Web3 Badges",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 10000 },
  },
});

function App({ Component, pageProps, router }: AppProps) {
  if (router.route === "/badges/[tokenId]")
    return (
      <>
        <Head>
          <title>EY Web3 Badge</title>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
        </Head>

        <ChakraProvider resetCSS theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </>
    );

  return (
    <>
      <Head>
        <title>EY Web3 Badge</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>

      <WagmiConfig client={wagmiClient}>
        <SiweProvider>
          <RainbowKitUseSiweProvider>
            <RainbowKitProvider chains={chains} theme={darkTheme()}>
              <ChakraProvider resetCSS theme={theme}>
                <QueryClientProvider client={queryClient}>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </QueryClientProvider>
              </ChakraProvider>
            </RainbowKitProvider>
          </RainbowKitUseSiweProvider>
        </SiweProvider>
      </WagmiConfig>
    </>
  );
}

export default App;
