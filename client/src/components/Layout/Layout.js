import React from "react";
import Container from "@material-ui/core/Container";

// layout component to give structure to pages
const Layout = ({ children }) => {
  return (
    <Container
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      {children}
    </Container>
  );
};

export default Layout;
