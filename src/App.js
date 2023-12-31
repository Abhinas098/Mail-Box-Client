import React, { useEffect, useState, lazy, Suspense } from "react";
import { CircleLoader } from "react-spinners";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.css";

// Lazy-loaded components
const Registration = lazy(() => import("./Component/Auth/Registration"));
const Login = lazy(() => import("./Component/Auth/Login"));
const Home = lazy(() => import("./Component/pages/Home"));
const Layout = lazy(() => import("./Component/Layout/Layout"));
const About = lazy(() => import("./Component/pages/About"));
const Indbox = lazy(() => import("./Component/Mail/Indbox"));
const Mails = lazy(() => import("./Component/Mail/ReadMails"));
const SendBox = lazy(() => import("./Component/Mail/SendBox"));
const ReadSendMail = lazy(() => import("./Component/Mail/ReadSendMail"));
const Forget = lazy(() => import("./Component/Auth/Forget"));
const TrashMail = lazy(() => import("./Component/Mail/TrashMail"));

function App() {
  const isLogin = useSelector((state) => state.auth.isLoggedIn);
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, []);

  const authRoutes = [
    { path: "/login", component: <Login /> },
    { path: "/forgot", component: <Forget /> },
    { path: "/register", component: <Registration /> },
  ];

  const privateRoutes = [
    { path: "/home", component: <Home /> },
    { path: "/about", component: <About /> },
    { path: "/sendmail", component: <SendBox /> },
    { path: "/sendmail/:id", component: <ReadSendMail /> },
    { path: "/email", component: <Indbox /> },
    { path: "/email/:id", component: <Mails /> },
    { path: "/trashmail", component: <TrashMail /> },
  ];

  useEffect(() => {
    !isLogin && !loading && history.replace("/login");
  }, [isLogin, loading, history]);

  const loader = (
    <div className="pre-loader night">
      <CircleLoader size="150px" color="#36d7b7" />
    </div>
  );
  return (
    <>
      {loading ? (
        <>{loader}</>
      ) : (
        <Suspense fallback={loader}>
          <Layout>
            <Switch>
              {/* Auth Routes */}
              {!isLogin &&
                authRoutes.map(({ path, component }, index) => (
                  <Route key={index} exact path={path}>
                    {component}
                  </Route>
                ))}

              {/* Private Routes */}
              {isLogin &&
                privateRoutes.map(({ path, component }, index) => (
                  <Route key={index} exact path={path}>
                    {component}
                  </Route>
                ))}

              {/* Default Redirects */}
              {!isLogin && (
                <Route path="*">
                  <Redirect to="/login" />
                </Route>
              )}
              {isLogin && (
                <Route path="*">
                  <Redirect to="/home" />
                </Route>
              )}
            </Switch>
          </Layout>
        </Suspense>
      )}
    </>
  );
}
export default App;
