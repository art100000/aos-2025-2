import { v4 as uuidv4 } from "uuid";
import { Router } from "express";
import models from '../models/index.js';

const Message = models.Message;
const User = models.User;

const router = Router();

router.get("/", async (req, res) => {
    try {
      const messages = await Message.findAll();
      return res.send({messages: messages});
    } catch (error) {
      return res.status(500).send({
        message: "Erro interno do servidor ao buscar mensagens",
      });
    }
});

router.get("/:messageId", async (req, res) => {
    try {
      const {messageId} = req.params;
      const message = await Message.findByPk(messageId);
      if(!message){
        return res.status(404).send({
          message: "Messagem não encontrada.",
        });
      }
      return res.status(200).send(message);
    }catch (error){
      return res.status(500).send({
        message: "Erro interno do servidor so buscar mensagem."
      });
    }
});

router.post('/', async (req, res) => {
    try {
        const { userId } = req.query;
        const { text } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({
                message: 'Usuário não existente com o id fornecido',
            });
        }

        const newMessage = await Message.create({
            text: text,
            userId: userId,
        });
        return res.status(201).send({
            message: 'Mensagem criada com sucesso',
            mensagem: newMessage,
        });
    } catch (error) {
        return res.status(500).send({
            message: 'Erro interno do servidor ao criar mensagem',
        });
    }
});

router.put('/:messageId', async (req, res) => {
    try {
        const { messageId } = req.params;
        const { text } = req.body;

        const message = await Message.findByPk(messageId);
        if (!message) {
            return res.status(404).send({
                message: 'Mensagem não encontrada',
            });
        }

        await Message.update(
            { text: text },
            {
                where: { id: messageId },
            }
        );

        const updatedMessage = await Message.findByPk(messageId);
        return res.status(200).send({
            message: 'Mensagem atualizada com sucesso',
            mensagem: updatedMessage,
        });
    } catch (error) {
        return res.status(500).send({
            message: 'Erro interno do servidor ao atualizar mensagem',
        });
    }
});

router.delete('/:messageId', async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findByPk(messageId);
        if (!message) {
            return res.status(404).send({
                message: 'Mensagem não encontrada',
            });
        }

        await Message.destroy({
            where: { id: messageId },
        });
        return res.status(204).send({
            message: 'Mensagem deletada com sucesso',
        });
    } catch (error) {
        return res.status(500).send({
            message: 'Erro interno do servidor ao deletar mensagem',
        });
    }
});

export default router;