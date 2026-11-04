import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarItems } from './navbar-items';

describe('NavbarItems', () => {
  let component: NavbarItems;
  let fixture: ComponentFixture<NavbarItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarItems],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('explicitly includes all ten mobile links in keyboard navigation', () => {
    fixture.componentRef.setInput('popUpMenu', true);
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    expect(links.length).toBe(10);
    links.forEach(link => expect(link.getAttribute('tabindex')).toBe('0'));
  });

  it('keeps the browser default keyboard behavior for desktop links', () => {
    const links = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    links.forEach(link => expect(link.hasAttribute('tabindex')).toBeFalse());
  });
});
