import type { FastifyInstance } from 'fastify';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { authenticate, cleanupDatabase, initApp } from './setup';

describe('Group E2E', () => {
  let app: FastifyInstance;
  let cookie: string;

  beforeAll(async () => {
    app = await initApp();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    const auth = await authenticate(app, 'group-test@example.com');
    cookie = auth.cookie;
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  it('should create a new group', async () => {
    const groupData = {
      name: 'E2E Test Group',
      description: 'Test Description',
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/group',
      headers: {
        cookie,
      },
      payload: groupData,
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.payload);
    expect(body.id).toBeDefined();
    expect(body.name).toBe(groupData.name);
    expect(body.inviteCode).toBeDefined();
  });

  it('should list all groups for the user', async () => {
    // Create one group first
    await app.inject({
      method: 'POST',
      url: '/api/group',
      headers: { cookie },
      payload: { name: 'Group 1' },
    });

    const response = await app.inject({
      method: 'GET',
      url: '/api/group',
      headers: { cookie },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(1);
    expect(body[0].name).toBe('Group 1');
  });

  it('should allow joining a group with invite code', async () => {
    // 1. Create a group with User A
    const createRes = await app.inject({
      method: 'POST',
      url: '/api/group',
      headers: { cookie },
      payload: { name: 'Join Test Group' },
    });
    const { inviteCode } = JSON.parse(createRes.payload);

    // 2. Authenticate User B
    const authB = await authenticate(app, 'user-b@example.com');
    const cookieB = authB.cookie;

    // 3. User B joins group
    const joinRes = await app.inject({
      method: 'POST',
      url: '/api/group/join',
      headers: { cookie: cookieB },
      payload: { inviteCode },
    });

    expect(joinRes.statusCode).toBe(204);

    // 4. Verify User B has the group
    const groupsRes = await app.inject({
      method: 'GET',
      url: '/api/group',
      headers: { cookie: cookieB },
    });
    const groups = JSON.parse(groupsRes.payload);
    expect(groups).toHaveLength(1);
    expect(groups[0].name).toBe('Join Test Group');
  });

  it('should allow creating groups with the same name', async () => {
    const groupName = 'Duplicate Name';

    // 1. Create group with User A
    const resA = await app.inject({
      method: 'POST',
      url: '/api/group',
      headers: { cookie },
      payload: { name: groupName },
    });
    expect(resA.statusCode).toBe(201);

    // 2. Authenticate User B
    const authB = await authenticate(app, 'user-b@example.com');
    const cookieB = authB.cookie;

    // 3. Create group with User B using same name
    const resB = await app.inject({
      method: 'POST',
      url: '/api/group',
      headers: { cookie: cookieB },
      payload: { name: groupName },
    });
    expect(resB.statusCode).toBe(201);

    // 4. Verify both have their respective groups
    const fetchA = await app.inject({
      method: 'GET',
      url: '/api/group',
      headers: { cookie },
    });
    const fetchB = await app.inject({
      method: 'GET',
      url: '/api/group',
      headers: { cookie: cookieB },
    });

    const groupsA = JSON.parse(fetchA.payload);
    const groupsB = JSON.parse(fetchB.payload);

    expect(groupsA.some((g: { name: string }) => g.name === groupName)).toBe(
      true,
    );
    expect(groupsB.some((g: { name: string }) => g.name === groupName)).toBe(
      true,
    );

    expect(groupsA[0].id).not.toBe(groupsB[0].id);
  });
});
