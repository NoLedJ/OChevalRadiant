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
});
