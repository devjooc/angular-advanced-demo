import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Post} from "../../models/post.model";
import {ActivatedRoute} from "@angular/router";
import {map} from "rxjs/operators";

@Component({
  selector: 'jooc-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  posts$!: Observable<Post[]>;

  constructor(private route: ActivatedRoute) {
  }

  /**
   * this component has a resolver => use ActivatedRoute to get data from it.
   * data name (here is 'posts') is the param specified for the resolver in the routing module
   */
  ngOnInit(): void {
    this.posts$ = this.route.data.pipe(
      map(data => data['posts'])
    )
  }


}
