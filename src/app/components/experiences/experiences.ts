import { Component } from '@angular/core';
import { FsLightbox } from "fslightbox-angular";

@Component({
  selector: 'app-experiences',
  imports: [FsLightbox],
  templateUrl: './experiences.html',
  styleUrl: './experiences.scss',
})
export class Experiences {

  nbOfPhotos = 17;
  toggler: boolean = false;
  sources: string[] = [];
  slide: number = 0;

  constructor() {
    for (let i = 1; i <= this.nbOfPhotos; i++) {
      this.sources.push(`/images/experiences/experience${i}.jpg`);
    }
  }

  openLightbox(index: number): void {
    this.slide = index + 1;
    this.toggler = !this.toggler;
  }

}
