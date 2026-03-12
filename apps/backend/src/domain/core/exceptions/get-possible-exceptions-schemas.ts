import z from 'zod';
import type { BaseException, ExceptionResult } from './base-exception';
import {
  UnauthorizedException,
  UnexpectedException,
} from './generic-exceptions';

export const getPossibleExceptionsSchemas = (
  exceptions: BaseException[] = [],
) => {
  const commonExceptions = [
    new UnexpectedException(),
    new UnauthorizedException(),
  ];
  return exceptions
    .concat(commonExceptions)
    .reduce(
      (
        acc: Record<
          number,
          z.ZodType<ExceptionResult | z.infer<typeof exception.schema>>
        >,
        exception,
      ) => {
        if (acc[exception.statusCode]) {
          const existingException = acc[exception.statusCode];

          if (existingException instanceof z.ZodUnion) {
            // If it is already a union, add the next schema to the union's options
            acc[exception.statusCode] = z.union([
              ...existingException.options,
              exception.schema,
            ] as unknown as [
              z.ZodTypeAny,
              z.ZodTypeAny,
              ...z.ZodTypeAny[],
            ]) as unknown as z.ZodType<
              ExceptionResult | z.infer<typeof exception.schema>
            >;
          } else {
            // Join the existing zod schema with the new one with a z.union
            acc[exception.statusCode] = z.union([
              existingException,
              exception.schema,
            ] as unknown as [
              z.ZodTypeAny,
              z.ZodTypeAny,
              ...z.ZodTypeAny[],
            ]) as unknown as z.ZodType<
              ExceptionResult | z.infer<typeof exception.schema>
            >;
          }

          return acc;
        }

        // If the key (errorCode) does not exist, just add the schema
        acc[exception.statusCode] = exception.schema;
        return acc;
      },
      {},
    );
};
