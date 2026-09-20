import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/hacktrack";
  try {
    await mongoose.connect(uri);
    console.log(`[db] connected -> ${uri}`);
  } catch (err) {
    console.error("[db] connection error:", err);
    process.exit(1);
  }
}
