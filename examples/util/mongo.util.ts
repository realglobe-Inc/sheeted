import mongoose from 'mongoose'

export const connect = async (database: string) => {
  const MONGO_URL = `mongodb://localhost:${process.env.MONGO_PORT}/${database}`
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
}
