import {AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[highlight]'
})

// implement AfterViewInit to activate the directive when associated element is initialized
export class HighlightDirective implements AfterViewInit {


  @Input() color: string = 'yellow';

  /**
   *
   * @param elementRef: to get the associated HTML element
   * @param renderer: use Renderer2 to modify the element ref
   */
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    this.setBackgroundColor(this.color);
  }


  setBackgroundColor(color: string) {
    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', color);
  }

  setFontStyle(value: string) {
    this.renderer.setStyle(this.elementRef.nativeElement, 'font-style', value);
  }

  /**
   * use @HostListener to react to host HTML events such as: mouse or keyboard events
   */

  @HostListener('mouseover') onMouseOver() {
    this.setBackgroundColor('lightgreen');
    this.setFontStyle('italic');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.setBackgroundColor(this.color);
    this.setFontStyle('');
  }

  @HostListener('click') onClick() {
    this.setBackgroundColor('red');
  }

}
