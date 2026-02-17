import type { Readable } from 'node:stream';
import { NotFoundError } from '../errors/not-found-error';
import type { HttpResponse } from '@/api/contracts';
import {
  BadRequestError,
  ConflictError,
  type IHttpError,
  ServerError,
  UnauthorizedError,
  UnprocessableEntityError,
} from '@/api/errors';
import type { UnexpectedError, UseCaseError } from '@/domain';

export interface File {
  file: Readable;
  type: string;
}

export const file = <File>(data: File): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const ok = <T>(data?: T): HttpResponse => ({
  statusCode: 200,
  body: data,
});

export const created = <T>(data?: T): HttpResponse => ({
  statusCode: 201,
  body: data,
});

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null,
});

export const badRequest = (error: UseCaseError): HttpResponse => ({
  statusCode: 400,
  body: new BadRequestError(error.code, error.message, error.uuid),
});

export const unauthorized = (extra?: any): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(extra),
});

export const forbidden = (error: IHttpError): HttpResponse => ({
  statusCode: 403,
  body: error,
});

export const notFound = (error: UseCaseError): HttpResponse => ({
  statusCode: 404,
  body: new NotFoundError(error),
});

export const conflict = (error: UseCaseError): HttpResponse => ({
  statusCode: 409,
  body: new ConflictError(error),
});

export const unprocessableEntity = (error: UseCaseError): HttpResponse => ({
  statusCode: 422,
  body: new UnprocessableEntityError(error.code, error.message, error.uuid),
});

type ServerErrors = IHttpError | UnexpectedError;
export const serverError = (error: ServerErrors): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack ?? ''),
});
