import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlipCard } from './flip-card';

describe('FlipCard', () => {
  let component: FlipCard;
  let fixture: ComponentFixture<FlipCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlipCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlipCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('card', {
      id: 1, light_version: 'Résumé', signature: 'Témoin', paragraphs: ['Témoignage complet']
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
