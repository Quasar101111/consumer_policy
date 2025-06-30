import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';

import { TokenInterceptor } from './token.interceptor';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs';

describe('tokenInterceptor', () => {
  let interceptor: TokenInterceptor;
  let httpHandlerSpy: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenInterceptor]
    });
    interceptor = TestBed.inject(TokenInterceptor);
    httpHandlerSpy = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);
  });



  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header if token exists', () => {
    const token = 'test-token';
    spyOn(localStorage, 'getItem').and.returnValue(token);
    const httpRequest = new HttpRequest('GET', '/test');
    httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(httpRequest, httpHandlerSpy).subscribe();

    expect(httpHandlerSpy.handle).toHaveBeenCalled();
    const calledWith = httpHandlerSpy.handle.calls.mostRecent().args[0];
    expect(calledWith.headers.get('Authorization')).toBe(`Bearer ${token}`);
  });

  it('should not add Authorization header if token does not exist', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const httpRequest = new HttpRequest('GET', '/test');
    httpHandlerSpy.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(httpRequest, httpHandlerSpy).subscribe();

    expect(httpHandlerSpy.handle).toHaveBeenCalledWith(httpRequest);
    expect(httpRequest.headers.has('Authorization')).toBeFalse();
  });

});
