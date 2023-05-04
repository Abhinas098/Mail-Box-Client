import React from "react";
import Header from "./Nav";
import Sidebar from "../pages/SideBar";
import { useSelector } from "react-redux";

const Layout = (props) => {
  const isLogin = useSelector((state) => state.auth.isLoggedIn);
  return (
    <>
      <Header />
      {isLogin && <Sidebar />}
      <main>{props.children}</main>
    </>
  );
};

export default Layout;
