import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Post } from '../services/backend-api.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent implements AfterViewInit {
  @Input() post: Post | null = null;
  @Input() loading = false;

  @Output() postClosed = new EventEmitter<void>();

  @ViewChild('closeButton')
  private closeButton?: ElementRef<HTMLButtonElement>;

  protected readonly titleId = 'post-dialog-title';
  protected readonly bodyId = 'post-dialog-body';

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      this.closeButton?.nativeElement.focus();
    });
  }

  @HostListener('document:keydown.escape')
  protected handleEscapeKey(): void {
    this.close();
  }

  protected close(): void {
    this.postClosed.emit();
  }
}
