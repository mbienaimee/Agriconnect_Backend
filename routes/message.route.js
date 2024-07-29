import express from 'express';
import { sendMessage, viewMessages, viewMessageById, deleteMessage } from '../Controllers/message.controller.js';

const router = express.Router();

router.post('/Addmessages', sendMessage);
router.get('/Allmessages', viewMessages);
router.get('/messages/:id', viewMessageById);
router.delete('/messages/:id', deleteMessage);

export default router;
