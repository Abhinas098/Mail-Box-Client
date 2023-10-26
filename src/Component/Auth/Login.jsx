import React, { useRef, useState } from "react";

import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";
import {
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const history = useHistory();

  const emailRef = useRef();
  const passwordRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [password, confirmPassword] = useState(true);
  const [validate, setValidate] = useState(false);
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;

    // check mail
    const apiKey = "44abc7d790dd4880b413352a60b66e10";
    const apiURL =
      "https://emailvalidation.abstractapi.com/v1/?api_key=" + apiKey;

    const checkMail = async () => {
      try {
        const response = await fetch(apiURL + "&email=" + enteredEmail);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data.is_valid_format.value);
      } catch (error) {
        toast.error(error.message);
      }
    };
    checkMail();

    const form = e.currentTarget;
    if (form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidate(true);
    setIsLoading(true);
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC5RfB2zeAPwPIykibRKYnL7KdPnkq49Bw",
      {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        confirmPassword(true);
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          res.json().then((data) => {
            let errorMsg = "Authotication Failed";
            if (data && data.error && data.error.message) {
              errorMsg = data.error.message;
            }
            confirmPassword(errorMsg);
            throw new Error(errorMsg);
          });
        }
      })
      .then((data) => {
        if (data.idToken) {
          localStorage.setItem("token", data.idToken);
          dispatch(authActions.isLogin(data.idToken));
        }
        localStorage.setItem("email", enteredEmail);
        toast.success("Login Successfully!");

        history.replace("./home");
      })
      .catch((err) => {
        console.log(err.message);
        toast.error(err.message);
      });
  };

  const showPassword = () => {
    setVisible(visible ? false : true);
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={6} lg={4} xs={10}>
            <Card className="form">
              <Card.Body className="mb-2 mt-md-2">
                <h2 className="fw-bold mb-4 text-center">Sign in </h2>
                {/* <hr /> */}
                <Form validated={validate} noValidate onSubmit={submitHandler}>
                  <Form.Group className="mb-2 mt-3" controlId="formBasicEmail">
                    <FloatingLabel label="Email">
                      <Form.Control
                        required
                        ref={emailRef}
                        type="email"
                        placeholder="Enter email"
                        className="input"
                      />
                    </FloatingLabel>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mt-4">
                    <FloatingLabel label="Password" className="pass-wrapper">
                      <Form.Control
                        required
                        ref={passwordRef}
                        type={visible ? "text" : "password"}
                        placeholder="Password"
                        className="input"
                      />
                      <i onClick={showPassword} className="eye">
                        {" "}
                        {!visible ? <BsEye /> : <BsEyeSlash />}
                      </i>
                    </FloatingLabel>
                  </Form.Group>

                  <div className="d-flex justify-content-between text-danger align-items-center fw-bold ">
                    <div className="text-danger ">{password}</div>
                    <Link to="/forgot" className="text-danger">
                      <i>Forget password?</i>
                    </Link>
                  </div>

                  <div className="text-center">
                    <Button type="submit" variant="outline-dark" size="lg">
                      Login
                    </Button>{" "}
                  </div>

                  {isLoading && <p>Loading....</p>}
                </Form>
                <p className="mb-0 mt-3 text-center">
                  Don't have an account??{" "}
                  <Link to="/register" className="fw-bold">
                    Register
                  </Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
