import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { Post } from "../services/backend-api.service";
import { PostState } from "../store/posts.reducer";
import { selectPostById } from "../store/posts.selectors";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-post",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./post.component.html",
  styleUrl: "./post.component.css",
})
export class PostComponent implements OnInit {
  private readonly postStore = inject(Store<PostState>);
  private readonly destroyRef = inject(DestroyRef);
  @Input() postId: string;

  @Output() postClosed = new EventEmitter();

  public post: Post | undefined;

  ngOnInit(): void {
    this.postStore
      .select(selectPostById(this.postId))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((post) => (this.post = post));
  }

  public setNoPost(): void {
    this.post = undefined;
    this.postClosed.emit();
  }
}
