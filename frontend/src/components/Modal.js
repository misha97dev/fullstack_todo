import React, { useState } from "react";
import { useCookies } from "react-cookie";

const Modal = ({ mode, setShowModal, title, task, getData }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const editMode = mode === "edit" ? true : false;
  const [data, setData] = useState({
    user_email: editMode ? task.user_email : cookies.email,
    title: editMode ? task.title : "",
    progress: editMode ? task.progress : 50,
    date: editMode ? task.date : new Date(),
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const createTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}todos`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        console.log(response);
        setShowModal(false);
        getData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const editTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}todos/${task.id}`,
        {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (response.status === 200) {
        setShowModal(false);
        getData();
      }
    } catch (err) {
      console.error(err);
    }
    console.log(data);
  };
  return (
    <div className="modal">
      <div className="modal-card">
        <div className="modal-card__close" onClick={() => setShowModal(false)}>
          X
        </div>
        <h2 className="modal-card__title">{title}</h2>
        <form>
          <input
            required
            maxLength={30}
            placeholder="Task title"
            value={data.title}
            onChange={handleChange}
            name="title"
          />
          <input
            required
            type="range"
            min="0"
            max="100"
            value={data.progress}
            name="progress"
            onChange={handleChange}
          />
          <button onClick={editMode ? editTodo : createTodo}>submit</button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
