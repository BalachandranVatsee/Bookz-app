import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shelf',
  standalone: true
})
export class ShelfPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
