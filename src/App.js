import { useSelector } from "react-redux";
import "./App.css";
import Registration from "./Component/Auth/Registration";
import Login from "./Component/Auth/Login";
import Home from "./Component/pages/Home";
import { Redirect, Route, Switch } from "react-router-dom";
import Layout from "./Component/Layout/Layout";
import About from "./Component/pages/About";
import Indbox from "./Component/Mail/Indbox";

function App() {
  const isLogin = useSelector((state) => state.auth.isLoggedIn);
  console.log(isLogin);

  return (
    <>
      <Layout>
        <Switch>
          {!isLogin && (
            <Route path="/" exact>
              <Redirect to="login" />
            </Route>
          )}

          {!isLogin && (
            <Route path="/login">
              <Login />
            </Route>
          )}

          {!isLogin && (
            <Route path="/register">
              <Registration />
            </Route>
          )}
          {isLogin && (
            <Route path="/home">
              <Home />
            </Route>
          )}
          {isLogin && (
            <Route path="/email">
              <Indbox />
            </Route>
          )}
          {isLogin && (
            <Route path="/about">
              <About />
            </Route>
          )}
          {!isLogin && (
            <Route path="*">
              <Redirect to="/login" />
              <Login />
            </Route>
          )}
          {isLogin && (
            <Route path="*">
              <Redirect to="/home" />
              <Home />
            </Route>
          )}
        </Switch>
      </Layout>
    </>
  );
}

export default App;
