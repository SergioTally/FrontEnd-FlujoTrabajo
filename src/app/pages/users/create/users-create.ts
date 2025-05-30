import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../../services/user.service';

@Component({
  selector: 'app-users-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './users-create.html',
  styleUrls: ['./users-create.scss'],
})
export class UsersCreate {
  newUser: Partial<User> = { email: '', password: '', role: undefined };
  editingUserId: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
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
      });
    }
  }

  saveUser() {
    if (this.editingUserId) {
      this.userService
        .update(this.editingUserId, this.newUser)
        .subscribe(() => {
          this.router.navigate(['/users']);
        });
    } else {
      this.userService.create(this.newUser).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
  }

  cancelEdit() {
    this.router.navigate(['/users']);
  }
}
