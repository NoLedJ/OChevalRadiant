import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinitionCard } from './definition-card';

describe('DefinitionCard', () => {
  let component: DefinitionCard;
  let fixture: ComponentFixture<DefinitionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefinitionCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefinitionCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('card', {
      id: 1, nom: 'Lien social', info: 'Une séance adaptée.', icon_url: '/icons/users.png'
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
