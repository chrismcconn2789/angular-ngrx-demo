import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, of } from "rxjs";
import { BackendApiService } from "../services/backend-api.service";
import { getPosts, getPostsFailure, getPostsSuccess } from "./posts.actions";

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
            return of(getPostsFailure({ error }));
          }),
        ),
      ),
    ),
  );
}
