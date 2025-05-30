import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskService, Task } from '../../../services/tasks.service';
import { UserService, User } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-tasks-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tasks-create.html',
  styleUrls: ['./tasks-create.scss'],
})
export class TasksCreate {
  taskId: string | null = null;
  newTask: Partial<Task> = { title: '', description: '', status: 'Pendiente' };
  users: User[] = [];
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private userService: UserService,
    private authService: AuthService
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
      });
    }
  }

  saveTask() {
    const op = this.taskId
      ? this.taskService.update(this.taskId, this.newTask)
      : this.taskService.create(this.newTask);

    op.subscribe(() => this.router.navigate(['/tasks']));
  }

  cancel() {
    this.router.navigate(['/tasks']);
  }
}
