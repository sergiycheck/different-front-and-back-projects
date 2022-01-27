import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Pipe({
  name: 'customdate',
})
export class CustomdatePipe implements PipeTransform {
  transform(dateString: string, ...args: unknown[]): unknown {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  }
}
