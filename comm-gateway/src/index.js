const express = require("express");
const { Kafka } = require("kafkajs");
const bodyParser = require("body-parser");

const app = express();
const kafka = new Kafka({
    clientId: "comm-gateway",
    brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();

app.use(bodyParser.json());

app.post("/communication", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        await producer.send({
            topic: "communication.raw",
            messages: [{ value: message }],
        });
        res.status(200).json({ status: "Message sent to Kafka" });
    } catch (error) {
        console.error("Error sending message to Kafka", error);
        res.status(500).json({ error: "Failed to send message" });
    }
});

const start = async () => {
    await producer.connect();
    app.listen(3000, () => {
        console.log("Comm-gateway listening on port 3000");
    });
};

start().catch(console.error);
