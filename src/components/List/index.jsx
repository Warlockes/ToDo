import React, { useContext } from "react";

import classNames from "classnames";
import axios from "axios";

import Icon from "../Icon";
import { Context } from "../../context";

import removeIcon from "../../assets/img/remove.svg";

import "./List.scss";

const List = ({ items, isRemovable, onClickItem, selectedItemId, onClick }) => {
  const { onRemoveList } = useContext(Context);

  const removeList = ({ id }) => {
    if (window.confirm("Хотите удалить список?")) {
      axios.delete("http://localhost:3001/lists/" + id).then(() => {
        onRemoveList(id);
      });
    }
  };

  return (
    <ul onClick={onClick} className="list">
      {items.map((item, index) => (
        <li
          key={index}
          onClick={onClickItem ? () => onClickItem(item.id) : null}
          className={classNames(
            item.className,
            {
              active: item.active
                ? item.active
                : selectedItemId && selectedItemId === item.id,
            },
            "list__item"
          )}
        >
          <i>{item.icon ? item.icon : <Icon color={item.color.name} />}</i>
          <span>
            {item.name}
            {item.tasks && ` (${item.tasks.length})`}
          </span>

          {isRemovable && (
            <img
              onClick={() => removeList(item)}
              className="item__remove-btn"
              src={removeIcon}
              alt="Remove icon"
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default List;
