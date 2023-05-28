import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { emailActions } from "../../store/email-slice";
import { Link } from "react-router-dom";

const Indbox = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.email.recieved);

  const [loader, setloader] = useState(false);

  const email = localStorage.getItem("email");
  const mail = email.replace(/[@.]/g, "");

  const GetData = useCallback(async () => {
    try {
      setloader(true);
      let res = await fetch(
        `https://mail-box-client-710c7-default-rtdb.firebaseio.com/${mail}indbox.json`
      );
      let data = await res.json();
      let arr = [];
      let unreadMsg = 0;
      console.log(data);

      for (let key in data) {
        if (data[key].read === true) {
          unreadMsg++;
        }
        const id = key;
        arr = [{ id: id, ...data[key] }, ...arr];

        dispatch(emailActions.recievedMail([...arr]));
        dispatch(emailActions.unreadMessage(unreadMsg));
        setloader(false);
      }
    } catch (err) {
      console.log(err);
      setloader(false);
    }
  }, [mail, dispatch]);

  const DeleteHandler = async (id) => {
    console.log(id);
    const res = await fetch(
      `https://mail-box-client-710c7-default-rtdb.firebaseio.com/${mail}indbox/${id}.json`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let data = await res;
    console.log(data);
    GetData();
  };

  useEffect(() => {
    GetData();
  }, [GetData]);

  return (
    <>
      <Card bg="secondary">
        <h2 style={{ textAlign: "center" }}>Indbox</h2>
        <ListGroup>
          {loader && data.length > 0 && <h5>Loading....</h5>}
          {!loader &&
            data !== null &&
            data.length > 0 &&
            Object.keys(data).map((email, index) => {
              return (
                <ListGroup.Item
                  key={index}
                  className="bg-dark bg-gradient bg-opacity-50"
                >
                  <Link
                    key={index}
                    style={{
                      float: "left",
                      textDecoration: "none",
                      color: "black",
                      cursor: "pointer",
                    }}
                    to={`/email/${data[email].id}`}
                  >
                    {" "}
                    <span>
                      {data[email].read && (
                        <p className="mt-3 me-3 ms-0" style={{ float: "left" }}>
                          🟢
                        </p>
                      )}
                    </span>
                    <span>
                      <b>From:</b> {data[email].from.replace(/........$/, "")}
                    </span>
                    <br />
                    <span>
                      <b>Subject: </b>
                      {data[email].subject}
                    </span>
                  </Link>
                  <Button
                    onClick={() => DeleteHandler(data[email].id)}
                    key={data[email].id}
                    style={{ float: "right" }}
                    variant="danger"
                  >
                    Delete
                  </Button>
                </ListGroup.Item>
              );
            })}
        </ListGroup>
      </Card>
    </>
  );
};

export default Indbox;
