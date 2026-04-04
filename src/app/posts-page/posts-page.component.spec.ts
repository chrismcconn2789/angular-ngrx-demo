import { convertToParamMap } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject } from 'rxjs';
import { Post } from '../services/backend-api.service';
import { getPosts } from '../store/posts.actions';
import { initialState, PostsState, postsAdapter } from '../store/posts.reducer';
import { PostsPageComponent } from './posts-page.component';

type RootState = {
  posts: PostsState;
};

class ActivatedRouteStub {
  private readonly paramMapSubject = new BehaviorSubject(convertToParamMap({}));
  readonly paramMap = this.paramMapSubject.asObservable();

  setParamMap(params: Record<string, string>): void {
    this.paramMapSubject.next(convertToParamMap(params));
  }
}

describe('PostsPageComponent', () => {
  let fixture: ComponentFixture<PostsPageComponent>;
  let store: MockStore<RootState>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRouteStub;

  const posts: Post[] = [
    { userId: 1, id: 1, title: 'first post', body: 'first body' },
  ];

  const createPostsState = (
    items: Post[] = posts,
    overrides: Partial<PostsState> = {},
  ): PostsState => ({
    ...postsAdapter.setAll(items, initialState),
    ...overrides,
  });

  beforeEach(async () => {
    activatedRoute = new ActivatedRouteStub();
    router = jasmine.createSpyObj<Router>('Router', ['navigate', 'navigateByUrl']);
    router.navigate.and.resolveTo(true);
    router.navigateByUrl.and.resolveTo(true);

    await TestBed.configureTestingModule({
      imports: [PostsPageComponent],
      providers: [
        provideMockStore({
          initialState: {
            posts: createPostsState(),
          },
        }),
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(PostsPageComponent);
  });

  it('renders the loading spinner while posts are being fetched', () => {
    store.setState({
      posts: createPostsState([], { loading: true }),
    });

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('app-loading-spinner'),
    ).not.toBeNull();
  });

  it('renders an error banner and dispatches retry when the user clicks retry', () => {
    store.setState({
      posts: createPostsState([], {
        error: { message: 'Unable to load posts right now.', status: 503 },
      }),
    });

    fixture.detectChanges();

    const retryButton = fixture.nativeElement.querySelector(
      '.secondary-button',
    ) as HTMLButtonElement;

    expect(fixture.nativeElement.textContent).toContain('We could not load posts.');

    retryButton.click();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(getPosts());
  });

  it('clicking a post requests navigation to /posts/:id and the route state opens the dialog', () => {
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '.post-trigger',
    ) as HTMLButtonElement;
    trigger.click();

    expect(router.navigate).toHaveBeenCalledWith(['/posts', 1]);

    activatedRoute.setParamMap({ id: '1' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).not.toBeNull();
  });

  it('pressing Escape closes the dialog and navigates back to /', () => {
    activatedRoute.setParamMap({ id: '1' });
    fixture.detectChanges();

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    fixture.detectChanges();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });
});
