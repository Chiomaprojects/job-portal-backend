import { HttpException } from "./root.js";




export class InternalException extends HttpException {
  constructor(message: string, errorCode: number, error: any) {
    super(message, errorCode, 500, error);
  }
  } 