import React, { useEffect, useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import Loader from "../Layout/Loader";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useApi from "../../hooks/useApi";
import { useCallback } from "react";

const TrashMail = () => {
  const mail = localStorage.getItem("email");
  const email = mail ? mail.replace(/[@.]/g, "") : "";

  const [arr, setArr] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);

  const { onDelete, deleteAll } = useApi();

  const url = "https://mail-box-ea204-default-rtdb.firebaseio.com";

  const getTrash = useCallback(async () => {
    try {
      setLoader(true);
      const response = await fetch(`${url}/${email}trashMail.json`);
      let data = await response.json();
      console.log(data);
      if (data) {
        let brr = [];
        for (let i in data) {
          brr.push([i, data[i]]);
        }
        setArr((prevArr) => [...prevArr, ...brr]);
      }
      setLoader(false);
    } catch (err) {
      setLoader(false);
      setError(true);
      toast.error(err.message);
    }
  }, [email]);

  const clearAll = async () => {
    try {
      await deleteAll(`${url}/${email}trashMail.json`, getTrash, setArr);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const deleteHandler = async (id) => {
    await onDelete(`${url}/${email}trashMail/${id}.json`, "Deleted");
    setArr((prevArr) => prevArr.filter((i) => i[0] !== id));
  };

  useEffect(() => {
    getTrash();
  }, [getTrash]);

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
          TrashMail{" "}
          {arr.length > 0 && (
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
        </h2>

        {loader && !arr[0] && (
          <center>
            <Loader />
          </center>
        )}
        <ListGroup>
          {!loader &&
            !error &&
            arr[0] &&
            arr !== null &&
            arr.length > 0 &&
            arr.map((email) => (
              <ListGroup.Item
                key={email[0]}
                className="bg-dark bg-gradient bg-opacity-50"
              >
                {email[1] && (
                  <span>
                    <b>From:</b> {email[1].from}
                  </span>
                )}
                <br />
                {email[1] && (
                  <span>
                    <b>Subject:</b> {email[1].subject}
                  </span>
                )}
                <br />
                {email[1] && (
                  <span>
                    <b>Message:</b> {email[1].message}
                  </span>
                )}

                <Button
                  onClick={() => deleteHandler(email[0])}
                  key={email[0]}
                  style={{ float: "right" }}
                  variant="danger"
                >
                  Delete
                </Button>
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Card>
    </>
  );
};

export default React.memo(TrashMail);
