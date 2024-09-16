import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'srcExtractor'
})
export class SrcExtractorPipe implements PipeTransform {
  transform(htmlString: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const imgElement = doc.querySelector('img');
    return imgElement ? imgElement.getAttribute('src') ?? '' : '';
  }
}