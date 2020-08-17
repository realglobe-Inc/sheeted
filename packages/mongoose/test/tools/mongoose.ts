import mongoose from 'mongoose'

import { model01, model02 } from '../fixtures/models'

const models: mongoose.Model<mongoose.Document>[] = [model01, model02]

export const connectMongo = async (): Promise<void> => {
  // FIXME: Use MONGO_PORT in .env
  await mongoose.connect(`mongodb://localhost:6002/test-mongoose`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
}

export const cleanCollections = async (): Promise<void> => {
  for (const model of models) {
    await model.deleteMany({})
  }
}
