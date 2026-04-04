import { Post } from '../services/backend-api.service';
import { getPosts, getPostsFailure, getPostsSuccess } from './posts.actions';
import { initialState, postsReducer } from './posts.reducer';

describe('postsReducer', () => {
  const posts: Post[] = [
    { userId: 1, id: 1, title: 'first post', body: 'first body' },
    { userId: 2, id: 2, title: 'second post', body: 'second body' },
  ];

  it('sets loading true and clears any previous error when loading posts', () => {
    const previousState = {
      ...initialState,
      error: { message: 'Previous failure', status: 500 },
    };

    const state = postsReducer(previousState, getPosts());

    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('stores all posts through the entity adapter and clears loading', () => {
    const state = postsReducer(
      { ...initialState, loading: true },
      getPostsSuccess({ posts }),
    );

    expect(state.ids).toEqual(['1', '2']);
    expect(state.entities['1']).toEqual(posts[0]);
    expect(state.entities['2']).toEqual(posts[1]);
    expect(state.loading).toBeFalse();
    expect(state.error).toBeNull();
  });

  it('stores the normalized error and clears loading on failure', () => {
    const error = { message: 'Unable to load posts right now.', status: 503 };

    const state = postsReducer(
      { ...initialState, loading: true },
      getPostsFailure({ error }),
    );

    expect(state.loading).toBeFalse();
    expect(state.error).toEqual(error);
  });
});
