export interface HttpErrorParams {
  name: string;
  message: string;
  code: string;
  stack?: string;
  uuid?: string;
  extras?: any;
}

export interface HttpErrorResult {
  code: string;
  message: string;
  uuid?: string;
}

export interface IHttpError extends Error {
  code: string;
  uuid?: string;
  extras?: any;
  toResult: () => HttpErrorResult;
}

export class HttpError extends Error implements IHttpError {
  code: string;
  uuid?: string;
  extras?: any;

  constructor({ code, name, message, extras, uuid }: HttpErrorParams) {
    super(message);
    this.name = name;
    this.code = code;
    this.uuid = uuid;
    this.extras = extras;
  }

  toResult = (): HttpErrorResult => {
    return {
      code: this.code,
      message: this.message,
      uuid: this.uuid,
      ...this.extras,
    };
  };
}
