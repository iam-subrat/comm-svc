const { Kafka } = require("kafkajs");
const { Client } = require("pg");

const kafka = new Kafka({
    clientId: "persist-worker",
    brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: "persist-group" });
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: 5432,
});

const run = async () => {
    await consumer.connect();
    await client.connect();
    await consumer.subscribe({
        topic: "communication.raw",
        fromBeginning: true,
    });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const msgValue = message.value.toString();
            console.log(`Received message: ${msgValue}`);

            // Process and save to Postgres
            const query =
                "INSERT INTO messages (content) VALUES ($1) RETURNING id";
            const record = await client.query(query, [msgValue]);
            const recordId = record.rows ? record.rows[0]?.id : null;

            // Produce message to communication.ready topic
            const producer = kafka.producer();
            await producer.connect();
            await producer.send({
                topic: "communication.ready",
                messages: [{ value: msgValue, key: recordId.toString() }],
            });
            await producer.disconnect();
        },
    });
};

run().catch(console.error);
