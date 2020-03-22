import { Pipe, PipeTransform } from '@angular/core';
import { PivotNumber } from 'src/models/number';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'pivotnumber'})
export class PivotNumberPipe implements PipeTransform {
  transform(value: PivotNumber): string {
    if (value.fraction === 1) {
      return `${value.numerator}`;
    } else {
      return `${value.numerator}/${value.fraction}`;
    }
  }
}
