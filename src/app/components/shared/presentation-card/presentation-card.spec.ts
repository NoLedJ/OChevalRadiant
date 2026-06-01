import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationCard } from './presentation-card';

describe('PresentationCard', () => {
  let component: PresentationCard;
  let fixture: ComponentFixture<PresentationCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresentationCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresentationCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
