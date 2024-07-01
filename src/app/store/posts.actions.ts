import { createAction, props } from '@ngrx/store';
import type { Post } from '../services/backend-api.service';

export const getPosts = createAction('[Posts] Get Posts');

export const getPostsSuccess = createAction(
  '[Posts] Get Posts Success',
  props<{ posts: Post[] }>()
);

export const getPostsFailure = createAction(
  '[Posts] Get Posts Failure',
  props<{ error: string }>()
);
