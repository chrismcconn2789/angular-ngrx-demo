import {
  ApplicationConfig,
  ImportProvidersSource,
  importProvidersFrom,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { StoreModule } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { routes } from "./app.routes";

import { provideHttpClient, withFetch } from "@angular/common/http";
import { EffectsModule } from "@ngrx/effects";
import { PostEffects } from "./store/posts.effects";
import { postsReducer } from "./store/posts.reducer";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      StoreModule.forRoot({}),
      StoreModule.forFeature("posts", postsReducer),
      EffectsModule.forRoot(),
      EffectsModule.forFeature(PostEffects),
    ),
    provideStoreDevtools({ maxAge: 25 }),
    provideHttpClient(withFetch()),
  ],
};
