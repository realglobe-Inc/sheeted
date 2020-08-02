import mongoose from 'mongoose'

export const connectMongo = async (): Promise<void> => {
  // FIXME: Use MONGO_PORT in .env
  await mongoose.connect(`mongodb://localhost:6002/test-mongoose`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
}
