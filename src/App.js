import { useSelector } from "react-redux";
import "./App.css";
import Registration from "./Component/Auth/Registration";
import Login from "./Component/Auth/Login";
import Home from "./Component/pages/Home";
import { Redirect, Route, Switch } from "react-router-dom";

function App() {
  const isLogin = useSelector((state) => state.auth.isLoggedIn);
  console.log(isLogin);
  return (
    <>
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
      </Switch>
    </>
  );
}

export default App;
