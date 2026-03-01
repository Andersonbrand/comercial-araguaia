import mongoose from "mongoose"

export default async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB conectado ✅")
  } catch (err) {
    console.error("Erro ao conectar Mongo ❌", err)
    process.exit()
  }
}