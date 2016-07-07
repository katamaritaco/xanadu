/* fixed-2d-array is borked, shame on them!
import FTDA from 'fixed-2d-array';

export default class Grid extends FTDA {
  constructor(numRows, numCols) {
    super(numCols, numRows, null);
  }
}
*/

export default class Grid {
  constructor(numRows, numCols, defaultVal = null) {
    this.cells = [];
    for (let r = 0; r < numRows; r++) {
      this.cells.push([]);
      for (let c = 0; c < numCols; c++) {
        this.cells[r].push(defaultVal);
      }
    }
  }
  get(row, col) {
    return this.cells[row][col];
  }
  set(row, col, val) {
    this.cells[row][col] = val;
  }
  getWidth() {
    return this.cells[0].length;
  }
  getHeight() {
    return this.cells.length;
  }
  getRow(row) {
    return this.cells[row];
  }
}