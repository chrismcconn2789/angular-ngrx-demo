import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type Post = {
  userId: string;
  id: string;
  title: string;
  body: string;
};

@Injectable({
  providedIn: 'root',
})
export class BackendApiService {
  private readonly postsUrl = 'https://jsonplaceholder.typicode.com/posts';
  private readonly httpClient = inject(HttpClient);

  public getAll(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.postsUrl);
  }
}
