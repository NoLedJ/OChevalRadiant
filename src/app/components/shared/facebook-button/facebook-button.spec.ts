import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookButton } from './facebook-button';

describe('FacebookButton', () => {
  let component: FacebookButton;
  let fixture: ComponentFixture<FacebookButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacebookButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacebookButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
