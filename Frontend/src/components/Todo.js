import React, { useState } from "react";
import TodoForm from "./TodoForm";
import {
  RiCloseCircleLine,
  RiTaskLine,
  RiCreativeCommonsNdLine,
  RiMagicLine,
} from "react-icons/ri";
import { TiEdit } from "react-icons/ti";

const Todo = ({
  todos,
  completeTodo,
  removeTodo,
  updateTodo,
  showDescription,
  changeStatus,
}) => {
  const [edit, setEdit] = useState({
    id: null,
    value: "",
  });

  const submitUpdate = (value) => {
    updateTodo(edit.id, value);
    setEdit({
      id: null,
      value: "",
    });
  };

  if (edit.id) {
    return <TodoForm edit={edit} onSubmit={submitUpdate} />;
  }

  const liClass = (todo) => {
    if (todo.is_done && !todo.status) {
      return "todo-row complete";
    } else if (!todo.is_done && todo.status) {
      return "todo-row-status";
    } else {
      return "todo-row";
    }
  };

  
  return todos.map((todo, index) => (
    // <div>
    <div
      className={liClass(todo)}
      key={index}
    >
      <div className="description" >
        <div
          key={todo.id}
          onClick={() => completeTodo(todo.id)}
          className="todo"
        >
          {todo.title}
          <br/>
          {todo.status ? "In Progress" : ""}
        </div>
        <div className="icons">
          <RiTaskLine
            onClick={() => completeTodo(todo.id)}
            className="delete-icon"
          />
          <RiMagicLine
            onClick={() => changeStatus(todo.id)}
            className="delete-icon"
          />
          <RiCreativeCommonsNdLine
            onClick={() => showDescription(todo.id)}
            className="delete-icon"
          />
          <RiCloseCircleLine
            onClick={() => removeTodo(todo.id)}
            className="delete-icon"
          />
                    <TiEdit
            onClick={() =>setEdit({
                id: todo.id,
                value: todo.title,
                description: todo.description,
              })
            }
            className="edit-icon"
         />
        </div>
      </div>
      {todo.showDescription && (
        <div onClick={() => completeTodo(todo.id)} className="description">
          Description: {todo.description}
          <br/>
          Date: {todo.created_at}
        </div>
      )}
    </div>
    // </div>
  ));
};

export default Todo;
