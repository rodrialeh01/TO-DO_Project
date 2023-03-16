import express from "express";
import { getDBConnection } from "../db/index.js";
import { validator } from "../middlewares/validator.js";

export const TodosRouter = express.Router();

TodosRouter.get("/to-dos", async function (request, response) {
  try {
    const db = await getDBConnection();

    const todos = await db.all("SELECT * FROM todos");

    await db.close();

    response.send({ todos });
  } catch (error) {
    response.status(500).send({
      message: "Something went wrong trying to get to dos",
      error,
    });
  }
});

TodosRouter.post(
  "/to-do",
  validator,
  async function (request, response) {
    try {
      const { title, description } = request.body;
      const db = await getDBConnection();

      await db.run(`
        INSERT INTO todos (title, description)
        VALUES (
          '${title}',
          '${description}'
        )
      `);

      await db.close();

      response.send({
        newTodo: { title, description },
      });
    } catch (error) {
      console.error(error);
      response.status(500).send({
        message: "Something went wrong trying to create a new to do",
        error,
      });
    }
  }
);

TodosRouter.delete("/to-do/:id", async function (request, response) {
  try {
    const id = request.params.id;

    const db = await getDBConnection();

    const todoExists = await db.get(
      `SELECT * FROM todos WHERE id = ?`,
      id
    );

    if (!todoExists) {
      return response
        .status(404)
        .send({ message: "To Do Not Found" });
    }

    const deletionInfo = await db.run(
      `DELETE FROM todos WHERE id = ?`,
      id
    );

    await db.close();

    response.send({ deletionInfo });
  } catch (error) {
    response.status(500).send({
      message: "Something went wrong trying to delete a todo",
      error,
    });
  }
});

TodosRouter.patch("/to-do/:id", async function (request, response) {
  try {
    const { id } = request.params;
    const db = await getDBConnection();

    const todoExists = await db.get(
      `SELECT * FROM todos WHERE id = ?`,
      id
    );

    if (!todoExists) {
      return response
        .status(404)
        .send({ message: "To Do Not Found" });
    }

    const { title, description, isDone: is_done } = request.body;

    await db.run(
      `UPDATE todos 
       SET title = ?, description = ?, is_done = ?, status = ?
       WHERE id = ?
    `,
      title || todoExists.title,
      description || todoExists.description,
      is_done !== undefined ? is_done : todoExists.is_done,
      status !== undefined ? status : todoExists.status,
      id
    );

    await db.close();

    response.send({ message: "To do updated" });
  } catch (error) {
    response.status(500).send({
      message: "Something went wrong trying to update a todo",
      error,
    });
  }
});

TodosRouter.put("/to-do/:id", async function (request, response) {
    try {
      const { id } = request.params;
      const db = await getDBConnection();
  
      const todoExists = await db.get(
        `SELECT * FROM todos WHERE id = ?`,
        id
      );
  
      if (!todoExists) {
        return response
          .status(404)
          .send({ message: "To Do Not Found" });
      }
      
      let aux = todoExists.is_done==0 ? 1 : 0;
  
      await db.run(
        `UPDATE todos 
         SET is_done = ?
         WHERE id = ?
      `,
        aux,
        id
      );
  
      await db.close();
  
      response.send({ message: "To do updated" });
    } catch (error) {
      response.status(500).send({
        message: "Something went wrong trying to update a todo",
        error,
      });
    }
  });

TodosRouter.put("/to-do/status/:id", async function (request, response) {
    try {
      const { id } = request.params;
      const db = await getDBConnection();
  
      const todoExists = await db.get(
        `SELECT * FROM todos WHERE id = ?`,
        id
      );
  
      if (!todoExists) {
        return response
          .status(404)
          .send({ message: "To Do Not Found" });
      }
      
      let aux = todoExists.status==0 ? 1 : 0;
  
      await db.run(
        `UPDATE todos 
         SET status = ?
         WHERE id = ?
      `,
        aux,
        id
      );
  
      await db.close();
  
      response.send({ message: "To do updated" });
    } catch (error) {
      response.status(500).send({
        message: "Something went wrong trying to update a todo",
        error,
      });
    }
  });