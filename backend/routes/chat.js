const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful study assistant. Provide concise, practical advice about studying, time management, and maintaining focus. Keep responses friendly and encouraging."
                    },
                    { role: "user", content: message }
                ],
                temperature: 0.7,
                max_tokens: 150
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error from OpenAI:", error.response?.data || error);
        res.status(500).json({ 
            message: "Failed to get AI response",
            error: error.response?.data || error.message
        });
    }
});

module.exports = router; 