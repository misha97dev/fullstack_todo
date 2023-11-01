import React, { useState } from "react";
import { useCookies } from "react-cookie";
import Modal from "./Modal";

const ListHeader = ({ name, getData }) => {
  const [showModal, setShowModal] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(null);

  const signOut = () => {
    removeCookie("email");
    removeCookie("token");
  };
  return (
    <>
      <h2> {name}</h2>
      <h4>{cookies.email}</h4>
      <div className="btns-wrapper">
        <button onClick={() => setShowModal(true)}>Add new</button>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
      {showModal && (
        <Modal
          mode={"create"}
          setShowModal={setShowModal}
          title={"Add new task"}
          getData={getData}
        />
      )}
    </>
  );
};

export default ListHeader;
