import React from "react";
import { Button } from "react-bootstrap";
import Compose from "../Mail/Compose";
import {
  RiMailUnreadLine,
  RiDeleteBin5Line,
  RiSettings2Line,
  RiUser2Line,
} from "react-icons/ri";
import { BsSend } from "react-icons/bs";
import {
  CDBSidebar,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const [modalShow, setModalShow] = React.useState(false);
  const unread = useSelector((state) => state.email.unread);

  // Verify Email
  const token = useSelector((state) => state.auth.token);
  const emailHandler = (e) => {
    e.preventDefault();
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyC5RfB2zeAPwPIykibRKYnL7KdPnkq49Bw",
      {
        method: "POST",
        body: JSON.stringify({
          requestType: "VERIFY_EMAIL",
          idToken: token,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          res.json().then((data) => {
            let errorMsg = "Authotication Failed";
            if (data && data.error && data.error.message) {
              errorMsg = data.error.message;
            }
            throw new Error(errorMsg);
          });
        }
      })
      .then((data) => {
        console.log(data);
        alert("Check Your mail", data.email);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <>
      <Compose show={modalShow} onHide={() => setModalShow(false)} />
      <div
        style={{
          display: "flex",
          height: "90vh",
          overflow: "scroll initial",
          float: "left",
        }}
      >
        <CDBSidebar textColor="#fff" backgroundColor="#333">
          <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
            <Button
              variant="outline-success"
              onClick={() => setModalShow(true)}
            >
              Compose
            </Button>
          </CDBSidebarHeader>

          <CDBSidebarMenu>
            <CDBSidebarMenuItem>
              <RiMailUnreadLine />
              <Link to="/email"> IndBox ({unread})</Link>
            </CDBSidebarMenuItem>

            <CDBSidebarMenuItem>
              <BsSend />
              <Link to="/sendmail"> SendBox</Link>
            </CDBSidebarMenuItem>

            <CDBSidebarMenuItem>
              <RiDeleteBin5Line />
              <Link to="/trashmail"> Trash</Link>
            </CDBSidebarMenuItem>
          </CDBSidebarMenu>

          <CDBSidebarMenu>
            <CDBSidebarMenuItem>
              <hr></hr>
            </CDBSidebarMenuItem>
          </CDBSidebarMenu>

          <CDBSidebarFooter>
            <CDBSidebarMenuItem>
              <RiSettings2Line /> Setting
            </CDBSidebarMenuItem>

            <CDBSidebarMenuItem>
              <RiUser2Line /> {localStorage.getItem("email")}
            </CDBSidebarMenuItem>

            <CDBSidebarMenuItem>
              <Button variant="outline-info" onClick={emailHandler}>
                Verify E-mail
              </Button>
            </CDBSidebarMenuItem>
          </CDBSidebarFooter>
        </CDBSidebar>
      </div>
    </>
  );
};

export default Sidebar;
