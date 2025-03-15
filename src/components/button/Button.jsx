import { useState } from "react";
import Modal from "../modal/modal";
import "./Button.css";

function Button() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button className="main-btn" onClick={handleOpenModal}>
        Расчет платежей
      </button>

      {isModalOpen && <Modal onClose={handleCloseModal} />}
    </>
  );
}

export default Button;
