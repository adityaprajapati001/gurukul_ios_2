import { Directive, ElementRef, Renderer2 } from '@angular/core';
import * as Hammer from 'hammerjs';

@Directive({
  selector: '[appPinchZoom]'
})
export class PinchZoomDirective {
  private hammer!: HammerManager;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.hammer = new Hammer(this.el.nativeElement);
    this.hammer.get('pinch').set({ enable: true });

    let scale = 1;
    this.hammer.on('pinchmove', (ev) => {
      scale = ev.scale;
      this.renderer.setStyle(this.el.nativeElement, 'transform', `scale(${scale})`);
    });

    this.hammer.on('pinchend', () => {
      if (scale < 1) {
        scale = 1;
        this.renderer.setStyle(this.el.nativeElement, 'transform', `scale(${scale})`);
      }
    });
  }

  ngOnDestroy() {
    this.hammer.destroy();
  }

}
