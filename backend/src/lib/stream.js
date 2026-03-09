import { StreamChat } from "stream-chat";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) console.log("stream Api key or secrete missing");

const streamCliemt = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    //if data exist it updates else it creates user data
    await streamCliemt.upsertUser(userData);
    console.log(userData)
    return userData;
  } catch (error) {
    console.error("Error upserting stream user", error);
  }
};




