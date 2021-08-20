import React, { useEffect, useState } from "react";
import axios from "axios";

import List from "../List";
import Icon from "../Icon";

import closeBtn from "../../assets/img/closeBtn.svg";

import "./AddButtonList.scss";

const AddButtonList = ({ colors, sidebarList, onAddList }) => {
  const [visiblePopup, setVisiblePopup] = useState(false);
  const [selectedColor, selectColor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (Array.isArray(colors)) selectColor(colors[0].id);
  }, [colors]);

  const onClosePopup = () => {
    setInputValue("");
    setVisiblePopup(false);
    selectColor(colors[0].id);
  };

  const addList = () => {
    if (!inputValue) {
      alert("Введите название списка");
      return;
    }
    setIsLoading(true);
    axios
      .post("http://localhost:3001/lists", {
        id: sidebarList.length + 1,
        name: inputValue,
        colorId: selectedColor,
      })
      .then(({ data }) => {
        const color = colors.filter((color) => color.id === selectedColor)[0]
          .name;
        const newObj = { ...data, color: { name: color }, tasks: [] };
        onAddList(newObj);
        onClosePopup();
      })
      .catch(() => alert("Ошибка при добавлении списка"))
      .finally(() => {
        setIsLoading(false);
      });
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
              onClick={addList}
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
