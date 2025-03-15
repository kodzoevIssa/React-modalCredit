import { useState, useEffect, useCallback } from "react";
import "./Modal.css";

function Modal({ onClose }) {
  const [creditAmount, setCreditAmount] = useState("");
  const [selectedMonths, setSelectedMonths] = useState(12);
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [annualPayment, setAnnualPayment] = useState(null);
  const [selectedOption, setSelectedOption] = useState("в месяц");
  const [calculated, setCalculated] = useState(false);
  const [error, setError] = useState(false);

  const getPaymentWord = (num) => {
    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return "рублей";
    }

    if (lastDigit === 1) {
      return "рубль";
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return "рубля";
    }

    return "рублей";
  };

  const handleCalculate = useCallback(() => {
    if (!creditAmount || creditAmount <= 0) {
      setError(true);
      return;
    }
    setError(false);

    const payment = creditAmount / selectedMonths;
    const yearlyPayment = payment * 12;

    setMonthlyPayment(payment);
    setAnnualPayment(yearlyPayment);
    setCalculated(true);
  }, [creditAmount, selectedMonths]);

  const handleMonthChange = (months) => {
    setSelectedMonths(months);
    if (calculated) {
      const payment = creditAmount / months;
      const yearlyPayment = payment * 12;

      setMonthlyPayment(payment);
      setAnnualPayment(yearlyPayment);
    }
  };

  useEffect(() => {
    if (creditAmount && calculated) {
      handleCalculate();
    }
  }, [creditAmount, calculated, handleCalculate]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Платежи по кредиту</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <p className="modal-text">
          Введите сумму кредита и выберите срок, на который вы хотите его
          оформить. Мы автоматически рассчитаем для вас ежемесячный платеж,
          чтобы вы могли лучше спланировать свои финансы.
        </p>

        <label className="input-label">Ваша сумма кредита</label>
        <input
          type="number"
          placeholder="Введите данные"
          className={`input-field ${error ? "input-error" : ""}`}
          value={creditAmount}
          onChange={(e) => setCreditAmount(e.target.value)}
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
          onClick={creditAmount && calculated ? onClose : null}
          disabled={!creditAmount || !calculated}
        >
          Добавить
        </button>
      </div>
    </div>
  );
}

export default Modal;
