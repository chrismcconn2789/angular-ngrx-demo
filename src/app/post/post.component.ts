import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Post } from '../services/backend-api.service';
import { PostState } from '../store/posts.reducer';
import { selectPostById } from '../store/posts.selectors';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent implements OnInit {
  protected readonly postStore = inject(Store<PostState>);
  protected post$ = new Observable<Post | undefined>();

  @Input() postId: string | undefined;

  @Output() postClosed = new EventEmitter();

  ngOnInit(): void {
    if (this.postId) {
      this.post$ = this.postStore.select(selectPostById(this.postId));
    }
  }

  public setNoPost(): void {
    this.post$ = of(undefined);
    this.postClosed.emit();
  }
}
