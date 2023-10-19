import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { emailActions } from "../../store/email-slice";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SendBox = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.email.send);

  const [loader, setloader] = useState(false);

  const email = localStorage.getItem("email");
  const mail = email.replace(/[@.]/g, "");

  const GetData = useCallback(async () => {
    try {
      setloader(true);
      let res = await fetch(
        `https://mail-box-ea204-default-rtdb.firebaseio.com/${mail}sentMailbox.json`
      );
      let data = await res.json();
      let arr = [];
      console.log(data);

      for (let key in data) {
        const id = key;
        arr = [{ id: id, ...data[key] }, ...arr];

        dispatch(emailActions.sendMail([...arr]));
        setloader(false);
      }
    } catch (err) {
      toast.error(err.message);
      setloader(false);
    }
  }, [mail, dispatch]);

  const DeleteHandler = async (id) => {
    console.log(id);
    try {
      const res = await fetch(
        `https://mail-box-ea204-default-rtdb.firebaseio.com/${mail}sentMailbox/${id}.json`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Deleted");
      let data = await res;
      console.log(data);
      GetData();
    } catch (error) {
      toast.error(error.message);
    }
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
        <h2 style={{ textAlign: "center" }}>SendBox</h2>
        <ListGroup>
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
