import React, { useState, useEffect } from "react";

import axios from "axios";
import { Route, useHistory, useLocation } from "react-router-dom";

import { Context } from "./context";
import { List, AddButtonList, Tasks } from "./components";

export default function App() {
  const [sidebarList, setSidebarList] = useState(null);
  const [colors, setColors] = useState(null);
  const [selectedListId, setSelectedListId] = useState(null);
  let location = useLocation();
  let history = useHistory();

  useEffect(() => {
    axios
      .get(
        "https://json-server-todo-alex.herokuapp.com/lists?_expand=color&_embed=tasks"
      )
      .then(({ data }) => {
        setSidebarList(data);
      });
    axios
      .get("https://json-server-todo-alex.herokuapp.com/colors")
      .then(({ data }) => {
        setColors(data);
      });
  }, []);

  useEffect(() => {
    setSelectedListId(Number(location.pathname.split(`lists/`)[1]));
  }, [sidebarList, location.pathname]);

  const onAddTask = (listId, taskObj) => {
    const newList = sidebarList.map((item) => {
      if (item.id === listId) {
        item.tasks = [...item.tasks, taskObj];
      }
      return item;
    });
    setSidebarList(newList);
  };

  const onEditListTitle = (id, title) => {
    const newList = sidebarList.map((item) => {
      if (item.id === id) {
        item.name = title;
      }
      return item;
    });
    setSidebarList(newList);
  };

  const onChangeTaskStatus = (taskId, listId) => {
    const newList = sidebarList.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.map((item) => {
          if (item.id === taskId) {
            item.completed = !item.completed;
          }
          return item;
        });
      }
      return list;
    });
    setSidebarList(newList);
  };

  const onRemoveTask = (taskId, listId) => {
    const newList = sidebarList.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.filter((task) => task.id !== taskId);
      }
      return list;
    });
    setSidebarList(newList);
  };

  const onEditTaskText = (taskId, newText, listId) => {
    const newList = sidebarList.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.map((item) => {
          if (item.id === taskId) {
            item.text = newText;
          }
          return item;
        });
      }
      return list;
    });
    setSidebarList(newList);
  };

  const onRemoveList = (listId) => {
    setSidebarList(sidebarList.filter((list) => list.id !== listId));
  };

  const onAddList = (list) => {
    setSidebarList([...sidebarList, list]);
  };

  const selectedList = sidebarList?.find(({ id }) => id === selectedListId);

  return (
    <Context.Provider
      value={{
        onAddTask,
        onEditListTitle,
        onChangeTaskStatus,
        onRemoveTask,
        onEditTaskText,
        onRemoveList,
        onAddList,
      }}
    >
      <div className="todo">
        <div className="todo__sidebar">
          <List
            onClickItem={() => history.push("/")}
            items={[
              {
                icon: (
                  <svg
                    width="14"
                    height="12"
                    viewBox="0 0 14 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.96 5.10001H5.74001C5.24321 5.10001 5.20001 5.50231 5.20001 6.00001C5.20001 6.49771 5.24321 6.90001 5.74001 6.90001H10.96C11.4568 6.90001 11.5 6.49771 11.5 6.00001C11.5 5.50231 11.4568 5.10001 10.96 5.10001ZM12.76 9.60001H5.74001C5.24321 9.60001 5.20001 10.0023 5.20001 10.5C5.20001 10.9977 5.24321 11.4 5.74001 11.4H12.76C13.2568 11.4 13.3 10.9977 13.3 10.5C13.3 10.0023 13.2568 9.60001 12.76 9.60001ZM5.74001 2.40001H12.76C13.2568 2.40001 13.3 1.99771 13.3 1.50001C13.3 1.00231 13.2568 0.600006 12.76 0.600006H5.74001C5.24321 0.600006 5.20001 1.00231 5.20001 1.50001C5.20001 1.99771 5.24321 2.40001 5.74001 2.40001ZM2.86001 5.10001H1.24001C0.743212 5.10001 0.700012 5.50231 0.700012 6.00001C0.700012 6.49771 0.743212 6.90001 1.24001 6.90001H2.86001C3.35681 6.90001 3.40001 6.49771 3.40001 6.00001C3.40001 5.50231 3.35681 5.10001 2.86001 5.10001ZM2.86001 9.60001H1.24001C0.743212 9.60001 0.700012 10.0023 0.700012 10.5C0.700012 10.9977 0.743212 11.4 1.24001 11.4H2.86001C3.35681 11.4 3.40001 10.9977 3.40001 10.5C3.40001 10.0023 3.35681 9.60001 2.86001 9.60001ZM2.86001 0.600006H1.24001C0.743212 0.600006 0.700012 1.00231 0.700012 1.50001C0.700012 1.99771 0.743212 2.40001 1.24001 2.40001H2.86001C3.35681 2.40001 3.40001 1.99771 3.40001 1.50001C3.40001 1.00231 3.35681 0.600006 2.86001 0.600006Z"
                      fill="black"
                    />
                  </svg>
                ),
                name: "Все задачи",
                active: location.pathname === "/",
              },
            ]}
          />
          {sidebarList ? (
            <List
              items={sidebarList}
              onClickItem={(id) => {
                history.push(`/lists/${id}`);
              }}
              selectedItemId={selectedListId}
              isRemovable
            />
          ) : (
            "Загрузка..."
            // Добавить loader с анимацией
          )}
          {sidebarList ? (
            <AddButtonList
              sidebarListLength={sidebarList.length}
              colors={colors}
            />
          ) : null}
        </div>
        <div className="todo__tasks tasks">
          <Route exact path="/">
            {sidebarList &&
              sidebarList.map((list) => (
                <Tasks key={list.id} list={list} withoutEmpty />
              ))}
          </Route>
          {sidebarList && selectedList && <Tasks list={selectedList} />}
        </div>
      </div>
    </Context.Provider>
  );
}
