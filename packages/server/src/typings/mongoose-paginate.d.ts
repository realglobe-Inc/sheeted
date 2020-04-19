/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="mongoose-paginate" />

declare module 'mongoose-paginate' {
  import mongoose = require('mongoose')
  export function paginate<T extends mongoose.Document>(
    query?: Record<string, any>,
    options?: mongoose.PaginateOptions,
    callback?: (err: any, result: mongoose.PaginateResult<T>) => void,
  ): Promise<mongoose.PaginateResult<T>>
}
