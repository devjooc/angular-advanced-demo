import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Post} from "../models/post.model";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

/**
 *  not provided in root because this service is included in a lazy loading module
 *  to register service => add it in the module providers
 */
@Injectable()
export class PostsService {

  constructor(private http: HttpClient) {
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.apiUrl}/posts`);
  }
}
