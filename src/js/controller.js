class Lift {
  static TIME_PER_FLOOR = 2000;
  static WIDTH = 40;
  static HEIGHT = 80;

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

    console.log({ floorsToGo });

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

    console.log({ floorsToGo });

    if (floorsToGo.length === 0) return null;

    return Math.min(floorsToGo);
  }

  move() {
    if (this.floors.size === 0) return;

    const nextFloor =
      this.direction === 'up' ? this.#moveUp() : this.#moveDown();

    if (nextFloor === null) return;

    this.isMoving = true;

    const timeToReachTheFloor =
      Lift.TIME_PER_FLOOR * Math.abs(nextFloor - this.currentFloor);

    console.log({ timeToReachTheFloor, nextFloor, curr: this.currentFloor });

    setTimeout(() => {
      this.isMoving = false;
      this.currentFloor = nextFloor;

      this.floors.delete(this.currentFloor);

      if (this.floors.size !== 0) {
        // iterate until the queue is empty
        this.move();
      }

      console.log(this.floors);
    }, timeToReachTheFloor);
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
    /** @type Lift */
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

    return closestLift;
  }

  addEvent(floorNumber) {
    this.#eventQueue.push(floorNumber);

    return this.#assignLift();
  }
}

/**
 * maintain a queue
 * assign lifts one floor from the queue and remove it
 * there will be a queue for individual lift
 * the lift have to iterate until its queue is empty
 */
