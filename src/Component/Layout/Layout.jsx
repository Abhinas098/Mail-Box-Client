import React from "react";
import Header from "./Nav";

const Layout = (props) => {
  return (
    <>
      <Header />
      <main>{props.children}</main>
    </>
  );
};

export default Layout;
