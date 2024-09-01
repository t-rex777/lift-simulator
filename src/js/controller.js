class Lift {
  static TIME_PER_FLOOR = 1000;

  isMoving = false;
  currentFloor = 0;
  floors = new Set([]);
  /** @type('up'|'down'|null) */
  direction = null;

  constructor(id) {
    this.id = id;
  }

  #moveUp() {
    /**
     * floors that are above current floor
     */
    const floorsToGo = [...this.floors].filter(
      (floor) => Number(floor) > Number(this.currentFloor)
    );

    if (floorsToGo.length === 0) return null;

    return Math.min(floorsToGo);
  }

  #moveDown() {
    /**
     * floors that are below current floor
     */
    const floorsToGo = [...this.floors].filter(
      (floor) => Number(floor) < Number(this.currentFloor)
    );

    if (floorsToGo.length === 0) return null;

    return Math.min(floorsToGo);
  }

  move() {
    console.log(this.floors);
    if (this.floors.size === 0) return;

    const nextFloor =
      this.direction === 'up' ? this.#moveUp() : this.#moveDown();

    if (nextFloor === null) return;

    this.isMoving = true;

    setTimeout(() => {
      this.isMoving = false;
      this.currentFloor = nextFloor;

      this.floors.delete(this.currentFloor);
      console.log(this.floors);
    }, Lift.TIME_PER_FLOOR);
  }

  addFloor(floorNumber) {
    this.floors.add(floorNumber);

    if (
      !this.direction ||
      (this.direction === 'up' && floorNumber < this.currentFloor) ||
      (this.direction === 'down' && floorNumber > this.currentFloor)
    ) {
      this.direction = floorNumber > this.currentFloor ? 'up' : 'down';
    }
  }
}

class LiftSimulator {
  #eventQueue = [];

  constructor(numberOfFloors = 1, numberOfLifts = 1) {
    this.numberOfFloors = numberOfFloors;
    this.numberOfLifts = numberOfLifts;

    /** @type Lift[] */
    this.lifts = Array.from({ length: this.numberOfLifts }).map((_, i) => {
      return new Lift(i);
    });
  }

  get #isAllLiftsMoving() {
    return this.#eventQueue.every((lift) => {
      return lift.isMoving;
    });
  }

  #assignLift() {
    let closestLift = null;
    let minDistance = Infinity;
    const floorToBeAssigned = this.#eventQueue[0];

    for (const lift of this.lifts) {
      const distance = Math.abs(lift.currentFloor - floorToBeAssigned);

      if (distance < minDistance) {
        minDistance = distance;
        closestLift = lift;
      }
    }

    if (closestLift !== null) {
      // adds to lift's floor and removes from the event queue
      closestLift.addFloor(this.#eventQueue.shift());
      closestLift.move();
    }
  }

  addEvent(floorNumber) {
    this.#eventQueue.push(floorNumber);

    this.#assignLift();
  }
}
