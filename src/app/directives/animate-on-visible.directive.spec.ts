import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AnimateOnVisibleDirective } from './animate-on-visible.directive';

describe('Directive: AnimateOnVisible', () => {
  it('should create an instance', () => {
    const directive = TestBed.runInInjectionContext(
      () => new AnimateOnVisibleDirective(new ElementRef(document.createElement('div')))
    );
    expect(directive).toBeTruthy();
  });
});
