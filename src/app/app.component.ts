import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { PostComponent } from './post/post.component';
import { Post } from './services/backend-api.service';
import { getPosts } from './store/posts.actions';
import { PostState } from './store/posts.reducer';
import { loading, selectPosts } from './store/posts.selectors';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PostComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly postStore = inject(Store<PostState>);
  public posts: Post[];
  public loading: boolean;
  public activePost: string | undefined;

  ngOnInit(): void {
    this.postStore.dispatch(getPosts());

    this.postStore
      .select(selectPosts)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((posts) => (this.posts = posts));

    this.postStore
      .select(loading)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((loading) => (this.loading = loading));
  }

  public showPost(id: string) {
    this.activePost = id;
  }

  public postClosed(): void {
    this.activePost = undefined;
  }
}
