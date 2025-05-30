import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskService, Task } from '../../../services/tasks.service';
import { UserService, User } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { MessageDialog } from '../../../components/message-dialog/message-dialog';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-tasks-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MessageDialog],
  templateUrl: './tasks-create.html',
  styleUrls: ['./tasks-create.scss'],
})
export class TasksCreate {
  taskId: string | null = null;
  newTask: Partial<Task> = { title: '', description: '', status: 'Pendiente' };
  users: User[] = [];
  isAdmin = false;
  showMessage = false;
  messageTitle = '';
  messageBody = '';

  showInfo(title: string, message: string) {
    this.messageTitle = title;
    this.messageBody = message;
    this.showMessage = true;
    this.cdr.detectChanges();
  }

  handleCloseDialog() {
    this.showMessage = false;
    this.router.navigate(['/tasks']);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private userService: UserService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.getRoleFromToken() === 'admin';

    if (this.isAdmin) {
      this.userService.getAll().subscribe((users) => (this.users = users));
    }

    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.taskService.getById(this.taskId).subscribe((task) => {
        this.newTask = {
          title: task.title,
          description: task.description,
          status: task.status,
          assignedTo: task.assignedTo,
        };
        this.cdr.detectChanges();
      });
    }
  }

  saveTask() {
    const op = this.taskId
      ? this.taskService.update(this.taskId, this.newTask)
      : this.taskService.create(this.newTask);

    const mensaje = this.taskId
      ? {
          title: 'Actualizado',
          body: 'La tarea fue actualizada correctamente.',
        }
      : { title: 'Creado', body: 'La tarea fue creada correctamente.' };

    op.subscribe({
      next: () => {
        this.showInfo(mensaje.title, mensaje.body);
      },
      error: () => {
        this.showInfo(mensaje.title, mensaje.body);
      },
    });
  }

  cancel() {
    this.router.navigate(['/tasks']);
  }
}
