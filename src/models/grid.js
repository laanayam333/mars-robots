class Grid {
  constructor(width, height) {
    this.scentCollection = [];
    this.width = width;
    this.height = height;

    if (width > 50 || height > 50 || height < 1 || width < 1) {
      throw new Error(
        'The grid has to be smaller than 50x50 and bigger than 0x0. Please enter a valid value pair of grid dimensions'
      );
    }

    if (isNaN(width) || isNaN(height)) {
      throw new Error('Invalid input. Grid dimensions must be integer numbers.')
    }
  }

  isOutOfBounds(x, y) {
    return (x > this.width || x < 0 || y > this.height || y < 0)
  }

  addScentToCollection(scent) {
    this.scentCollection.push(scent);
  }

  isScentInCollection(input) {
    return this.scentCollection.indexOf(input) > -1;
  }
}

export default Grid;
