import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const useApi = () => {
  const onSend = async (val, url, message) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(val),
        headers: {
          "Content-Type": "application/json",
        },
      });
      let data = await response;
      if (data) {
        message && toast.success(message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const onDelete = async (url, msg) => {
    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let data = await res;
      console.log(data);
      data && msg && toast.success(msg);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Remove All mails
  const deleteAll = async (url, payload, setArr) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Clear it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(url, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
          await res.json();
          Swal.fire("Cleared!", "Your file has been cleared.", "success");
          setArr && setArr([]);
          payload();
        } catch (error) {
          toast.error("Something went wrong");
        }
      }
    });
  };

  return { onSend, onDelete, deleteAll };
};

export default useApi;
