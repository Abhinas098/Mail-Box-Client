import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { emailActions } from "../../store/email-slice";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Indbox = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.email.recieved);

  const [loader, setloader] = useState(false);
  const [error, setError] = useState(false);

  const email = localStorage.getItem("email");
  const mail = email.replace(/[@.]/g, "");

  const GetData = useCallback(async () => {
    try {
      setloader(true);
      let res = await fetch(
        `https://mail-box-ea204-default-rtdb.firebaseio.com/${mail}indbox.json`
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
      toast.error(err);
      setloader(false);
      setError(true);
    }
  }, [mail, dispatch]);

  const DeleteHandler = async (val) => {
    // post to trash
    try {
      const response = await fetch(
        `https://mail-box-ea204-default-rtdb.firebaseio.com/${mail}trashMail.json`,
        {
          method: "POST",
          body: JSON.stringify(val),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let data = await response;
      console.log(data);
    } catch (err) {
      toast.error(err.message);
    }

    // delete from inbox

    try {
      const res = await fetch(
        `https://mail-box-ea204-default-rtdb.firebaseio.com/${mail}indbox/${val.id}.json`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let data = await res;
      console.log(data);
      toast.success("Move to trash");
      GetData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // useEffect(() => {
  //   let interval = setInterval(() => {
  //     GetData();
  //   }, 5000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [GetData]);

  useEffect(() => {
    GetData();
  }, [GetData]);

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
      <Card className="scroll" bg="secondary">
        <h2 style={{ textAlign: "center" }}>Indbox</h2>
        <ListGroup>
          {error && data.length === 0 && <h2>Something went wrong!</h2>}
          {loader && data.length > 0 && (
            <center>
              <Loader />
            </center>
          )}
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
                      <b>From:</b> {data[email].from}
                    </span>
                    <br />
                    <span>
                      <b>Subject: </b>
                      {data[email].subject}
                    </span>
                  </Link>
                  <Button
                    onClick={() => DeleteHandler(data[email])}
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
