import React, { Fragment } from "react";

import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card } from "react-bootstrap";

const ReadSendMail = () => {
  const history = useHistory();
  const { id } = useParams();
  const mails = useSelector((state) => state.email.send);
  const singleMail = mails.filter((item) => item.id === id);

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
          Messages
        </Card.Header>
        {singleMail[0] && (
          <Card.Body style={{ maxHeight: "70vh", overflow: "scroll" }}>
            <Card.Title>To: {singleMail[0].email}</Card.Title>
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
        {!singleMail[0] && history.push("/sendmail")}

        <center>
          <h1 onClick={() => history.push("/sendmail")}>🔙</h1>
        </center>
      </Card>
    </Fragment>
  );
};

export default ReadSendMail;
