const expect = require('chai').expect;

import Controller from '../src/controller/controller';

describe('Controller', () => {
  it('Should create a grid if grid input is valid', () => {
    const controller = new Controller();

    controller.createGrid('5 3');

    expect(controller.grid).to.eql({
      horizontalBoundary: 5,
      verticalBoundary: 3
    });
  });

  it('Should throw an error if grid input is invalid', () => {
    const controller = new Controller();
    // At least one of the coordinates is smaller than 1
    expect(() => controller.createGrid('0 3')).to.throw(Error);
    // At least one of the coordinates is bigger than 50
    expect(() => controller.createGrid('2 51')).to.throw(Error);
    // At least one of the coordinates is not a number
    expect(() => controller.createGrid('2 F')).to.throw(Error);
  });

  it('Should create multiple new rovers and add them to the rovers array if the inputs are valid', () => {
    const controller = new Controller();

    controller.createGrid('5 3');

    controller.spawnRover('1 1 E');
    controller.spawnRover('3 2 N');
    controller.spawnRover('0 3 W');

    expect(controller.rovers.length).to.eql(3);

    expect(controller.rovers[0].outputEndPosition()).to.eql('1 1 E');
    expect(controller.rovers[1].outputEndPosition()).to.eql('3 2 N');
    expect(controller.rovers[2].outputEndPosition()).to.eql('0 3 W');
  });

  it('Should throw an error if the rover input is invalid', () => {
    const controller = new Controller();

    controller.createGrid('5 3');

    // Input contains a character that isn't N, E, S or W
    expect(() => controller.spawnRover('1 2 P')).to.throw(Error);
    // The rover's spawn coordinates are outside the grid
    expect(() => controller.spawnRover('20 20 N')).to.throw(Error);
    // The rover's orientation contains more than one character
    expect(() => controller.spawnRover('1 2 NS')).to.throw(Error);
  });

  it('Should move & rotate rovers and output end position if inputs are valid.\nOutput should include LOST if rover goes off the grid.\nShould prevent rovers from getting lost from scented coordinates', () => {
    const controller = new Controller();

    controller.createGrid('5 3');

    controller.spawnRover('1 1 E');
    controller.moveRover('RFRFRFRF');

    controller.spawnRover('3 2 N');
    controller.moveRover('FRRFLLFFRRFLL');

    controller.spawnRover('0 3 W');
    controller.moveRover('LLFFFLFLFL');

    expect(controller.rovers[0].outputEndPosition()).to.eql('1 1 E');
    expect(controller.rovers[1].outputEndPosition()).to.eql('3 3 N LOST');
    expect(controller.rovers[2].outputEndPosition()).to.eql('2 3 S');
  });

  it('Should throw an error if instruction input is invalid', () => {
    const controller = new Controller();

    controller.createGrid('5 3');

    controller.spawnRover('1 1 E');

    // Input contains a character that isn't F, R or L
    expect(() => controller.moveRover('RFsFmFR4').to.throw(Error));
    // Input is empty
    expect(() => controller.moveRover('').to.throw(Error));
    // Input has more than 99 characters
    expect(() =>
      controller
        .moveRover(
          'RFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFRFR'
        )
        .to.throw(Error)
    );
  });
});
