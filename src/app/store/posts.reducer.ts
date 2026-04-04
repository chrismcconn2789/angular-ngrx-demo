import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import type { Post } from '../services/backend-api.service';
import { getPosts, getPostsFailure, getPostsSuccess } from './posts.actions';
import type { LoadError } from './posts.models';

export type PostsState = EntityState<Post> & {
  error: LoadError | null;
  loading: boolean;
};

export const postsAdapter = createEntityAdapter<Post>({
  selectId: (post) => post.id.toString(),
});

export const initialState: PostsState = postsAdapter.getInitialState({
  error: null,
  loading: false,
});

export const postsReducer = createReducer(
  initialState,
  on(
    getPosts,
    (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),
  on(
    getPostsSuccess,
    (state, action) =>
      postsAdapter.setAll(action.posts, {
        ...state,
        loading: false,
        error: null,
      }),
  ),
  on(
    getPostsFailure,
    (state, action) => ({
      ...state,
      error: action.error,
      loading: false,
    }),
  ),
);
