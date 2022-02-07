import { connectMongo, disconnectMongo } from "../util/mongoose";

export const queryDB: any = async (query: Promise<any>, queryDescription: string) => {
  try {
    await connectMongo();
    const queryResponse = await query;
    console.log(`=> ${queryDescription}\n${queryResponse}`);
    await disconnectMongo();
    return queryResponse;
  } catch (error) {
    console.log("Database error", error);
    return error;
  }
};
