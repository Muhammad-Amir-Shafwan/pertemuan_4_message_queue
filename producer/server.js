const express = require("express");
const amqp = require("amqplib");

const app = express();
app.use(express.json());

async function sendMessage(userData) {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "user_registration";

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(userData)), { persistent: true });

    console.log("Message sent:", userData);
    setTimeout(() => {
        connection.close();
    }, 500);
}

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

    await sendMessage({ name, email, password });
    res.status(202).json({ message: "User registration queued" });
});

app.listen(3000, () => console.log("Producer running on port 3000"));
