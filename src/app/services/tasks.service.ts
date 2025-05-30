import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Task {
  _id: string;
  title: string;
  description: string;
  assignedTo?: string;
  status: 'Pendiente' | 'En proceso' | 'Terminada';
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Task[]>(this.apiUrl);
  }

  create(task: Partial<Task>) {
    return this.http.post<Task>(this.apiUrl, task);
  }

  update(id: string, task: Partial<Task>) {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getById(id: string) {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }
}
