import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens and closes the same menu with native HTML controls', () => {
    const element = fixture.nativeElement as HTMLElement;
    const menu = element.querySelector('#site-navigation') as HTMLElement;
    (element.querySelector('.menu-button') as HTMLButtonElement).click();
    expect(menu.matches(':popover-open')).toBeTrue();
    (element.querySelector('.close') as HTMLButtonElement).click();
    expect(menu.matches(':popover-open')).toBeFalse();
    (element.querySelector('.menu-button') as HTMLButtonElement).click();
    (element.querySelector('.modal') as HTMLButtonElement).click();
    expect(menu.matches(':popover-open')).toBeFalse();
  });
});
