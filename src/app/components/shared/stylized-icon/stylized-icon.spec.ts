import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StylizedIcon } from './stylized-icon';

describe('StylizedIcon', () => {
  let component: StylizedIcon;
  let fixture: ComponentFixture<StylizedIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StylizedIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StylizedIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
