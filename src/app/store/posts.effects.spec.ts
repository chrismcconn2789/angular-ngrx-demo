import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Post } from '../services/backend-api.service';
import { BackendApiService } from '../services/backend-api.service';
import { getPosts, getPostsFailure, getPostsSuccess } from './posts.actions';
import { PostEffects } from './posts.effects';

describe('PostEffects', () => {
  let actions$: Observable<unknown>;
  let effects: PostEffects;
  let backendApiService: jasmine.SpyObj<BackendApiService>;

  const posts: Post[] = [
    { userId: 1, id: 1, title: 'first post', body: 'first body' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PostEffects,
        provideMockActions(() => actions$),
        {
          provide: BackendApiService,
          useValue: jasmine.createSpyObj<BackendApiService>('BackendApiService', [
            'getAll',
          ]),
        },
      ],
    });

    effects = TestBed.inject(PostEffects);
    backendApiService = TestBed.inject(
      BackendApiService,
    ) as jasmine.SpyObj<BackendApiService>;
  });

  it('dispatches getPostsSuccess when the API call succeeds', (done) => {
    backendApiService.getAll.and.returnValue(of(posts));
    actions$ = of(getPosts());

    effects.getPosts$.subscribe((action) => {
      expect(action).toEqual(getPostsSuccess({ posts }));
      done();
    });
  });

  it('dispatches getPostsFailure with a normalized LoadError when the API call fails', (done) => {
    backendApiService.getAll.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 503,
            statusText: 'Service Unavailable',
          }),
      ),
    );
    actions$ = of(getPosts());

    effects.getPosts$.subscribe((action) => {
      expect(action).toEqual(
        getPostsFailure({
          error: {
            message: 'Http failure response for (unknown url): 503 Service Unavailable',
            status: 503,
          },
        }),
      );
      done();
    });
  });
});
