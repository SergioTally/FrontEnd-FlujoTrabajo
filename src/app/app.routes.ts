import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { AuthGuard } from './guards/auth-guard';
import { RoleGuard } from './guards/role-guard';
import { Users } from './pages/users/users';
import { Tasks } from './pages/tasks/tasks';
import { UsersCreate } from './pages/users/create/users-create';
import { TasksCreate } from './pages/tasks/create/tasks-create';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'users',
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: '', component: Users },
      { path: 'create', component: UsersCreate },
      { path: 'edit/:id', component: UsersCreate, data: { renderMode: 'client' } },
    ],
  },
  {
    path: 'tasks',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: Tasks },
      { path: 'create', component: TasksCreate },
      { path: 'edit/:id', component: TasksCreate, data: { renderMode: 'client' } },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
