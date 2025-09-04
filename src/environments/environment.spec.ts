import { environment } from './environment';

describe('Environment', () => {
  it('should have correct properties', () => {
    expect(environment).toBeTruthy();
    expect(typeof environment.production).toBe('boolean');
    expect(typeof environment.apiUrl).toBe('string');
    expect(typeof environment.version).toBe('string');
  });

  it('should not be production in dev environment', () => {
    expect(environment.production).toBeFalse();
  });
});
