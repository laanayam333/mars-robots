class Rover {
  constructor(xCoordinate, yCoordinate, isFacing) {
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
    this.isFacing = isFacing;
    this.isLost = false;
    this.isOperative = true;
    this.scent = {
      isMarked: false,
      xScent: '',
      yScent: ''
    };

    this.movement = {
      N: {
        x: 0,
        y: 1
      },

      E: {
        x: 1,
        y: 0
      },

      S: {
        x: 0,
        y: -1
      },

      W: {
        x: -1,
        y: 0
      }
    };

    this.rotation = {
      N: {
        R: 'E',
        L: 'W'
      },

      E: {
        R: 'S',
        L: 'N'
      },

      S: {
        R: 'W',
        L: 'E'
      },

      W: {
        R: 'N',
        L: 'S'
      }
    };
  }

  moves() {
    this.xCoordinate = this.xCoordinate + this.movement[this.isFacing]['x'];

    this.yCoordinate = this.yCoordinate + this.movement[this.isFacing]['y'];
  }

  rotates(rotatesTo) {
    this.isFacing = this.rotation[this.isFacing][rotatesTo];
  }

  outputEndPosition() {
    if (this.isLost) {
      return `${this.xCoordinate} ${this.yCoordinate} ${this.isFacing} LOST`;
    } else {
      return `${this.xCoordinate} ${this.yCoordinate} ${this.isFacing}`;
    }
  }
}

export default Rover;
