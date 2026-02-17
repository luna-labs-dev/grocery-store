export const authWebhooksTypeList = ['user.created'] as const;

export type AuthWebhooksType = (typeof authWebhooksTypeList)[number];
