import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth-guard';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    const routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerMock },
      ],
    });

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access when user is logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => {
      const guard = TestBed.inject(AuthGuard);
      return guard.canActivate();
    });

    expect(result).toBeTrue();
  });

  it('should redirect to login if not logged in', () => {
    const mockTree = {} as any;
    authServiceSpy.isLoggedIn.and.returnValue(false);
    routerSpy.createUrlTree.and.returnValue(mockTree);

    const result = TestBed.runInInjectionContext(() => {
      const guard = TestBed.inject(AuthGuard);
      return guard.canActivate();
    });

    expect(result).toBe(mockTree);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});
