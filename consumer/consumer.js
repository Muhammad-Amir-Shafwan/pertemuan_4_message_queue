const amqp = require("amqplib");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function consumeMessages() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "user_registration";

    await channel.assertQueue(queue, { durable: true });
    console.log("Waiting for messages...");

    channel.consume(queue, async (msg) => {
        if (msg !== null) {
            const userData = JSON.parse(msg.content.toString());
            console.log("Processing:", userData);

            try {
                // Gunakan transaksi Prisma untuk memastikan atomicity
                await prisma.$transaction(async (tx) => {
                    const existingUser = await tx.user.findUnique({
                        where: { email: userData.email }
                    });

                    if (existingUser) {
                        throw new Error(`Email ${userData.email} already exists.`);
                    }

                    await tx.user.create({ data: userData });
                });

                console.log("User saved:", userData.email);
                channel.ack(msg); // Hapus pesan dari queue setelah sukses
            } catch (error) {
                console.error("Database Error:", error.message);
                channel.nack(msg, false, false); // Tolak pesan tanpa requeue (karena akan tetap error)
            }
        }
    });
}

consumeMessages().catch(console.error);
