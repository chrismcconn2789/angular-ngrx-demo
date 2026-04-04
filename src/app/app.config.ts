import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { PostEffects } from './store/posts.effects';
import { postsReducer } from './store/posts.reducer';


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
    provideHttpClient(withFetch()),
    ...(!environment.production ? [provideStoreDevtools({ maxAge: 25 })] : []),
  ],
};
