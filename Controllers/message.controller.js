import Message from '../models/message.js';

// Send a new message
export const sendMessage = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const newMessage = new Message({ name, email, message });
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    } catch (error) {
        res.status(400).json({ message: 'Error sending message', error: error.message });
    }
};

// View all messages
export const viewMessages = async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving messages', error: error.message });
    }
};

// View a single message by ID
export const viewMessageById = async (req, res) => {
    const { id } = req.params;

    try {
        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json(message);
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving message', error: error.message });
    }
};

// Delete a message by ID
export const deleteMessage = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedMessage = await Message.findByIdAndDelete(id);
        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting message', error: error.message });
    }
};

