import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface User {
  _id: string;
  email: string;
  password: string;
  role: 'admin' | 'normal';
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<User[]>(this.apiUrl);
  }

  create(user: Partial<User>) {
    return this.http.post<User>(this.apiUrl, user);
  }

  update(id: string, user: Partial<User>) {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
