import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { emailActions } from "../../store/email-slice";
import { Link } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../hooks/useApi";

const Indbox = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.email.recieved);

  const [loader, setloader] = useState(false);

  const email = localStorage.getItem("email");
  const mail = email.replace(/[@.]/g, "");

  const { onSend, onDelete } = useApi();

  const url = "https://mail-box-ea204-default-rtdb.firebaseio.com";

  const GetData = useCallback(async () => {
    try {
      setloader(true);
      let res = await fetch(`${url}/${mail}indbox.json`);

      let data = await res.json();
      let arr = [];
      let unreadMsg = 0;

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
    }
  }, [mail, dispatch]);

  const DeleteHandler = async (val) => {
    // Disable the button during the request
    setloader(true);

    // post to trash
    const msg = "Move to Trash";
    try {
      await onSend(val, `${url}/${mail}trashMail.json`, msg);

      // delete from inbox
      await onDelete(`${url}/${mail}indbox/${val.id}.json`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      // Enable the button after the request is completed (success or failure)
      setloader(false);
      GetData();
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
                  {!loader && (
                    <Button
                      onClick={() => DeleteHandler(data[email])}
                      key={data[email].id}
                      style={{ float: "right" }}
                      variant="danger"
                    >
                      Delete
                    </Button>
                  )}
                </ListGroup.Item>
              );
            })}
        </ListGroup>
      </Card>
    </>
  );
};

export default Indbox;
