import * as _ from 'lodash'
import { PivotNumber } from 'src/models/number';

export class MatrixHelper {
  public static pivotBmatrice(matrice: PivotNumber[], pivotRow: number, multiplyers: PivotNumber[]) {
    for(let row=0; row < multiplyers.length; row++) {
      if (row != pivotRow) {
        let toRemove = this.multiply(multiplyers[row], matrice[pivotRow])
        matrice[row] = this.add(matrice[row], toRemove);
      }
    }

    matrice[pivotRow] = this.multiply(matrice[pivotRow], multiplyers[pivotRow])
  }

  public static pivotXmatrice(matrice: PivotNumber[][], pivotRow: number, pivotCol: number, multipliers: PivotNumber[]): void{
    for (let row=0; row < matrice.length; row++) {
     if (row !== pivotRow) {
        for (let col=0; col < matrice[row].length; col++) {
          let toRemove = this.multiply(matrice[pivotRow][col], multipliers[row]);
          matrice[row][col] = this.add(matrice[row][col], toRemove);
        }
      }
    }

    for (let col=0; col < matrice[pivotRow].length; col++) {
      matrice[pivotRow][col] = this.multiply(matrice[pivotRow][col], multipliers[pivotRow]);
    }
  }

  public static getBaseIndex(matrice: PivotNumber[][], checkRow: number): number {
    let result = -1;
    for(let col=0; col < matrice[checkRow].length; col++) {
      if (matrice[checkRow][col].numerator !== 0) {
        let isOnlyNonZeroInCol = this.isOnlyNonZeroInCol(matrice, checkRow, col);
        if (isOnlyNonZeroInCol){
          result = col;
          break;
        }
      }
    }
    return result;
  }

  public static getPivotMultipliers(matrice: PivotNumber[][], pivotRow: number, pivotCol: number): PivotNumber[] {
    let multipliers:PivotNumber[] = [];
    let toBeMultiplied = matrice[pivotRow][pivotCol];

    if (toBeMultiplied.numerator == 0) {
      return _.fill(Array(matrice.length), new PivotNumber(0));
    }

    for(let row=0; row<matrice.length;row++) {
      if (row === pivotRow) {
        let multiplyer = new PivotNumber(toBeMultiplied.fraction, toBeMultiplied.numerator)
        multipliers.push(multiplyer);
      }

      else {
        let multiplyer = this.getMultiplyerToEliminate(toBeMultiplied, matrice[row][pivotCol]);
        multipliers.push(multiplyer);
      }
    }
    return multipliers;
  }

  public static getMultiplyerToEliminate(toBeMultiplied: PivotNumber, toBeEliminated: PivotNumber): PivotNumber {
    let numerator = -1 * toBeEliminated.numerator * toBeMultiplied.fraction;
    let fraction = toBeEliminated.fraction * toBeMultiplied.numerator;
    return new PivotNumber(numerator, fraction);
  }

  public static generateNumberMatrix(columns: number, rows: number): PivotNumber[][] {
    return _.map(Array(rows), () => this.generateNumberRow(columns));
  }

  public static generateNumberRow(columns: number): PivotNumber[] {
    return _.map(Array(columns), () => new PivotNumber(0));
  }

  public static simplifyMatrice(matrice: PivotNumber[][]): PivotNumber[][] {
    return _.map(matrice, row => this.simplifyRow(row))
  }

  public static simplifyRow(row: PivotNumber[]): PivotNumber[] {
    return _.map(row, n => this.simplify(n));
  }

  public static simplify(n: PivotNumber): PivotNumber {
    let res = _.clone(n);
    if (n.fraction < 0) {
      n.numerator *= -1;
      n.fraction *= -1;
    }


    if (n.fraction === 1) {
      return res;
    }

    else if (n.numerator % n.fraction === 0){
      res.numerator = res.numerator / res.fraction;
      res.fraction = 1;
    }

    else {
      let gcd = this.getGreatestCommonDivisor(res);
      res.numerator /= gcd;
      res.fraction /= gcd;
    }

    return res;
  }

  public static add(a: PivotNumber, b: PivotNumber): PivotNumber {
    let aScaled = this.scale(a, b.fraction);
    let bScaled = this.scale(b, a.fraction);

    aScaled.numerator += bScaled.numerator;

    return aScaled;
  }

  public static scale(n: PivotNumber, scale: number): PivotNumber {
    return this.multiply(n, new PivotNumber(scale, scale));
  }

  public static multiply(a: PivotNumber, b: PivotNumber): PivotNumber {
    return new PivotNumber(a.numerator * b.numerator, a.fraction * b.fraction);
  }

  private static getGreatestCommonDivisor(n: PivotNumber): number {
    let x = Math.abs(n.numerator);
    let y = Math.abs(n.fraction);
    while(y) {
      var t = y;
      y = x % y;
      x = t;
    }
    return x;
  }

  private static isOnlyNonZeroInCol(matrice: PivotNumber[][], row: number, col: number): boolean {
    for(let curRow=0; curRow < matrice.length; curRow++) {
      if (curRow !== row && matrice[curRow][col].numerator !== 0) {
        return false;
      }
    }

    return true;
  }
}

