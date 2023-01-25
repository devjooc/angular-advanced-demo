import {animate, animation, sequence, style} from '@angular/animations';

export const flashAnimation = animation([
  sequence([
    animate('{{ duration }}', style({ // {{ duration }} is a parameter
      'background-color': 'rgb(108,255,214)'
    })),
    animate('250ms', style({
      'background-color': 'white'
    })),
  ]),
]);

// example how to use this animation
// useAnimation(flashAnimation, {params: {duration: '250ms'}})
