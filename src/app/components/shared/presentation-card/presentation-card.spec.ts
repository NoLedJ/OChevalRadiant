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
    fixture.componentRef.setInput('card', {
      id: 1, nom: 'Équipe', info: 'Présentation', photo_url: '/images/logo/logo.jpg'
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
