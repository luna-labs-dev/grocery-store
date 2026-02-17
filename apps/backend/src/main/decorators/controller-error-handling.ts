import type { Constructor } from './decorator-types';
import { type Controller, type HttpError, serverError } from '@/api';

export const controllerErrorHandling = () => {
  return <T extends Constructor<Controller>>(target: T) => {
    const originalHandle = target.prototype.handle;

    target.prototype.handle = async function (request: any) {
      try {
        const httpResponse = await originalHandle.apply(this, [request]);

        return httpResponse;
      } catch (error) {
        console.log(error);
        return serverError(error as HttpError);
      }
    };
    return target;
  };
};
