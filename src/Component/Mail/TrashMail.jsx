import React, { useEffect, useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";

const TrashMail = () => {
  const mail = localStorage.getItem("email");
  const email = mail.replace(/[@.]/g, "");

  const [arr, setArr] = useState([]);

  const [loader, setloader] = useState(false);
  const [error, setError] = useState(false);

  const getTrash = async () => {
    try {
      setloader(true);
      const response = await fetch(
        `https://mail-box-ea204-default-rtdb.firebaseio.com/${email}trashMail.json`
      );
      let data = await response.json();
      console.log(data);
      if (data) {
        let brr = [];
        for (let i in data) {
          brr.push([i, data[i]]);
        }
        setArr(...arr, brr);
      }
      setloader(false);
    } catch (err) {
      console.log(err);
      setloader(false);
      setError(true);
    }
  };

  console.log(arr);

  const DeleteHandler = async (id) => {
    try {
      const res = await fetch(
        `https://mail-box-ea204-default-rtdb.firebaseio.com/${email}trashMail/${id}.json`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let data = await res;
      console.log(data);
      setArr(arr.filter((i) => i[0] !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    getTrash();
  }, [email]);

  return (
    <div>
      {" "}
      <Card className="scroll" bg="secondary">
        <h2 style={{ textAlign: "center" }}>Trashbox</h2>
        {error && arr.length === 0 && <h2>Something went wrong!</h2>}
        {loader && <h5>Loading....</h5>}
        <ListGroup>
          {!loader &&
            !error &&
            arr[0] &&
            arr !== null &&
            arr.length > 0 &&
            arr.map((email, index) => {
              console.log(email);
              return (
                <>
                  {email && (
                    <ListGroup.Item
                      key={index}
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
                        onClick={() => DeleteHandler(email[0])}
                        key={email[0]}
                        style={{ float: "right" }}
                        variant="danger"
                      >
                        Delete
                      </Button>
                    </ListGroup.Item>
                  )}
                </>
              );
            })}
        </ListGroup>
      </Card>
    </div>
  );
};

export default TrashMail;
