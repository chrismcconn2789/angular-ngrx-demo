import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';
import { AngularLogoComponent } from '../components/angular-logo/angular-logo.component';
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component';
import { PostComponent } from '../post/post.component';
import { Post } from '../services/backend-api.service';
import { getPosts } from '../store/posts.actions';
import {
  selectPostById,
  selectPosts,
  selectPostsError,
  selectPostsLoading,
} from '../store/posts.selectors';

@Component({
  selector: 'app-posts-page',
  standalone: true,
  imports: [
    CommonModule,
    AngularLogoComponent,
    LoadingSpinnerComponent,
    PostComponent,
  ],
  templateUrl: './posts-page.component.html',
  styleUrl: './posts-page.component.css',
})
export class PostsPageComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  private lastTriggerElement: HTMLElement | null = null;

  protected readonly posts$ = this.store.select(selectPosts);
  protected readonly loading$ = this.store.select(selectPostsLoading);
  protected readonly error$ = this.store.select(selectPostsError);
  protected readonly activePostId$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    distinctUntilChanged(),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  protected readonly activePost$ = this.activePostId$.pipe(
    switchMap((id) => (id ? this.store.select(selectPostById(id)) : of(undefined))),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  protected readonly viewModel$ = combineLatest({
    posts: this.posts$,
    loading: this.loading$,
    error: this.error$,
    activePostId: this.activePostId$,
    activePost: this.activePost$,
  });

  ngOnInit(): void {
    this.loadPosts();
  }

  protected retryLoad(): void {
    this.loadPosts();
  }

  protected openPost(postId: number, event: Event): void {
    if (event.currentTarget instanceof HTMLElement) {
      this.lastTriggerElement = event.currentTarget;
    }

    void this.router.navigate(['/posts', postId]);
  }

  protected closePost(): void {
    void this.router.navigateByUrl('/').then(() => {
      queueMicrotask(() => {
        if (this.lastTriggerElement && this.document.contains(this.lastTriggerElement)) {
          this.lastTriggerElement.focus();
          return;
        }

        this.document.getElementById('page-title')?.focus();
      });
    });
  }

  protected trackByPostId(_index: number, post: Post): number {
    return post.id;
  }

  private loadPosts(): void {
    this.store.dispatch(getPosts());
  }
}
