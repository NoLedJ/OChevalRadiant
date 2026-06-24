import { Directive, ElementRef, input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[animateOnVisible]'
})
export class AnimateOnVisibleDirective implements OnInit, OnDestroy {

  animateOnVisible = input<string>('visible');

  private observer?: IntersectionObserver;

  constructor(private readonly el: ElementRef) {}

  ngOnInit() {
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.el.nativeElement.classList.add(this.animateOnVisible());
            this.observer?.unobserve(this.el.nativeElement);
          }
        });
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

}
