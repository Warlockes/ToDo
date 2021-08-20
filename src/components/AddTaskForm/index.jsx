import React, { useState } from "react";
import axios from "axios";

import "./AddTaskForm.scss";

const AddTaskForm = ({ list, onAddTask }) => {
  const [visibleForm, setVisibleForm] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleFormVisible = () => {
    setVisibleForm(!visibleForm);
    setInputValue("");
  };

  const addTask = () => {
    if (!inputValue) {
      alert("Введите текст задачи");
      return;
    }
    const obj = {
      listId: list.id,
      text: inputValue,
      completed: false,
    };
    setIsLoading(true);
    axios
      .post("http://localhost:3001/tasks", obj)
      .then(({ data }) => {
        console.log(data);
        onAddTask(list.id, data);
      })
      .catch(() => alert("Ошибка при добавлении задачи"))
      .finally(() => {
        setIsLoading(false);
        toggleFormVisible();
      });
  };

  return visibleForm ? (
    <div className="tasks__form form">
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="form__input input"
        type="text"
        placeholder="Текст задачи"
      />
      <div className="form__btn-row btn-row">
        <button
          disabled={isLoading}
          onClick={addTask}
          className="btn-row__button-add button"
        >
          {isLoading ? "Добавление..." : "Добавить задачу"}
        </button>
        <button onClick={toggleFormVisible} className="btn-row__button-cancel">
          Отмена
        </button>
      </div>
    </div>
  ) : (
    <div onClick={toggleFormVisible} className="tasks__form form-new">
      <svg
        width="16"
        height="16"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 1V11"
          stroke="#B4B4B4"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1 6H11"
          stroke="#B4B4B4"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Новая задача</span>
    </div>
  );
};

export default AddTaskForm;
