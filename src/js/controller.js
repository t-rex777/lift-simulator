class Lift {
  static TIME_PER_FLOOR = 1000;

  isMoving = false;
  currentFLoor = 0;
  destinationFloor = 0;

  moveToFloor(floor) {
    console.log(`Moving to floor ${floor}`);

    this.isMoving = true;
    this.destinationFloor = floor;

    setTimeout(function () {
      this.isMoving = false;
      this.currentFloor = floor;

      console.log(`Moved to floor ${floor}`);
    }, Lift.TIME_PER_FLOOR * floor);
  }
}

class LiftSimulator {
  constructor(numberOfFloors, numberOfLifts) {
    this.numberOfFloors = numberOfFloors;
    this.numberOfLifts = numberOfLifts;

    this.eventQueue = new Array(this.numberOfLifts);
  }

  get #isAllLiftsMoving() {
    return this.eventQueue.every((lift) => {
      return lift.isMoving;
    });
  }

  move(floor) {
    const lift = new Lift();
    lift.moveToFloor(floor);
  }
}
