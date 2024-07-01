import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export type Post = {
  userId: string;
  id: string;
  title: string;
  body: string;
};

@Injectable({
  providedIn: "root",
})
export class BackendApiService {
  private baseUrl: string =
    "https://jsonplaceholder.typicode.com/posts?_page=1";
  constructor(private httpClient: HttpClient) {}

  public getAll(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.baseUrl);
  }
}
