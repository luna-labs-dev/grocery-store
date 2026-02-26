import z from 'zod';
import type { HttpStatusCode } from '../enums/http-status-code';
import { env } from '@/main/config/env';

const { baseConfig } = env;

export interface IBaseException<TErrorType = any> extends Error {
  statusCode: HttpStatusCode;
  code: string;
  extras?: TErrorType;
}

interface IBaseExceptionProps<TErrorType = any> {
  statusCode: HttpStatusCode;
  extras?: TErrorType;
}

export const exceptionResultSchema = z
  .object({
    name: z.string(),
    code: z.string(),
    message: z.string(),
    stack: z.string().optional(),
  })
  .loose();

export type ExceptionResult = z.infer<typeof exceptionResultSchema>;

export abstract class BaseException<TErrorType = any>
  extends Error
  implements IBaseException<TErrorType>
{
  name: string;
  code: string;
  statusCode: HttpStatusCode;
  extras?: TErrorType;

  constructor(message: string, props: IBaseExceptionProps<TErrorType>) {
    super(message);

    const { statusCode, extras } = props;

    this.name = Object.getPrototypeOf(this).constructor.name;
    this.code = this.generateExceptionCode(this.name);
    this.statusCode = statusCode;
    this.extras = extras;
  }

  toJSON(): ExceptionResult {
    let result: ExceptionResult = {
      name: this.name,
      code: this.code,
      message: this.message,
    };

    if (this.extras) {
      result = { ...result, ...this.extras };
    }

    if (this.stack && baseConfig.environment !== 'production') {
      result = { ...result, stack: this.stack };
    }

    return result;
  }

  private generateExceptionCode(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
  }
}
