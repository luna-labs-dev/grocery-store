import { container } from 'tsyringe';
import { injection } from '../di/injection-codes';
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

        const dbUserResult = await getUser.execute({
          externalId: externalUserId,
        });

        if (dbUserResult.isLeft()) {
          console.error(
            `[AuthSync] User authenticated in Clerk (id: ${externalUserId}) but not found in local database. Possible webhook sync delay or failure.`,
          );
          return unauthorized({
            requiredAction: 'register-user',
          });
        }

        const dbUser = dbUserResult.value;

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
