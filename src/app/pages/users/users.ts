import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
})
export class Users {
  users: User[] = [];
  newUser: Partial<User> = { email: '', password: '', role: 'normal' };
  editingUser: User | null = null;

  constructor(private userService: UserService) {}

  showForm = false;

  toggleForm() {
    this.showForm = !this.showForm;
  }

  edit(user: User) {
    this.editingUser = user;
    this.newUser = { email: user.email, role: user.role };
    this.showForm = true;
  }

  cancelEdit() {
    this.editingUser = null;
    this.newUser = { email: '', role: 'normal' };
    this.showForm = false;
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    console.log('Llamando a loadUsers...');

    this.userService.getAll().subscribe({
      next: (data) => {
        console.log('Usuarios recibidos:', data);
        this.users = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      },
    });
  }

  saveUser() {
    if (this.editingUser) {
      this.userService
        .update(this.editingUser._id, this.newUser)
        .subscribe(() => {
          this.editingUser = null;
          this.newUser = { email: '', role: 'normal' };
          this.loadUsers();
        });
    } else {
      this.userService.create(this.newUser).subscribe(() => {
        this.newUser = { email: '', role: 'normal' };
        this.loadUsers();
      });
    }
  }

  delete(user: User) {
    if (confirm(`¿Eliminar a ${user.email}?`)) {
      this.userService.delete(user._id).subscribe(() => this.loadUsers());
    }
  }
}
