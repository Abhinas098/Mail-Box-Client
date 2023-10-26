import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { authActions } from "../../store/auth-slice";
import { AiOutlineMail } from "react-icons/ai";
import { useState } from "react";
function Header() {
  const history = useHistory();
  const isLogin = useSelector((state) => state.auth.isLoggedIn);

  const dispatch = useDispatch();

  const [theme, setTheme] = useState("night");

  const themeHandler = () => {
    if (theme === "day") {
      setTheme("night");
    } else {
      setTheme("day");
    }
  };
  if (theme === "day") {
    document.body.className = "day";
  } else {
    document.body.className = "night";
  }

  const logoutHandler = () => {
    dispatch(authActions.isLogout());
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  };

  return (
    <Navbar
      className="bg-body-tertiary"
      collapseOnSelect
      expand="lg"
      variant="dark"
      bg="dark"
    >
      <Container>
        <Navbar.Brand classNamse="fw-bold" onClick={() => history.push("/")}>
          Mail Box Client
          <AiOutlineMail style={{ margin: "10px" }} />
        </Navbar.Brand>
        <h3
          style={{ padding: "0px 10px", cursor: "pointer" }}
          onClick={themeHandler}
        >
          {theme === "day" ? <>🌙</> : <>🔆</>}
        </h3>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            {!isLogin && (
              <Nav.Link onClick={() => history.push("/login")}>Login</Nav.Link>
            )}
            {!isLogin && (
              <Nav.Link onClick={() => history.push("/register")}>
                Sign up
              </Nav.Link>
            )}
            {isLogin && (
              <Nav.Link onClick={() => history.push("/home")}>Home</Nav.Link>
            )}
            {isLogin && (
              <Nav.Link onClick={() => history.push("/about")}>About</Nav.Link>
            )}
            {isLogin && <Nav.Link onClick={logoutHandler}>LogOut</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
