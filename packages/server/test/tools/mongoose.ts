import mongoose from 'mongoose'

export const connectMongo = async (): Promise<void> => {
  // FIXME: Use MONGO_PORT in .env
  await mongoose.connect(`mongodb://127.0.0.1:6002/test-server`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
}
