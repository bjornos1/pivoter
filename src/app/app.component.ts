import { Component } from '@angular/core';
import { PivotNumber } from 'src/models/number';

import * as _ from 'lodash';
import { MatrixHelper } from 'src/helpers/MatrixHelper';
import { threadId } from 'worker_threads';

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
    MatrixHelper.generateNumberRow(START_CONSTRAINT_AMOUNT + 1);

  x: PivotNumber[][] =
    MatrixHelper.generateNumberMatrix(START_VARIABLE_AMOUNT, START_CONSTRAINT_AMOUNT + 1);

  rows = START_CONSTRAINT_AMOUNT;

  columns = START_VARIABLE_AMOUNT;

  variableNames: string[] = [];

  constructor() {
    this.initializeVariableNames();
  }

  public addVariable() {
    _.forEach(this.x, row => {
      row.push(new PivotNumber(0));
    });

    this.variables++;

    this.variableNames.push(`x${this.variables}`);
  }

  public removeVariable(index: number): void {
    _.forEach(this.x, row => {
      row.splice(index, index ? index : index + 1)
    });

    this.variableNames.pop();
    this.variables--;
  }

  public addConstraint() {
    this.x.push(MatrixHelper.generateNumberRow(this.variables));
    this.b.push(new PivotNumber(0));
  }

  public removeConstraint(index: number): void {
    this.x.splice(index, index ? index : index + 1);
  }

  private initializeVariableNames() {
    for (let i = 0; i < START_VARIABLE_AMOUNT; i++) {
      this.variableNames.push(`x${i + 1}`);
    }
  }
}
