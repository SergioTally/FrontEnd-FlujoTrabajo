import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  email = '';
  password = '';
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          this.authService.saveToken(res.access_token);
          const role = this.authService.getRoleFromToken();
          if (role === 'admin') {
            this.router.navigate(['/users']);
          } else {
            this.router.navigate(['/tasks']);
          }
        },
        error: () => {
          alert('Credenciales inválidas');
        },
      });
  }
}
