import React, { useRef, useState } from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Emailvalidation from "@everapi/emailvalidation-js";

export default function Registration() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [password, confirmPassword] = useState(true);
  const [validate, setValidate] = useState(false);
  const [valid, setValid] = useState(true);

  const submitHandler = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidate(true);

    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;
    const enteredConfirmPassword = confirmPasswordRef.current.value;

    if (enteredPassword !== enteredConfirmPassword) {
      confirmPassword(false);
    }

    if (enteredPassword === enteredConfirmPassword) {
      // Check mail is valid or not
      const client = await new Emailvalidation(
        "ema_live_XTGKMc3Q8Re2wFUa69sIvW6u75VrbsSdpcDlpbg8"
      );
      await client
        .info(`${enteredEmail}`, {
          catch_all: 0,
        })
        .then((response) => {
          console.log(response.reason === "invalid_mailbox");
          if (response.reason === "invalid_mailbox") {
            setValid(false);
          } else {
            setValid(true);
          }
        });
      if (valid === true) {
        setIsLoading(true);
        fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC5RfB2zeAPwPIykibRKYnL7KdPnkq49Bw",
          {
            method: "POST",
            body: JSON.stringify({
              email: enteredEmail,
              password: enteredPassword,
              confirmPassword: enteredConfirmPassword,
              returnSecureToken: true,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((res) => {
          confirmPassword(true);
          setIsLoading(false);
          if (res.ok) {
            alert("Success!");
            history.push("/login");
            console.log(res);
            //
          } else {
            res.json().then((data) => {
              let errorMsg = "Authotication Failed";
              if (data && data.error && data.error.message) {
                errorMsg = data.error.message;
              }
              confirmPassword(errorMsg);
              setValid(false);
            });
          }
        });
      } else {
        setValid(false);
      }
    }
  };
  return (
    <>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={7} lg={5} xs={10}>
            <Card className="form">
              <Card.Body className="mb-3 mt-md-4">
                <h2 className="fw-bold mb-2 text-center text-uppercase ">
                  Register
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

                  <Form.Group className="mb-2">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      required
                      ref={confirmPasswordRef}
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Group>

                  <div className="text-danger mb-3">
                    {!password && !valid && "Please enter Valid Email"}
                    {!password && "Not Matched!"}
                    {password}
                  </div>

                  <div className="text-center">
                    <Button type="submit" variant="outline-dark">
                      Create Account
                    </Button>{" "}
                  </div>

                  {isLoading && <p>Loading....</p>}
                </Form>
                <p className="mb-0 mt-3 text-center">
                  Already have an account??{" "}
                  <Link to="/login" className="text-dark fw-bold">
                    Sign In
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
