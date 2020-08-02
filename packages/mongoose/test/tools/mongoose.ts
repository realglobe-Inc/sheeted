import mongoose from 'mongoose'

export const connectMongo = async (): Promise<void> => {
  // FIXME: Use MONGO_PORT in .env
  const conn = await mongoose.connect(
    `mongodb://localhost:6002/test-mongoose`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
  )

  // To fix error:
  // > MongoError: Unable to read from a snapshot due to pending collection catalog changes; please retry the operation.
  await conn.connection.createCollection('model4')
}
