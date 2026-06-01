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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
