import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceAmp'
})
export class ReplaceAmpPipe implements PipeTransform {

  transform(value: string): string {
    if (value) {
      return value.replace(/&amp;/g, '-');
    } else {return value;}
  }

}
