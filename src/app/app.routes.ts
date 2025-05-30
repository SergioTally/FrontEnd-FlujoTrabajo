import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { AuthGuard } from './guards/auth-guard';
import { RoleGuard } from './guards/role-guard';
import { Users } from './pages/users/users';
import { Tasks } from './pages/tasks/tasks';
import { UsersCreate } from './pages/users/create/users-create';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'users',
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: '', component: Users },
      { path: 'create', component: UsersCreate },
      { path: 'edit/:id', component: UsersCreate },
    ],
  },
  { path: 'tasks', component: Tasks, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' },
];
