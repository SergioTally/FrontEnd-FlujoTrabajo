import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgIf, NgForOf } from '@angular/common';
import { UserService, User } from '../../services/user.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, NgForOf],
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
})
export class Users {
  users: User[] = [];
  newUser: Partial<User> = { email: '', password: '', role: 'normal' };
  editingUser: User | null = null;
  showForm = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Detectar cuando se regresa a la ruta de usuarios
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if ((event as NavigationEnd).urlAfterRedirects === '/users') {
          this.loadUsers();
        }
      });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    console.log('ngOnInit ejecutado');
    this.userService.getAll().subscribe({
      next: (data) => {
        console.log('data', data);
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      },
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  edit(user: User) {
    this.editingUser = user;
    this.newUser = {
      email: user.email,
      role: user.role,
    };
    this.showForm = true;
  }

  cancelEdit() {
    this.editingUser = null;
    this.newUser = { email: '', password: '', role: 'normal' };
    this.showForm = false;
  }

  saveUser() {
    if (this.editingUser) {
      this.userService
        .update(this.editingUser._id, this.newUser)
        .subscribe(() => {
          this.editingUser = null;
          this.newUser = { email: '', password: '', role: 'normal' };
          this.loadUsers();
          this.showForm = false;
        });
    } else {
      this.userService.create(this.newUser).subscribe(() => {
        this.newUser = { email: '', password: '', role: 'normal' };
        this.loadUsers();
        this.showForm = false;
      });
    }
  }

  delete(user: User) {
    if (confirm(`¿Eliminar a ${user.email}?`)) {
      this.userService.delete(user._id).subscribe(() => this.loadUsers());
    }
  }

  goToCreate() {
    this.router.navigate(['/users/create']);
  }
}
