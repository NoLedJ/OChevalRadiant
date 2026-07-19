import { Component, effect, input } from '@angular/core';
import { FsLightbox } from 'fslightbox-angular';

@Component({
  selector: 'app-carousel',
  imports: [FsLightbox],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel {

  nbOfPhotos = input<number>(0);
  photosUrl = input<string>("");

  toggler: boolean = false;
  sources: string[] = [];
  sources_thumbnail: string[] = [];
  slide: number = 0;

  imagesLoaded = 0;
  animate = false;

  constructor() {
    effect(() => {
      for (let i = 1; i <= this.nbOfPhotos(); i++) {
        this.sources.push(`${this.photosUrl()}${i}.webp`);
        this.sources_thumbnail.push(`${this.photosUrl()}${i}-thumbnail.webp`);
      }
    });
  }

  openLightbox(index: number) {
    this.slide = index + 1;
    this.toggler = !this.toggler;
  }

  onImageLoaded() {
    // Nécessaire à cause d'un bug Opera IOS qui empêche l'animation du carousel
    // si les images ne sont pas complètement chargées au préalable
    this.imagesLoaded += 1;
    if (this.imagesLoaded === this.nbOfPhotos() * 2) {
      this.animate = true;
    }
  }

}
