import { TestBed } from '@angular/core/testing';
import { RoleGuard } from './role-guard';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

describe('RoleGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getRole']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerMock },
      ],
    });

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access if role is admin', () => {
    authServiceSpy.getRole.and.returnValue('admin');

    const result = TestBed.runInInjectionContext(() => {
      const guard = TestBed.inject(RoleGuard);
      return guard.canActivate();
    });

    expect(result).toBeTrue();
  });

  it('should deny access and redirect if role is not admin', () => {
    authServiceSpy.getRole.and.returnValue('normal');

    const result = TestBed.runInInjectionContext(() => {
      const guard = TestBed.inject(RoleGuard);
      return guard.canActivate();
    });

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
  });
});
