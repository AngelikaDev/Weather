import { useState } from 'react';
import Modal from './Modal';
import './ModalButton.css';

function ModalButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        className="open-modal-btn"
        onClick={() => setIsModalOpen(true)}
      >
        🚀 Открыть модальное окно
      </button>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="modal-body">
          <h2>Добро пожаловать!</h2>
          <p>Это модальное окно, созданное с помощью ReactDOM.createPortal.</p>
          <p>Особенности:</p>
          <ul>
            <li>✓ Рендерится вне основного DOM-дерева</li>
            <li>✓ Закрывается по клику на оверлей</li>
            <li>✓ Закрывается по нажатию Escape</li>
            <li>✓ Анимированное появление</li>
          </ul>
          <div className="modal-example">
            <p>Здесь может быть любое содержимое:</p>
            <button onClick={() => alert('Кнопка работает!')}>
              Пример кнопки
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ModalButton;