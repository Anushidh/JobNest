import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  username: "default",
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

client.on("error", (err) => console.error("Redis Client Error", err));

const connectRedis = async () => {
  try {
    await client.connect();
    console.log("✅ Connected to Redis");
  } catch (error) {
    console.error("❌ Failed to connect to Redis:", error);
  }
};

connectRedis();

export default client;
