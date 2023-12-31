import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { emailActions } from "../../store/email-slice";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../hooks/useApi";

const SendBox = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.email.send);

  const [loader, setloader] = useState(false);
  const { onDelete, deleteAll } = useApi();
  const url = "https://mail-box-ea204-default-rtdb.firebaseio.com";

  const email = localStorage.getItem("email");
  const mail = email.replace(/[@.]/g, "");

  const GetData = useCallback(async () => {
    try {
      setloader(true);
      let res = await fetch(`${url}/${mail}sentMailbox.json`);
      let data = await res.json();
      const arr = Object.entries(data || {}).map(([id, item]) => ({
        id,
        ...item,
      }));
      dispatch(emailActions.sendMail(arr));
      setloader(false);
    } catch (err) {
      toast.error(err.message);
      setloader(false);
    }
  }, [mail, dispatch]);

  // Remove one mail
  const DeleteHandler = async (id) => {
    await onDelete(`${url}/${mail}sentMailbox/${id}.json`, "Deleted");
    GetData();
  };

  // Remove all Mail
  const clearAll = async () => {
    await deleteAll(`${url}/${mail}sentMailbox.json`, GetData);
  };

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
        <h2 style={{ textAlign: "center" }}>
          {data.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              className="trashBtn"
              onClick={clearAll}
            >
              {" "}
              ❌ Clear
            </Button>
          )}
          SendBox
        </h2>
        <ListGroup>
          {loader && data.length > 0 && data[0] && (
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
                      textDecoration: "none",
                      color: "black",
                      cursor: "pointer",
                    }}
                    to={`/sendmail/${data[email].id}`}
                  >
                    {" "}
                    <span>
                      <b>To:</b> {data[email].email}
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

export default SendBox;
