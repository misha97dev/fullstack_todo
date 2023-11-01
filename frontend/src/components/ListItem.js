import React, { useState } from "react";
import TickIcon from "./TickIcon";
import ProgressBar from "./ProgressBar";
import Modal from "./Modal";
const ListItem = ({ task, getData }) => {
  const [showModal, setShowModal] = useState(false);
  const deleteTodo = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}todos/${task.id}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) getData();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <TickIcon />
      {task.title}
      <ProgressBar progress={task.progress} />

      <button onClick={() => setShowModal(true)}>Edit</button>
      <button onClick={() => deleteTodo()}>Delete</button>
      {showModal && (
        <Modal
          mode={"edit"}
          setShowModal={setShowModal}
          task={task}
          getData={getData}
        />
      )}
    </div>
  );
};

export default ListItem;
