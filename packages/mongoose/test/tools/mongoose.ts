import mongoose from 'mongoose'

import { MONGOMS_URI } from './mongod'

export const connectMongo = async () => {
  await mongoose.connect(MONGOMS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
}
