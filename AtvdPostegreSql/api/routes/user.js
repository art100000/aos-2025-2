import { Router } from "express";
import models from "../models/index.js";

const router = Router();
const User = models.User;

router.get("/", async (req, res) => {
  try {
    const userList = await User.findAll();

    return res.status(200).send({
      "data": userList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Erro interno do servidor."
    }); 
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const foundUser = await User.findByPk(userId);

    if (!foundUser) {
      return res.status(404).send({
        error: "Usuário não encontrado",
      });
    }
    return res.status(200).send({
      message: "Usuário localizado com sucesso",
      data: foundUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Erro interno do servidor."
    }); 
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).send({
        error: "Os campos 'username' e 'email' são obrigatórios!"
      });
    }
    
    const userData = {
      email,
      username 
    };

    const createdUser = await User.create(userData);
    
    return res.status(201).send({
      message: "Novo usuário registrado com sucesso",
      data: createdUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Erro interno do servidor."
    }); 
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email } = req.body;

    const existingUser = await User.findByPk(userId);

    if (!existingUser) {
      return res.status(404).send({
        error: "Usuário não encontrado!"
      });
    }

    const updatedData = {
      email: email,
      username: username 
    };

    await User.update(updatedData, {
      where: {
        id: userId
      }
    });

    return res.status(200).send({
      message: "Informações do usuário atualizadas com sucesso",
      data: updatedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Erro interno do servidor."
    }); 
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userToDelete = await User.findByPk(userId);

    if (!userToDelete) {
      return res.status(404).send({
        error: "Usuário não encontrado!"
      });
    }

    await User.destroy({
      where: {
        id: userId,
      }
    });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send({
      error: "Erro interno do servidor."
    }); 
  }
});

export default router;