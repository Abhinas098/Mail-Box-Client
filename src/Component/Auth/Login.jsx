import React, { useRef, useState } from "react";

import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

export default function Login() {
  const history = useHistory();

  const emailRef = useRef();
  const passwordRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [password, confirmPassword] = useState(true);
  const [validate, setValidate] = useState(false);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;

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
        alert("Sucessfull!");

        history.replace("./home");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  return (
    <>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={7} lg={5} xs={10}>
            <Card className="form">
              <Card.Body className="mb-3 mt-md-4">
                <h2 className="fw-bold mb-2 text-center text-uppercase ">
                  Login
                </h2>
                <Form validated={validate} noValidate onSubmit={submitHandler}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="text-center">
                      Email address
                    </Form.Label>
                    <Form.Control
                      required
                      ref={emailRef}
                      type="email"
                      placeholder="Enter email"
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      required
                      ref={passwordRef}
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Group>

                  <div className="text-danger mb-3">{password}</div>

                  <div className="text-center">
                    <Button type="submit" variant="outline-dark" size="md">
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
                <Link
                  className="d-flex justify-content-center align-items-center"
                  to="/forgot"
                >
                  <i className="fw-bold pt-3">Forget password</i>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
