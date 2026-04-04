import { Post } from '../services/backend-api.service';
import {
  selectPostById,
  selectPosts,
  selectPostsError,
  selectPostsLoading,
} from './posts.selectors';
import { initialState, postsAdapter } from './posts.reducer';

describe('postsSelectors', () => {
  const posts: Post[] = [
    { userId: 1, id: 1, title: 'first post', body: 'first body' },
    { userId: 2, id: 2, title: 'second post', body: 'second body' },
  ];

  const postsState = postsAdapter.setAll(posts, {
    ...initialState,
    loading: false,
    error: null,
  });

  const rootState = {
    posts: postsState,
  };

  it('returns all posts in adapter order', () => {
    expect(selectPosts(rootState)).toEqual(posts);
  });

  it('returns the selected post when the id exists', () => {
    expect(selectPostById('2')(rootState)).toEqual(posts[1]);
  });

  it('returns undefined when the id does not exist', () => {
    expect(selectPostById('99')(rootState)).toBeUndefined();
  });

  it('returns the loading flag and error state', () => {
    expect(selectPostsLoading(rootState)).toBeFalse();
    expect(selectPostsError(rootState)).toBeNull();
  });
});
