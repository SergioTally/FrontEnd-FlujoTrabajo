import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../../services/user.service';
import { MessageDialog } from '../../../components/message-dialog/message-dialog';

@Component({
  selector: 'app-users-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MessageDialog],
  templateUrl: './users-create.html',
  styleUrls: ['./users-create.scss'],
})
export class UsersCreate {
  editingUserId: string | null = null;
  newUser: Partial<User> = { email: '', password: '', role: undefined };

  showMessage = false;
  messageTitle = '';
  messageBody = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingUserId = id;
      this.userService.getById(id).subscribe((user) => {
        this.newUser = {
          email: user.email,
          role: user.role,
        };
        this.cdr.detectChanges();
      });
    }
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
    this.router.navigate(['/users']);
  }

  saveUser() {
    const op = this.editingUserId
      ? this.userService.update(this.editingUserId, this.newUser)
      : this.userService.create(this.newUser);

    op.subscribe({
      next: () => {
        this.showInfo(
          this.editingUserId ? 'Usuario actualizado' : 'Usuario creado',
          this.editingUserId
            ? 'El usuario fue actualizado correctamente.'
            : 'El usuario fue creado correctamente.'
        );
      },
      error: () => {
        this.showInfo('Error', 'No se pudo guardar el usuario.');
      },
    });
  }

  cancelEdit() {
    this.router.navigate(['/users']);
  }
}
