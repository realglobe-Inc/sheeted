import mongoose from 'mongoose'

import { MONGOMS_URI } from './mongod'

export const connectMongo = async (): Promise<void> => {
  await mongoose.connect(MONGOMS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
}
