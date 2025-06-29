const { Kafka } = require("kafkajs");
const { Client } = require("pg");

// PostgreSQL client setup
const pgClient = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: 5432,
});

// Kafka consumer setup
const kafka = new Kafka({
    clientId: "sender-worker",
    brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: "sender-group" });

const run = async () => {
    await pgClient.connect();
    await consumer.connect();
    await consumer.subscribe({
        topic: "communication.ready",
        fromBeginning: true,
    });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const msgValue = message.value.toString();
            console.log(`Received message: ${msgValue}`);

            // Process the message and send via channel adapters
            // Example: sendMessage(msgValue);

            // Update the database status and sent_at timestamp
            const query =
                "UPDATE messages SET status = $1, sent_at = NOW(), updated_at = NOW() WHERE id = $2";
            const values = ["sent", message.key.toString()]; // Assuming message.key contains the message ID
            await pgClient.query(query, values);
        },
    });
};

run().catch(console.error);
