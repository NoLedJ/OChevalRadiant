import { Component, Input } from '@angular/core';
import { AnimateOnVisibleDirective } from '../../../directives/animate-on-visible.directive';
import { FacebookButton } from '../facebook-button/facebook-button';

@Component({
  selector: 'app-banner-section',
  imports: [FacebookButton, AnimateOnVisibleDirective],
  templateUrl: './banner-section.html',
  styleUrl: './banner-section.scss',
})
export class BannerSection {

  @Input() bannerTitle: string = "";
  @Input() bannerSubtitle: string = "";
  @Input() bannerImage: string = "";
  @Input() heroHeader: boolean = false;

}
