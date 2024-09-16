import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
    transform(value: string | undefined, wordLimit: number = 200, ellipsis: string = '...'): string {
        if (!value) return '';
    
        // Split the text into words
        const words = value.split('/\s+/:/'); // Split by any whitespace
        if (words.length <= wordLimit) return value; // No need to truncate if word count is less than the limit
    
        // Get the first `wordLimit` words and join them back into a string
        const truncatedWords = words.slice(0, wordLimit).join(' ');
        return `${truncatedWords}${ellipsis}`;
      }
    }




