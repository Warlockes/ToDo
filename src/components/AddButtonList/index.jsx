import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

import { List, Icon } from "../";
import { Context } from "../../context";

import closeBtn from "../../assets/img/closeBtn.svg";

import "./AddButtonList.scss";

const AddButtonList = ({ colors, sidebarListLength }) => {
  const [visiblePopup, setVisiblePopup] = useState(false);
  const [selectedColor, selectColor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { onAddList } = useContext(Context);

  useEffect(() => {
    if (Array.isArray(colors)) selectColor(colors[0].id);
  }, [colors]);

  const onClosePopup = () => {
    setInputValue("");
    setVisiblePopup(false);
    selectColor(colors[0].id);
  };

  const onAdd = () => {
    if (!inputValue) {
      alert("Введите название списка");
      return;
    }
    setIsLoading(true);
    axios
      .post("https://json-server-todo-alex.herokuapp.com/lists", {
        id: sidebarListLength + 1,
        name: inputValue,
        colorId: selectedColor,
      })
      .then(({ data }) => {
        const color = colors.filter((color) => color.id === selectedColor)[0]
          .name;
        const newList = { ...data, color: { name: color }, tasks: [] };
        onAddList(newList);
        onClosePopup();
      })
      .catch(() => alert("Ошибка при добавлении списка"))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onPressEnter = (e) => {
    if (e.key === "Enter") {
      onAdd();
    }
  };

  return (
    <div className="todo__add-list">
      <List
        onClick={() => setVisiblePopup(!visiblePopup)}
        items={[
          {
            className: "list__add-button",
            icon: (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 1V11"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 6H11"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            name: "Добавить папку",
          },
        ]}
      />
      {visiblePopup && (
        <div className="add-list-popup">
          <div className="add-list-popup__body">
            <img
              src={closeBtn}
              alt="Close button"
              className="add-list-popup__close-btn"
              onClick={onClosePopup}
            />
            <input
              value={inputValue}
              onKeyPress={onPressEnter}
              onChange={(e) => setInputValue(e.target.value)}
              className="add-list-popup__input input"
              type="text"
              placeholder="Название папки"
            />
            <ul className="add-list-popup__colors">
              {colors.map((color) => (
                <Icon
                  onClick={() => selectColor(color.id)}
                  key={color.id}
                  color={color.name}
                  className={selectedColor === color.id && "active"}
                />
              ))}
            </ul>
            <button
              disabled={isLoading}
              onClick={onAdd}
              className="add-list-popup__button button"
            >
              {isLoading ? "Добавление..." : "Добавить"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddButtonList;
