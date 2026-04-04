import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { BackendApiService } from '../services/backend-api.service';
import { getPosts, getPostsFailure, getPostsSuccess } from './posts.actions';
import { LoadError } from './posts.models';

export const normalizeLoadError = (error: unknown): LoadError => {
  const fallbackMessage = 'Unable to load posts right now. Please try again.';

  if (error instanceof HttpErrorResponse) {
    return {
      message:
        typeof error.error?.message === 'string'
          ? error.error.message
          : error.message || fallbackMessage,
      status: error.status || undefined,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: fallbackMessage };
};

@Injectable()
export class PostEffects {
  private actions$ = inject(Actions);
  private backendApiService = inject(BackendApiService);

  public getPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPosts),
      exhaustMap(() =>
        this.backendApiService.getAll().pipe(
          map((posts) => {
            return getPostsSuccess({ posts });
          }),
          catchError((error) => {
            return of(getPostsFailure({ error: normalizeLoadError(error) }));
          }),
        ),
      ),
    ),
  );
}
