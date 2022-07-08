import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { dbFireStore } from "../../../lib/firebase";
import { Input } from "../elements/Input";
import { Reorder, useMotionValue } from "framer-motion";
import { CheckIcon, TrashIcon, XIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { H4, P } from "../elements/Text";
import { useRaisedShadow } from "../UseRaisedShadow";
import { LoadingSvg } from "../LoadingSvg";
import { setLocalStorage } from "../../../lib/localStorage";
import { KEYS } from "../../../utils/constants/localStorageKey";

export const Todos = ({
  userId,
  todos,
  storageActionKey,
  userDetails,
  setUserDetails,
}) => {
  const [todo, setTodo] = useState("");
  const [todosArray, setTodosArray] = useState([]);

  useEffect(() => {
    if (todos) setTodosArray(todos);
  }, [todos]);

  function getCurrentTime() {
    var date = new Date();
    var hh = date.getHours();
    var mm = date.getMinutes();

    let amORpm = hh >= 12 ? "PM" : "AM";

    let curr_time = hh + ":" + mm + " " + amORpm;
    return curr_time;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = new Date();
    const _date = date.toISOString().split("T")[0];

    const addTodo = {
      todo,
      completed: false,
      date: _date,
      time: getCurrentTime(),
    };

    if (storageActionKey === "database") {
      const userTodosRef = doc(dbFireStore, "users", userId);
      await updateDoc(userTodosRef, {
        todos: arrayUnion(addTodo),
      });
    } else {
      var allTodos = userDetails.todos;
      allTodos.push(addTodo);
      setUserDetails({
        ...userDetails,
        todos: allTodos,
      });
      setLocalStorage(
        KEYS.localStorage.userDetails,
        JSON.stringify(userDetails)
      );
    }
    setTodo("");
  };

  const changeTheCompletedStatus = async (todo) => {
    var newTodosAfterMark = todosArray.map((val) => {
      if (val === todo) {
        val.completed = !val.completed;
        return val;
      }
      return val;
    });

    if (storageActionKey === "database") {
      const userTodosRef = doc(dbFireStore, "users", userId);
      await updateDoc(userTodosRef, {
        todos: newTodosAfterMark,
      });
    } else {
      setUserDetails({
        ...userDetails,
        todos: newTodosAfterMark,
      });
      setLocalStorage(
        KEYS.localStorage.userDetails,
        JSON.stringify(userDetails)
      );
    }
  };

  const deleteTodo = async (todo) => {
    const deletedTodos = todosArray.filter((val) => {
      return val !== todo;
    });

    if (storageActionKey === "database") {
      const userTodosRef = doc(dbFireStore, "users", userId);
      await updateDoc(userTodosRef, {
        todos: deletedTodos,
      });
    } else {
      setUserDetails({
        ...userDetails,
        todos: deletedTodos,
      });
      setLocalStorage(
        KEYS.localStorage.userDetails,
        JSON.stringify({ ...userDetails, todos: deletedTodos })
      );
    }
  };

  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col overflow-x-auto">
        {todosArray.length >= 1 ? (
          <Reorder.Group
            axis="x"
            values={todosArray}
            onReorder={setTodosArray}
            className="w-full flex px-5 gap-x-10 py-5"
          >
            {todosArray.map((todo, index) => (
              <Reorder.Item
                id={index}
                value={todo}
                key={index}
                style={{ boxShadow, y }}
                whileDrag={{ scale: 1.1 }}
                className={clsx(
                  "relative p-2 rounded-md",
                  todo.completed ? "bg-red-300/50" : "bg-green-300/20"
                )}
              >
                <div className="w-60 flex flex-col gap-2 p-2">
                  <button
                    onClick={() => deleteTodo(todo)}
                    className="absolute -top-2 -right-2 bg-red-600 p-1 rounded-full"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => changeTheCompletedStatus(todo)}
                    className={clsx(
                      "absolute -top-2 -left-2 p-1 rounded-full",
                      todo.completed ? "bg-red-600" : "bg-green-600"
                    )}
                  >
                    {todo.completed ? (
                      <XIcon className="w-4 h-4" />
                    ) : (
                      <CheckIcon className="w-4 h-4" />
                    )}
                  </button>
                  <H4 className={todo.completed ? "line-through" : ""}>
                    {todo.todo}
                  </H4>
                  <P className="text-xs">
                    {todo.date} {todo.time}
                  </P>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          <LoadingSvg />
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center">
        <Input
          placeholder="Create a Todo"
          value={todo}
          onChange={({ target }) => setTodo(target.value)}
        />
      </form>
    </div>
  );
};
