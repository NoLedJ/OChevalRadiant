import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpMenu } from './pop-up-menu';

describe('PopUpMenu', () => {
  let component: PopUpMenu;
  let fixture: ComponentFixture<PopUpMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
