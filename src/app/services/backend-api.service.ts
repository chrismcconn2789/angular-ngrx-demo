import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

@Injectable({
  providedIn: 'root',
})
export class BackendApiService {
  private readonly postsUrl = `${environment.apiBaseUrl}/posts`;
  private readonly httpClient = inject(HttpClient);

  public getAll(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.postsUrl);
  }
}
