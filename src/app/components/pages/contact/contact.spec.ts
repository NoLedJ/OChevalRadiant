import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Contact } from './contact';

@Component({ template: '' })
class OtherPage {}

const originalMapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4301.12967233051!2d3.7314095827493023!3d50.13369488196895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c2630039f7b9e7%3A0xf4936306271fb5e4!2s%C3%94%20Cheval%20Radiant!5e0!3m2!1sfr!2sfr!4v1780377343467!5m2!1sfr!2sfr';

describe('Contact', () => {
  let component: Contact;
  let fixture: ComponentFixture<Contact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contact],
      providers: [provideRouter([
        { path: 'contact', component: Contact },
        { path: 'autre', component: OtherPage },
      ])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Contact);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function toggleMap() {
    fixture.nativeElement.querySelector('button.map-toggle').click();
    fixture.detectChanges();
  }

  it('shows a local image, contact details and privacy information without an iframe', () => {
    expect(component.mapVisible()).toBeFalse();
    expect(fixture.nativeElement.querySelector('iframe')).toBeNull();
    expect(fixture.nativeElement.querySelector('.map-stage img').getAttribute('src'))
      .toBe('/images/contact-location.svg');
    expect(fixture.nativeElement.textContent).toContain('1 Chemin de la Rosière');
    expect(fixture.nativeElement.querySelector('#map-privacy').textContent)
      .toContain('Certaines données, comme votre adresse IP, peuvent être transmises à Google.');
    expect(fixture.nativeElement.querySelector('a[href="/politique-confidentialite"]')).toBeTruthy();
  });

  it('creates the original accessible interactive iframe only on activation', () => {
    toggleMap();
    const iframe: HTMLIFrameElement = fixture.nativeElement.querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe.getAttribute('src')).toBe(originalMapUrl);
    expect(iframe.title).toBe(component.contact_text.map_section.iframe_title);
    expect(iframe.height).toBe('350');
    expect(iframe.hasAttribute('allowfullscreen')).toBeTrue();
    expect(iframe.loading).toBe('eager');
    expect(fixture.nativeElement.querySelector('.map-stage img')).toBeNull();
    expect(fixture.nativeElement.querySelector('button').textContent.trim()).toBe('Masquer la carte');
  });

  it('destroys the iframe and restores the local image when hidden', () => {
    toggleMap();
    const iframe: HTMLIFrameElement = fixture.nativeElement.querySelector('iframe');
    toggleMap();
    expect(iframe.isConnected).toBeFalse();
    expect(fixture.nativeElement.querySelector('iframe')).toBeNull();
    expect(fixture.nativeElement.querySelector('.map-stage img')).toBeTruthy();
    expect(component.mapVisible()).toBeFalse();
  });

  it('keeps the same native button and exposes its expanded state', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.map-toggle');
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-describedby')).toBe('map-privacy');
    expect(button.getAttribute('aria-controls')).toBe('contact-map');
    toggleMap();
    expect(fixture.nativeElement.querySelector('.map-toggle')).toBe(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('offers one activation control for both the preview and its visible label', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.map-widget button');
    expect(buttons.length).toBe(1);
    expect(fixture.nativeElement.querySelector('.map-stage [tabindex]')).toBeNull();
    const label: HTMLSpanElement = buttons[0].querySelector('.map-toggle-label');
    expect(label.textContent!.trim()).toBe('Afficher la carte');
    label.click();
    fixture.detectChanges();
    expect(component.mapVisible()).toBeTrue();
    expect(fixture.nativeElement.querySelector('iframe')).toBeTruthy();
    label.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('iframe')).toBeNull();
  });

  it('resets the choice on a new component instance', () => {
    toggleMap();
    fixture.destroy();
    fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();
    expect(fixture.componentInstance.mapVisible()).toBeFalse();
    expect(fixture.nativeElement.querySelector('iframe')).toBeNull();
  });

  it('resets the choice after navigating away and back to Contact', async () => {
    const harness = await RouterTestingHarness.create();
    const firstVisit = await harness.navigateByUrl('/contact', Contact);
    harness.routeNativeElement!.querySelector<HTMLButtonElement>('.map-toggle')!.click();
    harness.detectChanges();
    expect(firstVisit.mapVisible()).toBeTrue();
    await harness.navigateByUrl('/autre', OtherPage);
    const nextVisit = await harness.navigateByUrl('/contact', Contact);
    expect(nextVisit).not.toBe(firstVisit);
    expect(nextVisit.mapVisible()).toBeFalse();
    expect(harness.routeNativeElement!.querySelector('iframe')).toBeNull();
  });

  it('neither reads nor writes browser storage or cookies for the choice', () => {
    const getItem = spyOn(Storage.prototype, 'getItem').and.returnValue('true');
    const setItem = spyOn(Storage.prototype, 'setItem');
    const removeItem = spyOn(Storage.prototype, 'removeItem');
    const clear = spyOn(Storage.prototype, 'clear');
    const getCookie = spyOnProperty(Document.prototype, 'cookie', 'get').and.returnValue('maps=true');
    const setCookie = spyOnProperty(Document.prototype, 'cookie', 'set');
    fixture.destroy();
    fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();
    expect(fixture.componentInstance.mapVisible()).toBeFalse();
    toggleMap();
    toggleMap();
    fixture.destroy();
    for (const spy of [getItem, setItem, removeItem, clear, getCookie, setCookie]) {
      expect(spy).not.toHaveBeenCalled();
    }
  });
});
