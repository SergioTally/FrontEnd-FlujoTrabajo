import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-dialog.html',
  styleUrls: ['./message-dialog.scss'],
})
export class MessageDialog {
  @Input() title: string = 'Mensaje';
  @Input() message: string = '';
  @Input() buttonText: string = 'Entendido';
  @Output() close = new EventEmitter<void>();
}
