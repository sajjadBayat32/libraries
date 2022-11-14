import { Directive, ElementRef, Input } from "@angular/core";

@Directive({
  selector: "[imageSource]",
})
export class ImageSourceDirective {
  @Input("imageSource") set item(data: string) {
    if (this.isNotAvailable(data)) {
      this.el.nativeElement.src = "assets/images/image-placeholder.png";
      // this.el.nativeElement.alt = "No image found !";
    } else {
      this.el.nativeElement.src = data;
    }
  }

  constructor(private el: ElementRef) {}

  isNotAvailable(value: string) {
    return value === null || value === undefined || value === "";
  }
}
