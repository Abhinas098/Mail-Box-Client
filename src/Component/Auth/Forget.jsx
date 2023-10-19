import React, { useRef } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const Forget = () => {
  const emailRef = useRef();

  const sendLink = (e) => {
    e.preventDefault();
    const registeredMail = emailRef.current.value;

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyC5RfB2zeAPwPIykibRKYnL7KdPnkq49Bw",
      {
        method: "POST",
        body: JSON.stringify({
          requestType: "PASSWORD_RESET",
          email: registeredMail,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          res.json().then((data) => {
            let errorMsg = "Authotication Failed";
            if (data && data.error && data.error.message) {
              errorMsg = data.error.message;
            }
            throw new Error(errorMsg);
          });
        }
      })
      .then((data) => {
        alert("Check your mail");
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  return (
    <>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={7} lg={5} xs={10}>
            <Card className="form">
              <Card.Body className="mb-3 mt-md-4">
                <h3 className="fw-bold mb-2 text-center text-uppercase ">
                  Forgot Password
                </h3>
                <Form className="text-center">
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="mt-3">
                      Email address
                    </Form.Label>
                    <Form.Control
                      ref={emailRef}
                      type="email"
                      placeholder="Enter Registered email"
                      aria-required
                    />
                  </Form.Group>
                  <Button
                    className="text-center"
                    onClick={sendLink}
                    variant="outline-dark"
                    size="md"
                  >
                    Send Link
                  </Button>{" "}
                  <p className="mt-3 ">
                    New user? <Link className='fw-bold' to="/register">Register</Link>
                  </p>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Forget;
