import { HttpException } from "./root.js";




export class UnprocessablEntity extends HttpException {
  constructor(message: string, errorCode: number, error: any) {
    super(message, errorCode, 422, error);
  }
  } 