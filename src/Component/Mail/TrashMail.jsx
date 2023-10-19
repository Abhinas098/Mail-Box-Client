import React, { useEffect, useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import Loader from "../Layout/Loader";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

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
      toast.error(err.message);
      setloader(false);
      setError(true);
    }
  };

  console.log(arr);

  const DeleteHandler = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
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
          // toast.success("Deleted");
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        } catch (error) {
          toast.error("Something went wrong");
        }
      }
    });
  };

  useEffect(() => {
    getTrash();
  }, []);

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
      />{" "}
      <Card className="scroll" bg="secondary">
        <h2 style={{ textAlign: "center" }}>Trashbox</h2>
        {error && arr.length === 0 && <h2>Something went wrong!</h2>}
        {loader && (
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
    </>
  );
};

export default React.memo(TrashMail);

// 3.output:- a b e d c

// 4.setTimeout doesn't return a promise so we can't await it. we can wrap setTimeout in a function that returns promise.

// async function fun1(){

// console.log('a');

// console.log('b');

// const fun2 = () =>{

//  return new Promise((resolve,reject)=>{

//   setTimeout(() => {

//    console.log('c');

//    resolve()

//   }, 1000)

//  })}

// const fun3 = ()=>{

//  return new Promise((res, rej)=>{

//    setTimeout(() => {

//    console.log('d');

//    res()

//   }, 0)

//  })

// }

// await fun2()

// await fun3()

// console.log('e');

// }

// fun1()
