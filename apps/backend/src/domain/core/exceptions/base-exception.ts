import { type ZodObject, type ZodRawShape, z } from 'zod';
import type { HttpStatusCode } from '../enums/http-status-code';

/**
 * [PR-EXCEPTION-TYPE-DEFINITION]
 * Type representing a BaseException class (constructor) with static metadata.
 */
export type BaseExceptionClass<T = unknown> = {
  // biome-ignore lint/suspicious/noExplicitAny: Generic constructor requires any[]
  new (...args: any[]): BaseException<T>;
  statusCode: number;
  contextSchema?: ZodObject<ZodRawShape>;
};

/**
 * [PR-EXCEPTION-STANDARD-SCHEMA]
 * Every exception response must follow this base structure.
 * Subclasses will extend this using .extend()
 */
export const baseExceptionResultSchema = z.object({
  code: z
    .string()
    .describe(
      'Unique semantic exception code for frontend handling (e.g. USER_NOT_FOUND)',
    ),
  message: z.string().describe('Human readable error message'),
});

export type BaseExceptionResult = z.infer<typeof baseExceptionResultSchema>;

export interface IBaseExceptionProps<T = unknown> {
  statusCode: HttpStatusCode;
  context?: T;
  schema?: ZodObject<ZodRawShape>;
  code?: string;
}

/**
 * [PR-EXCEPTION-ARCHITECTURE]
 * Abstract base class for all application exceptions.
 * Uses Schema-First Inference where the context data type 'T' is derived from a Zod schema.
 */
export abstract class BaseException<T = unknown> extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly code: string;
  public readonly extras?: T;
  public readonly schema: ZodObject<ZodRawShape>;

  constructor(message: string, props: IBaseExceptionProps<T>) {
    super(message);

    // Ensure the name of the error matches the class name
    this.name = this.constructor.name;

    this.statusCode = props.statusCode;
    this.extras = props.context;

    // Generate code from class name if not explicitly provided
    // e.g. UserNotFoundException -> USER_NOT_FOUND_EXCEPTION
    this.code = props.code || this.generateExceptionCode(this.name);

    // Build the final schema by extending the base schema with context-specific fields
    // and narrowing the 'code' field to a literal if possible (in subclasses)
    const contextShape = props.schema?.shape || {};
    const codeLiteral = z.literal(this.code);
    this.schema = baseExceptionResultSchema.extend(contextShape).extend({
      code: codeLiteral.catch(this.code as never),
    }) as unknown as ZodObject<ZodRawShape>;

    // Capture stack trace in environments that support it
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Serializes the exception for API responses.
   * Includes code, message, and any extra context data.
   */
  public toJSON(): BaseExceptionResult & T {
    const result = {
      code: this.code,
      message: this.message,
      ...(this.extras || ({} as T)),
    };

    return result as BaseExceptionResult & T;
  }

  /**
   * Converts PascalCase class names to UPPER_SNAKE_CASE codes.
   */
  private generateExceptionCode(className: string): string {
    return className.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
  }
}
