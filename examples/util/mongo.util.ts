import mongoose from 'mongoose'

export const connect = async (database: string) => {
  const port = process.env.MONGO_PORT
  if (!port) {
    throw new Error(`Environment variable MONGO_PORT is required`)
  }
  const MONGO_URL = `mongodb://localhost:${port}/${database}`
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
}
