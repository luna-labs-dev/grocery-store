import { type ZodObject, type ZodRawShape, z } from 'zod';
import {
  type BaseExceptionClass,
  baseExceptionResultSchema,
} from '@/domain/core/exceptions/base-exception';
import {
  UnauthorizedException,
  UnexpectedException,
} from '@/domain/core/exceptions/generic-exceptions';

/**
 * [PR-EXCEPTION-NATURE-ROLE] mapExceptionsToSchema
 * Private utility to map BaseException subclasses to Zod schemas for Fastify documentation.
 */
export function mapExceptionsToSchema(
  ...exceptions: BaseExceptionClass[]
): z.ZodTypeAny {
  const schemas = exceptions.map((Exc) => {
    const contextShape = Exc.contextSchema?.shape || {};
    const defaultCode = Exc.name
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .toUpperCase();

    return baseExceptionResultSchema.extend(contextShape).extend({
      code: z.literal(defaultCode),
    }) as unknown as ZodObject<ZodRawShape>;
  });

  if (schemas.length === 1) {
    return schemas[0];
  }

  return z.union(
    schemas as unknown as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]],
  );
}

/**
 * [PR-EXCEPTION-MAPPING-REGISTRY]
 * Helper to consolidate multiple exceptions into a Fastify-compatible response schema.
 * Automatically includes common exceptions (Unexpected, Unauthorized).
 * This utility lives in the API layer because it is purely for Documentation (Swagger/Scalar).
 */
export const getPossibleExceptionsSchemas = (
  exceptions: BaseExceptionClass[] = [],
) => {
  const commonExceptions = [UnexpectedException, UnauthorizedException];
  const allExceptions = [...commonExceptions, ...exceptions];

  // Group exceptions by status code to handle unions per status code
  const groupedByStatus = allExceptions.reduce(
    (acc, Exc) => {
      const status = Exc.statusCode;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(Exc);
      return acc;
    },
    {} as Record<number, BaseExceptionClass[]>,
  );

  // Map each group to a Zod schema
  const result: Record<number, z.ZodTypeAny> = {};
  for (const [status, classes] of Object.entries(groupedByStatus)) {
    result[Number(status)] = mapExceptionsToSchema(...classes);
  }

  return result;
};
