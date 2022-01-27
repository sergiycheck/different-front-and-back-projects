import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  @Input() appHighlight!: number;

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter(): void {
    this.highlight(this.appHighlight);
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.highlight(1);
  }

  private highlight(value: number): void {
    this.el.nativeElement.style.transform = `scale(${value})`;
  }
}
