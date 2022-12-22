import { Container } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import Header from "./header";

const Layout = ({ children }: PropsWithChildren) => (
  <>
    <Header />

    <Container maxW="container.md" pt="10vh" pb={10}>
      {children}
    </Container>
  </>
);

export default Layout;
