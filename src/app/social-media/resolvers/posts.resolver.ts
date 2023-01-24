import {Injectable} from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable} from 'rxjs';
import {Post} from "../models/post.model";
import {PostsService} from "../services/posts.service";

@Injectable() // don't inject in root => it's a lazy module => use providers in module
export class PostsResolver implements Resolve<Post[]> {

  constructor(private postService: PostsService) {
  }

  /**
   * resolvers needs to be registered to a router => see module.routing
   * @param route
   * @param state
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Post[]> {
    return this.postService.getPosts();
  }
}
