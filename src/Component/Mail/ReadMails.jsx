import React, { Fragment } from "react";

import { useHistory, useParams } from "react-router-dom";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Card } from "react-bootstrap";

const Mails = () => {

  const history = useHistory();

  const { id } = useParams();
  const mails = useSelector((state) => state.email.recieved);

  const email = localStorage.getItem("email");
  const recievedMail = email.replace(/[@.]/g, "");

  const singleMail = mails.filter((item) => item.id === id);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://mail-box-client-710c7-default-rtdb.firebaseio.com/${recievedMail}indbox/${id}.json`,
        {
          method: "PATCH",
          body: JSON.stringify({
            read: false,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response;
      console.log(data);
    };
    fetchData();
  }, [id, recievedMail]);

  return (
    <Fragment>
      <Card bg="secondary">
        <Card.Header
          style={{
            fontFamily: "sans-serif",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "30px",
          }}
        >
          Message
        </Card.Header>
        {singleMail[0] && (
          <Card.Body>
            <Card.Title>
              From: {singleMail[0].from}
            </Card.Title>
            <Card.Text>
              <b>Subject: </b>
              {singleMail[0].subject}
              <br />
              <b>Message: </b>
              {singleMail[0].message}
              <br />
            </Card.Text>
          </Card.Body>
        )}
        {!singleMail[0] && history.push("/email")}
      </Card>
    </Fragment>
  );
};

export default Mails;
