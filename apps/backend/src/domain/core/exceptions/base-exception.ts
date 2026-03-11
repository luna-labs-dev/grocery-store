import z, { type ZodObject } from 'zod';
import type { HttpStatusCode } from '../enums/http-status-code';
import { env } from '@/main/config/env';

const { baseConfig } = env;

export interface IBaseException<TErrorType = unknown> extends Error {
  statusCode: HttpStatusCode;
  code: string;
  extras?: TErrorType;
  schema: ZodObject;
}

interface IBaseExceptionProps<TErrorType = unknown> {
  extras?: TErrorType;
  schema?: ZodObject;
}

export const exceptionResultSchema = z.object({
  code: z.string(),
  message: z.string(),
});

const getExceptionSchema = () => {
  if (baseConfig.environment !== 'production') {
    return exceptionResultSchema.extend({
      stack: z.string().optional(),
    });
  }

  return exceptionResultSchema;
};

const exceptionSchema = getExceptionSchema();

export type ExceptionResult = z.infer<typeof exceptionSchema> & {
  stack?: string;
};

export abstract class BaseException<TErrorType = unknown>
  extends Error
  implements IBaseException<TErrorType>
{
  abstract statusCode: HttpStatusCode;
  name: string;
  code: string;
  extras?: TErrorType;
  schema: z.ZodObject<z.ZodRawShape>;

  constructor(message: string, props?: IBaseExceptionProps<TErrorType>) {
    super(message);

    const { extras, schema } = props || {};

    this.schema = schema?.extend(exceptionSchema.shape) || exceptionSchema;
    this.name = Object.getPrototypeOf(this).constructor.name;
    this.code = this.generateExceptionCode(this.name);

    this.extras = extras;
  }

  toJSON(): ExceptionResult {
    let result: ExceptionResult = {
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
