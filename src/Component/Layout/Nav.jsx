import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { authActions } from "../../store/auth-slice";

function Header() {
  const history = useHistory();
  const isLogin = useSelector((state) => state.auth.isLoggedIn);

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(authActions.isLogout());
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  };

  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" bg="dark">
      <Container>
        <Navbar.Brand className="fw-bold" onClick={() => history.push("/")}>
          Mail Box Client
        </Navbar.Brand>

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
            {isLogin && <Nav.Link onClick={logoutHandler}>LogOut</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
