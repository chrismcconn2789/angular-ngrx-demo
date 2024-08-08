import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PostState } from './posts.reducer';

export const postsSelectors = createFeatureSelector<PostState>('posts');

export const selectPosts = createSelector(
  postsSelectors,
  (state) => state.posts
);

export const selectPostById = (id: string) =>
  createSelector(postsSelectors, (state) =>
    state.posts.find((post) => post.id === id)
  );

export const loading = createSelector(postsSelectors, (state) => state.loading);
