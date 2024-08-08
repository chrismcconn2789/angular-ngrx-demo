import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { PostComponent } from './post/post.component';
import { Post } from './services/backend-api.service';
import { getPosts } from './store/posts.actions';
import { PostState } from './store/posts.reducer';
import { loading, selectPostById, selectPosts } from './store/posts.selectors';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PostComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  protected readonly postStore = inject(Store<PostState>);
  protected readonly posts$ = this.postStore.select(selectPosts);
  protected readonly loading$ = this.postStore.select(loading);
  protected activePost$ = new Observable<Post | undefined>();

  ngOnInit(): void {
    this.postStore.dispatch(getPosts());
  }

  public showPost(id: string) {
    this.activePost$ = this.postStore.select(selectPostById(id));
  }

  public postClosed(): void {
    this.activePost$ = of(undefined);
  }
}
