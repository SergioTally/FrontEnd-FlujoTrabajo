import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TaskService, Task } from '../../services/tasks.service';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.scss'],
})
export class Tasks {
  tasks: Task[] = [];

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

  delete(task: Task) {
    if (confirm(`¿Eliminar tarea "${task.title}"?`)) {
      this.taskService.delete(task._id).subscribe(() => this.loadTasks());
    }
  }
}
