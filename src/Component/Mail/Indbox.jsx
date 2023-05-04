import React, { useCallback, useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";

const Indbox = () => {
  const [data, setData] = useState("");

  const email = localStorage.getItem("email");
  const mail = email.replace(/[@.]/g, "");
  const GetData = useCallback(async () => {
    try {
      let res = await fetch(
        `https://mail-box-client-710c7-default-rtdb.firebaseio.com/${mail}indbox.json`
      );
      let data = await res.json();
      let arr = [];
      console.log(data);
      for (let key in data) {
        arr.push(data[key]);
        setData(arr);
      }
    } catch (err) {
      console.log(err);
    }
  }, [mail]);

  const openMessage = () => {};

  useEffect(() => {
    GetData();
  }, [GetData]);
  console.log(data, "likun");

  return (
    <>
      <Card bg="secondary">
        <h2 style={{ textAlign: "center" }}>Indbox</h2>
        <ListGroup>
          {data.length === 0 && <h5>Empty indbox No message found !</h5>}
          {data !== null &&
            Object.keys(data).map((email, index) => {
              return (
                <ListGroup.Item
                  onClick={() => openMessage}
                  style={{ cursor: "pointer", backgroundColor: "darkgray" }}
                  key={index}
                >
                  <span>
                    <b>From:</b> {data[email].from}
                  </span>
                  <br />
                  <span>
                    <b>Subject: </b> {data[email].subject}
                  </span>
                  <br />
                </ListGroup.Item>
              );
            })}
        </ListGroup>
      </Card>
    </>
  );
};

export default Indbox;
