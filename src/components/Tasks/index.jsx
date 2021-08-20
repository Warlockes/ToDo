import React from "react";
import axios from "axios";
import classNames from "classnames";

import AddTaskForm from "../AddTaskForm";
import Task from "../Task";
import editIcon from "../../assets/img/edit.svg";

import "./Tasks.scss";

const Tasks = ({
  list,
  onEditTitle,
  onAddTask,
  onChangeTaskStatus,
  withoutEmpty,
  onRemoveTask,
  onEditTask,
}) => {
  const editTitle = () => {
    const newTitle = window.prompt("Название списка", list.name);
    if (newTitle) {
      onEditTitle(list.id, newTitle);
      axios
        .patch("http://localhost:3001/lists/" + list.id, {
          name: newTitle,
        })
        .catch(() => alert("Не удалось обновить название списка"));
    } else if (newTitle === "") {
      alert("Название списка не может быть пустым");
    }
  };

  const editTask = (task, listId) => {
    const newValue = window.prompt("Текст задачи", task.text);
    if (newValue) {
      onEditTask(task.id, newValue, listId);
      axios
        .patch("http://localhost:3001/tasks/" + task.id, {
          text: newValue,
        })
        .catch(() => alert("Не удалось обновить задачу"));
    } else if (newValue === "") {
      alert("Текст задачи не может быть пустым");
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
            <Task
              key={task.id}
              task={task}
              onChangeTaskStatus={onChangeTaskStatus}
              list={list}
              onRemove={onRemoveTask}
              onEdit={editTask}
            />
          ))}
        </div>
      )}
      <AddTaskForm list={list} onAddTask={onAddTask} />
    </div>
  );
};

export default Tasks;
