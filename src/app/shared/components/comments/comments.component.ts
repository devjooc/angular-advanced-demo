import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Comment} from "../../../core/models/comment.model";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'jooc-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  // animations example => trigger is the name to be used in the template => @myFirstAnimation
  animations: [trigger('myFirstAnimation', [
    state('default', style({
      transform: 'scale(1)',
      'background-color': 'white',
      'z-index': 1
    })),
    state('active', style({
      transform: 'scale(1.05)',
      'background-color': 'rgb(242,200,165)',
      'z-index': 2
    })),
    // define transition from one state to another
    transition('default => active', [
      animate('200ms ease-in-out')
    ]),
    transition('active => default', [
      animate('200ms ease-in-out')
    ]),
    // void animation (used to add animation for elements that don't exist yet => new added comments)
    transition('void => *', [
      style({
        transform: 'translateX(-100%)',
        opacity: 0,
        'background-color': 'red'
      }),
      animate('200ms ease-out', style({
        transform: 'translateX(0)',
        opacity: 1,
        'background-color': 'white'
      }))
    ])
  ])]
})
export class CommentsComponent implements OnInit {

  @Input() comments!: Comment[];

  // event emitter
  @Output('onNewComment')
  eventEmitter: EventEmitter<string> = new EventEmitter<string>();

  //form control
  commentCtrl!: FormControl;

  // animation state (corresponds to animations state above)
  myAnimationState: 'default' | 'active' = 'default';
  // 2nd example (to animate a single comment) => it's a map to handle comment index with the state)
  animationStates: { [key: number]: 'default' | 'active' } = {};

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.commentCtrl = this.formBuilder.control('', [Validators.required, Validators.minLength(10)]);
    // init animationStates (all comments will have 'default' state)
    for (let index in this.comments) {
      this.animationStates[index] = 'default';
    }
  }

  /**
   * on enter a new comment => emit event to parent
   */
  onLeaveComment() {
    if (this.commentCtrl.invalid) {
      return;
    }
    // simply add new comment to comments array (no interaction with sever)
    this.comments.unshift({
      id: Math.random(),
      comment: this.commentCtrl.value,
      createdDate: new Date().toISOString(),
      userId: 1
    });
    // emit event
    this.eventEmitter.emit(this.commentCtrl.value);
    this.commentCtrl.reset();
  }

  /**
   * on mouse enter => change state of corresponding item to 'active'
   */
  onListItemMouseEnter(index: number) {
    // this.myAnimationState = 'active';
    this.animationStates[index] = 'active';
  }

  /**
   * on mouse enter => change state of corresponding item to 'default'
   */
  onListItemMouseLeave(index: number) {
    // this.myAnimationState = 'default';
    this.animationStates[index] = 'default';
  }
}
