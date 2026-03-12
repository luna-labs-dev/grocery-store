import { z } from 'zod';

export const adminSettingsParamsSchema = z.object({
  groupId: z.string().uuid(),
});

export const adminUpdateSettingsRequestSchema = z.record(z.string(), z.any());

export const adminSettingsResponseSchema = z.record(z.string(), z.any());
