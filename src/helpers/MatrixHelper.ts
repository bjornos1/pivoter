import * as _ from 'lodash'
import { PivotNumber } from 'src/models/number';


export class MatrixHelper {
  public static generateNumberMatrix(columns: number, rows: number): PivotNumber[][] {
    return _.map(Array(rows), () => this.generateNumberRow(columns));
  }

  public static generateNumberRow(columns: number): PivotNumber[] {
    return _.map(Array(columns), () => new PivotNumber(0));
  }
}


