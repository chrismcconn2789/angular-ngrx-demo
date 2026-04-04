import { Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { PostsPageComponent } from './posts-page/posts-page.component';

export const postsPageMatcher = (
  segments: UrlSegment[],
): UrlMatchResult | null => {
  if (segments.length === 0) {
    return {
      consumed: [],
      posParams: {},
    };
  }

  if (segments.length === 2 && segments[0].path === 'posts' && segments[1].path) {
    return {
      consumed: segments,
      posParams: {
        id: segments[1],
      },
    };
  }

  return null;
};

export const routes: Routes = [
  {
    matcher: postsPageMatcher,
    component: PostsPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
