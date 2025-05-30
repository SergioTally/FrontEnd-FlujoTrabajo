import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgIf, NgForOf } from '@angular/common';
import { UserService, User } from '../../services/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { MessageDialog } from '../../components/message-dialog/message-dialog';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgForOf,
    RouterModule,
    ConfirmDialog,
    MessageDialog,
  ],
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
})
export class Users {
  users: User[] = [];
  newUser: Partial<User> = { email: '', password: '', role: 'normal' };
  editingUser: User | null = null;
  showForm = false;
  selectedUserToDelete: User | null = null;
  showConfirmDialog = false;
  showMessage = false;
  messageTitle = '';
  messageBody = '';

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

  cancelDialog() {
    this.selectedUserToDelete = null;
    this.showConfirmDialog = false;
  }

  showInfo(title: string, message: string) {
    this.messageTitle = title;
    this.messageBody = message;
    this.showMessage = true;
    this.cdr.detectChanges();
  }

  handleCloseDialog() {
    this.showMessage = false;
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showInfo('Error', 'Error al cargar los usuarios.');
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

  goToEdit(user: User) {
    this.router.navigate(['/users/edit', user._id]);
  }

  askDelete(user: User) {
    this.selectedUserToDelete = user;
    this.showConfirmDialog = true;
  }

  confirmDelete() {
    if (!this.selectedUserToDelete) return;

    this.userService.delete(this.selectedUserToDelete._id).subscribe({
      next: () => {
        this.loadUsers();
        this.cancelDialog();
        this.showInfo('Éxito', 'Usuario eliminado correctamente.');
      },
      error: () => {
        this.cancelDialog();
        this.showInfo('Error', 'No se pudo eliminar el usuario.');
      },
    });
  }
}
