import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalCard } from './proposal-card';

describe('ProposalCard', () => {
  let component: ProposalCard;
  let fixture: ComponentFixture<ProposalCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProposalCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('card', {
      id: 1, nom: 'Accompagnement', info1: 'Une séance adaptée.'
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
