import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indexActivities'
})
export class IndexActivitiesPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
