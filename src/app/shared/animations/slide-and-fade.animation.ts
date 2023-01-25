import {animate, animation, style} from '@angular/animations';

export const slideAndFadeAnimation = animation([
  style({
    transform: 'translateX(-100%)',
    opacity: 0,
    'background-color': 'rgb(251,88,92)',
  }),
  animate('{{ duration }} ease-out', style({
    transform: 'translateX(0)',
    opacity: 1,
    'background-color': 'white',
  })),
]);

// example how to use this animation
// useAnimation(slideAndFadeAnimation, {params: {duration: '200ms'}})
