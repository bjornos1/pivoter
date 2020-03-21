import { Component } from '@angular/core';
import { PivotNumber } from 'src/models/number';

import * as _ from 'lodash';
import { MatrixHelper as MatriceHelper } from 'src/helpers/MatriceHelper';

const START_VARIABLE_AMOUNT = 2;
const START_CONSTRAINT_AMOUNT = 3;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pivot-app';

  constraints = START_CONSTRAINT_AMOUNT;
  variables = START_VARIABLE_AMOUNT;

  b: PivotNumber[] =
    MatriceHelper.generateNumberRow(START_CONSTRAINT_AMOUNT + 1);

  x: PivotNumber[][] =
    MatriceHelper.generateNumberMatrix(START_VARIABLE_AMOUNT + 1, START_CONSTRAINT_AMOUNT + 1);

  rows = START_CONSTRAINT_AMOUNT;

  columns = START_VARIABLE_AMOUNT;

  variableNames: string[] = [];

  isEditing = true;

  constructor() {
    this.initializeVariableNames();
    this.x[0][0].numerator = 1; // z-value
  }

  public incomingIndex = -1;
  public outgoingIndex = -1;

  public toggleEditing() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.incomingIndex = -1;
      this.outgoingIndex = -1;
    }
  }

  public chooseIncomingIndex(index: number) {
    if (!this.isEditing) {
      this.incomingIndex = index;
    }
  }

  public chooseOutgoingIndex(index: number) {
    if (!this.isEditing) {
      this.outgoingIndex = index;
    }
  }

  public pivot() {
    console.log(this.incomingIndex, this.outgoingIndex);

    let multipliers = MatriceHelper.getPivotMultipliers(this.x, this.outgoingIndex, this.incomingIndex);
    console.log(multipliers)

    MatriceHelper.pivotBmatrice(this.b, this.outgoingIndex, multipliers);
    MatriceHelper.pivotXmatrice(this.x, this.outgoingIndex, this.incomingIndex, multipliers);

    this.incomingIndex = -1;
    this.outgoingIndex = -1;

    this.b = MatriceHelper.simplifyRow(this.b);
    this.x = MatriceHelper.simplifyMatrice(this.x);
  }

  public addVariable() {
    _.forEach(this.x, row => {
      row.push(new PivotNumber(0));
    });

    this.variables++;

    this.variableNames.push(`x${this.variables}`);
  }

  public updateXvalue(row: number, column: number, value: number) {
    this.x[row][column].numerator = +value;
  }

  public updateBvalue(row: number, value: number) {
    this.b[row].numerator = + value;
  }

  public removeVariable(index: number): void {
    _.forEach(this.x, row => {
      row.splice(index, 1)
    });

    this.variableNames.pop();
    this.variables--;
  }

  public onVariableUpdate(row, column, value) {
    this.x[row][column].numerator = value;
  }

  public addConstraint() {
    this.x.push(MatriceHelper.generateNumberRow(this.variables + 1));
    this.b.push(new PivotNumber(0));


    console.log(this.x);
    console.log(this.b)
    this.constraints++;
  }

  public removeConstraint(index: number): void {
    this.x.splice(index, 1);
    this.b.splice(index, 1);
    this.constraints--;

    console.log(this.constraints)
  }

  private initializeVariableNames() {
    for (let i = 0; i < START_VARIABLE_AMOUNT; i++) {
      this.variableNames.push(`x${i + 1}`);
    }
  }
}
