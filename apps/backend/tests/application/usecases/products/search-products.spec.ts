import { describe, test } from 'vitest';

describe('SearchProducts UseCase', () => {
  test.todo('should search local GlobalProduct database first');
  test.todo('should call ExternalProductClient if not found locally');
  test.todo(
    'should populate local database with selected results from external API',
  );
  test.todo(
    'should handle external API failures gracefully (fallback to local only)',
  );
});
