import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Comment} from "../../../core/models/comment.model";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {
  animate,
  animateChild,
  group,
  query,
  stagger,
  state,
  style,
  transition,
  trigger, useAnimation
} from "@angular/animations";
import {flashAnimation} from "../../animations/flash.animation";
import {slideAndFadeAnimation} from "../../animations/slide-and-fade.animation";

@Component({
  selector: 'jooc-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  // animations example => trigger is the name to be used in the template => @myFirstAnimation
  animations: [
    trigger('list', [ // here we trigger child animation 'myFirstAnimation' of parent 'list'  every 50ms
      transition(':enter', [
        query('@myFirstAnimation', [
          stagger(50, [
            animateChild()
          ])
        ])
      ])
    ]),
    trigger('myFirstAnimation', [
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
      // void animation (used to add animation for elements that don't exist yet => new added comments), another syntax :enter
      transition('void => *', [
        query('.comment-text, .comment-date', [ // query is used to select specific elements from the animated item => here: classes
          style({
            opacity: 0
          }),
        ]),
        useAnimation(slideAndFadeAnimation, {params: {duration: '200ms'}}),
        // example to group & sequence
        group([
          useAnimation(flashAnimation, {params: {duration: '250ms'}}),
          query('.comment-text', [
            animate('200ms', style({
              opacity: 1
            }))
          ]),
          query('.comment-date', [
            animate('500ms', style({
              opacity: 1
            }))
          ])
        ])
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
