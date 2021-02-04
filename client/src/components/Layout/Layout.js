import React from "react";
import "./Layout.css";
import Container from "@material-ui/core/Container";

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
