"use client";

import Auth from "@/components/auth";
import "react-toastify/dist/ReactToastify.css";
import { ChakraProvider, useDisclosure, extendTheme } from "@chakra-ui/react";
import { modalTheme } from "@/components/theme/modalTheme";
import { switchTheme } from "@/components/theme/switchTheme";
import { useAuthStore } from "@/store/auth/authStore";
import { UserType } from "@/services/contract";
import { MainLayout } from "@/components/main_layout";
import RegisterModal from "@/components/Modals/RegisterModal";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import { RegisterBanner } from "@/components/landingPage/RegisterBanner";
import "@fontsource/slackey";
import "@fontsource-variable/jetbrains-mono";
import { useRouter } from "next/router";
import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import "@rainbow-me/rainbowkit/styles.css";
import {
  walletConnectWallet,
  metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const projectId = process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID;

const { chains, publicClient } = configureChains(
  [goerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_GOERLI }),
    publicProvider(),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      walletConnectWallet({ projectId, chains }),
      metaMaskWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

const fonts = {
  heading: `'Slackey', sans-serif`,
  body: `'JetBrains Mono', monospace`,
};

const breakpoints = {
  sm: "48em",
  md: "62em",
  lg: "80em",
  xl: "96em",
  "2xl": "120em",
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const components = { Modal: modalTheme, Switch: switchTheme };

export const theme = extendTheme({
  config,
  colors,
  fonts,
  components,
  breakpoints,
});

function MyApp({ Component, pageProps }) {
  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  const { userType, isLoggedIn } = useAuthStore((state) => ({
    userType: state.userType,
    isLoggedIn: state.isLoggedIn,
  }));

  const router = useRouter();

  const [showStartEarning, setShowStartEarning] = useState(false);

  useEffect(() => {
    if (isLoggedIn && userType === UserType.UNREGISTERED) {
      setShowStartEarning(true);
    }
  }, [isRegisterOpen, isLoggedIn, userType]);

  return (
    <ChakraProvider
      theme={theme}
      toastOptions={{
        defaultOptions: {
          position: "bottom",
          isClosable: true,
          duration: 9000,
        },
      }}
    >
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} modalSize="compact">
          <Auth onRegisterOpen={onRegisterOpen} />

          {showStartEarning && !isRegisterOpen && (
            <RegisterBanner onRegisterOpen={onRegisterOpen} />
          )}

          <MainLayout
            showStartEarning={showStartEarning}
            isRegisterOpen={isRegisterOpen}
          />
          <Component {...pageProps} />

          {router.pathname === "/" && <Footer />}

          <RegisterModal isOpen={isRegisterOpen} onClose={onRegisterClose} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
