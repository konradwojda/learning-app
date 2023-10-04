import { TestBed } from '@angular/core/testing';

import { CsrfTokenInterceptor } from './csrf-token.interceptor';

describe('CsrfTokenInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      CsrfTokenInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: CsrfTokenInterceptor = TestBed.inject(CsrfTokenInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
