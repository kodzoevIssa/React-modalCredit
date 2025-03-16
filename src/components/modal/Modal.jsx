import { useState, useEffect, useCallback } from "react";
import "./Modal.css";

function getPaymentWord(num) {
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "рублей";
  if (lastDigit === 1) return "рубль";
  if (lastDigit >= 2 && lastDigit <= 4) return "рубля";
  return "рублей";
}

function Modal({ onClose }) {
  const [creditAmount, setCreditAmount] = useState(0);
  const [selectedMonths, setSelectedMonths] = useState(12);
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [annualPayment, setAnnualPayment] = useState(null);
  const [selectedOption, setSelectedOption] = useState("в месяц");
  const [calculated, setCalculated] = useState(false);
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsOpen(true), 10);
  }, []);

  const calculatePayments = useCallback((amount, months) => {
    if (!amount || amount <= 0) {
      setError(true);
      return;
    }
    setError(false);
    const payment = amount / months;
    setMonthlyPayment(payment);
    setAnnualPayment(payment * 12);
    setCalculated(true);
  }, []);

  const handleCalculate = () => calculatePayments(creditAmount, selectedMonths);

  const handleMonthChange = (months) => {
    setSelectedMonths(months);
    if (calculated) calculatePayments(creditAmount, months);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`modal-overlay ${isOpen ? "show" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`modal ${isOpen ? "show" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Платежи по кредиту</h2>
          <button className="close-btn" onClick={handleClose}>
            &times;
          </button>
        </div>

        <p className="modal-text">
          Введите сумму кредита и выберите срок. Мы автоматически рассчитаем ваш
          ежемесячный платеж.
        </p>

        <label className="input-label">Ваша сумма кредита</label>
        <input
          type="number"
          placeholder="Введите данные"
          className={`input-field ${error ? "input-error" : ""}`}
          value={creditAmount || ""}
          onChange={(e) => setCreditAmount(Number(e.target.value))}
        />
        {error && (
          <p className="error-message">Поле обязательно для заполнения</p>
        )}

        <button className="calculate-btn" onClick={handleCalculate}>
          Рассчитать
        </button>

        <div className="months-wrap">
          <label className="input-label">Количество месяцев?</label>
          <div className="months-container">
            {[12, 24, 36, 48].map((months) => (
              <button
                key={months}
                onClick={() => handleMonthChange(months)}
                className={`month-btn ${
                  selectedMonths === months ? "active" : ""
                }`}
              >
                {months}
              </button>
            ))}
          </div>
        </div>

        {monthlyPayment !== null && (
          <div className="result">
            <label className="input-label">Итого ваш платеж по кредиту:</label>
            <div className="option-container">
              {["в год", "в месяц"].map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedOption(option)}
                  className={`option-btn ${
                    selectedOption === option ? "active" : ""
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="result-sum">
              {selectedOption === "в месяц"
                ? `${Math.round(monthlyPayment)} ${getPaymentWord(
                    Math.round(monthlyPayment)
                  )}`
                : `${Math.round(annualPayment)} ${getPaymentWord(
                    Math.round(annualPayment)
                  )}`}
            </p>
          </div>
        )}

        <button
          className={`add-btn ${creditAmount && calculated ? "" : "disabled"}`}
          onClick={creditAmount && calculated ? handleClose : null}
          disabled={!creditAmount || !calculated}
        >
          Добавить
        </button>
      </div>
    </div>
  );
}

export default Modal;
