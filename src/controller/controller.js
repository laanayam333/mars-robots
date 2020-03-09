import Grid from '../models/grid';
import Rover from '../models/rover';

class Controller {
  constructor() {
    this.rovers = [];
    this.grid = {};
  }

  // FIRST INPUT --> GRID COORDINATES

  createGrid(gridInput) {
    const invalidCoordinates = /[a-z]/gi;

    if (gridInput.match(invalidCoordinates)) {
      throw new Error(
        'Please enter a valid value. Grid dimensions must be integer numbers'
      );
    }

    let gridXDimension = Math.floor(parseInt(gridInput.split(' ')[0], 10));
    let gridYDimension = Math.floor(parseInt(gridInput.split(' ')[1], 10));

    if (
      gridXDimension > 50 ||
      gridYDimension > 50 ||
      gridXDimension < 1 ||
      gridYDimension < 1
    ) {
      throw new Error(
        'Please enter a valid value. Grid dimensions have to be between 1x1 and 50x50.'
      );
    }

    this.grid = new Grid(gridXDimension, gridYDimension);
  }

  // SECOND INPUT --> ROVER POSITION AND ORIENTATION

  createRover(xPosition, yPosition, orientation) {
    let newRover = new Rover(xPosition, yPosition, orientation);

    this.rovers.push(newRover);
  }

  spawnRover(spawnPosition) {
    let spawnPositionX = Math.floor(parseInt(spawnPosition.split(' ')[0]));
    let spawnPositionY = Math.floor(parseInt(spawnPosition.split(' ')[1]));
    let spawnOrientation = spawnPosition.split(' ')[2].toUpperCase();

    const validOrientations = /[NESW]/;

    if (
      spawnPositionX > this.grid.horizontalBoundary ||
      spawnPositionY > this.grid.verticalBoundary ||
      spawnOrientation.length > 1 ||
      spawnOrientation.match(validOrientations) === null
    ) {
      throw new Error(
        'Please enter a valid value. Rover orientation must be either N, E, S or W'
      );
    }

    this.createRover(spawnPositionX, spawnPositionY, spawnOrientation);
  }

  // THIRD INPUT --> ROVER INSTRUCTIONS

  moveRover(inputInstructions) {
    let aliveRover = this.rovers.find(rover => rover.isOperative === true);

    const commands = inputInstructions.toUpperCase().split('');

    const validInstructions = /[FRL]/;

    if (commands.length >= 100 || commands.length < 1) {
      throw new Error(
        'Please enter a valid value. Rover instructions must be bigger than 0 and smaller than 100 characters.'
      );
    }

    commands.forEach(command => {
      if (command.match(validInstructions) === null) {
        throw new Error(
          'Please enter a valid value. Rover instructions must be either F, R, or L'
        );
      } else if (command === 'R' || command === 'L') {
        aliveRover.rotates(command);
      } else if (command === 'F') {
        aliveRover.moves();

        this.rovers.forEach(rover => {
          if (rover.scent.isMarked) {
            aliveRover.xCoordinate > rover.scent.xScent
              ? (aliveRover.xCoordinate -= 1)
              : null;
            aliveRover.yCoordinate > rover.scent.yScent
              ? (aliveRover.yCoordinate -= 1)
              : null;
          }
        });

        if (
          aliveRover.xCoordinate < 0 ||
          aliveRover.yCoordinate < 0 ||
          aliveRover.xCoordinate > this.grid.horizontalBoundary ||
          aliveRover.yCoordinate > this.grid.verticalBoundary
        ) {
          return (aliveRover.isLost = true);
        }

        if (aliveRover.isLost === true) {
          aliveRover.xCoordinate < 0 ? (aliveRover.xCoordinate += 1) : null;
          aliveRover.yCoordinate < 0 ? (aliveRover.yCoordinate += 1) : null;
          aliveRover.xCoordinate > this.grid.horizontalBoundary
            ? (aliveRover.xCoordinate -= 1)
            : null;
          aliveRover.yCoordinate > this.grid.verticalBoundary
            ? (aliveRover.yCoordinate -= 1)
            : null;

          aliveRover.scent.isMarked = true;
          aliveRover.scent.xScent = aliveRover.xCoordinate;
          aliveRover.scent.yScent = aliveRover.yCoordinate;
        }
      }

      aliveRover.isOperative = false;
      return aliveRover.outputEndPosition();
    });
  }
}

export default Controller;
