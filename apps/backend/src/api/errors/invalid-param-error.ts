import { HttpError } from './http-error';

export class InvalidParamError extends HttpError {
  constructor(param: string, extraMessage?: string, uuid?: string) {
    super({
      message: `The received value for field '${param}' is invalid. ${extraMessage ?? ''}`,
      name: 'InvalidParamError',
      code: 'INVALID_PARAM_ERROR',
      uuid,
      extras: {
        param,
      },
    });
  }
}
