import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PostsState, postsAdapter } from './posts.reducer';

export const selectPostsState = createFeatureSelector<PostsState>('posts');
const { selectAll, selectEntities } = postsAdapter.getSelectors(selectPostsState);

export const selectAllPosts = selectAll;
export const selectPosts = selectAllPosts;
export const selectPostEntities = selectEntities;

export const selectPostById = (id: string) =>
  createSelector(selectPostEntities, (entities) => entities[id]);

export const selectPostsLoading = createSelector(
  selectPostsState,
  (state) => state.loading,
);

export const selectPostsError = createSelector(
  selectPostsState,
  (state) => state.error,
);
