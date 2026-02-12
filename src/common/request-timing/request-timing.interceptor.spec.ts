import { RequestTimingInterceptor } from './request-timing.interceptor';

describe('RequestTimingInterceptor', () => {
  it('should be defined', () => {
    expect(new RequestTimingInterceptor()).toBeDefined();
  });
});
