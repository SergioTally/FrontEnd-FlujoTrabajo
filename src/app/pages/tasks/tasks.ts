import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TaskService, Task } from '../../services/tasks.service';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { MessageDialog } from '../../components/message-dialog/message-dialog';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialog, MessageDialog],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.scss'],
})
export class Tasks {
  tasks: Task[] = [];
  selectedTaskToDelete: Task | null = null;
  showConfirmDialog = false;
  showMessage = false;
  messageTitle = '';
  messageBody = '';
  showInfo(title: string, message: string) {
    this.messageTitle = title;
    this.messageBody = message;
    this.showMessage = true;
  }

  constructor(
    private taskService: TaskService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if ((event as NavigationEnd).urlAfterRedirects === '/tasks') {
          this.loadTasks();
        }
      });
  }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAll().subscribe({
      next: (data) => {
        this.tasks = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar tareas:', err),
    });
  }

  goToCreate() {
    this.router.navigate(['/tasks/create']);
  }

  edit(task: Task) {
    this.router.navigate(['/tasks/edit', task._id]);
  }

  askDelete(task: Task) {
    this.selectedTaskToDelete = task;
    this.showConfirmDialog = true;
  }

  confirmDelete() {
    if (!this.selectedTaskToDelete) return;

    this.taskService.delete(this.selectedTaskToDelete._id).subscribe({
      next: () => {
        this.loadTasks();
        this.showInfo('Éxito', 'La tarea fue eliminada correctamente');
        this.cancelDialog();
      },
      error: () => {
        this.showInfo('Error', 'Ocurrió un error al eliminar la tarea');
        this.cancelDialog();
      },
    });
  }

  cancelDialog() {
    this.selectedTaskToDelete = null;
    this.showConfirmDialog = false;
  }
}
