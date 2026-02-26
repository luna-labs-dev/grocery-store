import { container } from 'tsyringe';
import { injection } from '../di/injection-tokens';
import type { Constructor } from './decorator-types';
import { type Controller, unauthorized } from '@/api';
import type { GetUser } from '@/domain';

const { usecases } = injection;
export const controllerFamilyBarrierHandling = () => {
  return <T extends Constructor<Controller>>(target: T) => {
    const originalHandle = target.prototype.handle;

    target.prototype.handle = async function (request: any) {
      try {
        const getUser = container.resolve<GetUser>(usecases.getUser);

        const externalUserId = request.auth.userId;
        if (!externalUserId) {
          console.error('external user id is not provided');
          return unauthorized();
        }

        const dbUser = await getUser.execute({
          externalId: externalUserId,
        });

        if (!dbUser.familyId) {
          // if user is not member of any family, return unauthorized with required action to add user to family
          return unauthorized({
            requiredAction: 'add-user-to-family',
          });
        }

        request.familyId = dbUser.familyId;

        const httpResponse = await originalHandle.apply(this, [request]);

        return httpResponse;
      } catch (error) {
        console.log(error);

        return unauthorized();
      }
    };
    return target;
  };
};
