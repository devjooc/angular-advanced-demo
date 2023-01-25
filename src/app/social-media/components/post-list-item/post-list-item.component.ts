import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Post} from "../../models/post.model";

@Component({
  selector: 'jooc-post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.scss']
})
export class PostListItemComponent {

  @Input() post!: Post;

  @Output()
  postCommented = new EventEmitter<{ comment: string, postId: number }>();

  // to test a pipe
  tempUser = {firstName: 'Angular', lastName: 'user'};

  onNewComment(newComment: string) {
    console.log('PostListItemComponent got a new comment: ', newComment);
    this.postCommented.emit({comment: newComment, postId: this.post.id});
  }
}
