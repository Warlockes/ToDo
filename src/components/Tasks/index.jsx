import React, { useContext } from "react";

import axios from "axios";
import classNames from "classnames";

import { Context } from "../../context";
import { AddTaskForm, Task } from "../";

import editIcon from "../../assets/img/edit.svg";

import "./Tasks.scss";

const Tasks = ({ list, withoutEmpty }) => {
  const { onEditListTitle } = useContext(Context);

  const editTitle = () => {
    const newTitle = window.prompt("Название списка", list.name);
    if (newTitle) {
      onEditListTitle(list.id, newTitle);
      axios
        .patch("https://json-server-todo-alex.herokuapp.com/lists/" + list.id, {
          name: newTitle,
        })
        .catch(() => alert("Не удалось обновить название списка"));
    } else if (newTitle === "") {
      alert("Название списка не может быть пустым");
    }
  };

  return (
    <div className="tasks__body">
      <div className="tasks__title title">
        <h2 className={classNames("title__text", `text_${list.color.name}`)}>
          {list.name}
          <img onClick={editTitle} src={editIcon} alt="Edit icon" />
        </h2>
      </div>
      {!withoutEmpty && list.tasks.length === 0 ? (
        <div className="tasks__no-item">
          <span>Задачи отсутствуют</span>
        </div>
      ) : (
        <div className="tasks__items">
          {list.tasks.map((task) => (
            <Task key={task.id} task={task} listId={list.id} />
          ))}
        </div>
      )}
      <AddTaskForm listId={list.id} />
    </div>
  );
};

export default Tasks;
