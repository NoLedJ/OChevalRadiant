import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { SafeHtmlPipe } from './safe-html-pipe';

describe('SafeHtmlPipe', () => {
  it('should preserve trusted editorial markup', () => {
    const sanitizer = TestBed.inject(DomSanitizer);
    const pipe = new SafeHtmlPipe(sanitizer);
    const markup = '<strong>Ô Cheval Radiant</strong>';
    expect(sanitizer.sanitize(SecurityContext.HTML, pipe.transform(markup))).toBe(markup);
  });
});
