import { Router } from 'express';
import { container } from 'tsyringe';
import { adaptRoute } from '../../adapters';
import { injection } from '../../di';

export const familyRouter = Router();

familyRouter.post(
  '/',
  adaptRoute(container.resolve(injection.controllers.addFamily)),
);
familyRouter.get(
  '/',
  adaptRoute(container.resolve(injection.controllers.getFamily)),
);
familyRouter.post(
  '/join',
  adaptRoute(container.resolve(injection.controllers.joinFamily)),
);
familyRouter.put(
  '/leave',
  adaptRoute(container.resolve(injection.controllers.leaveFamily)),
);
familyRouter.put(
  '/remove',
  adaptRoute(container.resolve(injection.controllers.removeFamilyMember)),
);
