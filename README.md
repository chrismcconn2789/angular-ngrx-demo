# Angular NgRx Demo

This project is a small Angular 18 standalone application that demonstrates:

- Fetching posts from an external API
- Managing async state with NgRx store and effects
- Using an entity-backed feature slice for posts
- Opening post details as a route-driven modal at `/posts/:id`

## Commands

- `npm start` runs the development server on `http://localhost:4200/`
- `npm run build` creates a production build in `dist/angular-ngrx`
- `npm test` runs the Karma/Jasmine test suite

## Architecture

- `src/app/app.config.ts` wires Angular providers, NgRx store/effects, router, HTTP, and development-only store devtools.
- `src/app/posts-page/` contains the main routed page shell that loads posts, shows loading and error states, and controls the route-driven modal.
- `src/app/store/` contains the posts feature actions, reducer, selectors, effects, and error model.
- `src/app/post/` contains the accessible dialog component for the selected post.
- `src/app/services/backend-api.service.ts` reads its base URL from the environment config.

## Routing

- `/` shows the list of posts.
- `/posts/:id` keeps the list visible in the background and opens the selected post in a modal overlay.

Reloading `/posts/:id` preserves the selected-post route and opens the same modal after the posts data finishes loading.
