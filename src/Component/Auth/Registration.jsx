import React, { useRef, useState } from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Registration() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [password, confirmPassword] = useState(true);
  const [validate, setValidate] = useState(false);

  const submitHandler = (e) => {
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
        confirmPassword("Sucessfull!");
        setIsLoading(false);
        if (res.ok) {
          console.log(res);
          //
        } else {
          res.json().then((data) => {
            let errorMsg = "Authotication Failed";
            if (data && data.error && data.error.message) {
              errorMsg = data.error.message;
            }
            confirmPassword(errorMsg);
          });
        }
      });
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
