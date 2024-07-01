import { createReducer, on } from "@ngrx/store";
import type { Post } from "../services/backend-api.service";
import { getPosts, getPostsFailure, getPostsSuccess } from "./posts.actions";

export type PostState = {
  posts: Post[];
  error: string;
  loading: boolean;
};

export const initialState: PostState = {
  error: "",
  posts: [],
  loading: false,
};

export const postsReducer = createReducer(
  initialState,
  on(
    getPosts,
    (state) =>
      (state = {
        ...state,
        loading: true,
      }),
  ),
  on(
    getPostsSuccess,
    (state, action) =>
      (state = {
        ...state,
        posts: action.posts,
        loading: false,
      }),
  ),
  on(
    getPostsFailure,
    (state, action) =>
      (state = {
        ...state,
        error: action.error,
        loading: false,
      }),
  ),
);
