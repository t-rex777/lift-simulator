class Lift {
  static TIME_PER_FLOOR = 1000;
  static TIME_TO_OPEN_DOOR = 2500;
  static TIME_TO_CLOSE_DOOR = 2500;
  static WIDTH = 50;
  static HEIGHT = 100;
  static BORDER_HEIGHT = 1;

  currentFloor = 1;
  nextFloor = 1;
  floorsQueue = new Set([]);
  /** @type('up'|'down'|null) */
  direction = null;
  timeToReachTheFloor = 0;
  isMoving = false;

  constructor(id) {
    this.id = id;
  }

  #moveUp() {
    /**
     * floors that are above current floor
     */
    const floorsToGo = [...this.floorsQueue].filter(
      (floor) => Number(floor) > Number(this.currentFloor)
    );

    if (floorsToGo.length === 0) return null;

    return Math.min(floorsToGo);
  }

  #moveDown() {
    /**
     * floors that are below current floor
     */
    const floorsToGo = [...this.floorsQueue].filter(
      (floor) => Number(floor) < Number(this.currentFloor)
    );

    if (floorsToGo.length === 0) return null;

    return Math.min(floorsToGo);
  }

  animate() {
    const liftElement = document.getElementById(this.id);
    const liftDoor1 = liftElement.firstChild;
    const liftDoor2 = liftElement.lastChild;

    if (liftDoor1 == null || liftDoor2 == null) {
      throw new Error('lift doors not found');
    }

    // floor starts from 1
    let initialPosition = (this.currentFloor - 1) * Lift.HEIGHT;

    const distanceBetweenFloors = Math.abs(
      (this.nextFloor - this.currentFloor) * (Lift.HEIGHT + Lift.BORDER_HEIGHT)
    );

    const finalPosition = Math.abs(
      Math.floor((this.nextFloor - 1) * Lift.HEIGHT)
    );

    let intervalKey;

    const step = 10;

    if (distanceBetweenFloors === 0) {
      return;
    }

    intervalKey = setInterval(() => {
      liftElement.style.transform = `translateY(-${initialPosition}px)`;

      initialPosition =
        this.currentFloor > this.nextFloor
          ? initialPosition - 1
          : initialPosition + 1;

      // stop the animation
      if (initialPosition === finalPosition) {
        liftDoor1.classList.add('slide-door-1__open');
        liftDoor2.classList.add('slide-door-2__open');

        setTimeout(() => {
          liftDoor1.classList.add('slide-door-1__close');
          liftDoor2.classList.add('slide-door-2__close');
        }, Lift.TIME_TO_OPEN_DOOR);

        setTimeout(() => {
          liftDoor1.classList.remove('slide-door-1__open');
          liftDoor1.classList.remove('slide-door-1__close');
          liftDoor2.classList.remove('slide-door-2__open');
          liftDoor2.classList.remove('slide-door-2__close');
        }, Lift.TIME_TO_OPEN_DOOR + Lift.TIME_TO_CLOSE_DOOR);

        clearInterval(intervalKey);
      }
    }, step);
  }

  move() {
    if (this.floorsQueue.size === 0) return;

    if (!this.isMoving) {
      this.nextFloor = [...this.floorsQueue].shift();

      this.isMoving = true;

      this.timeToReachTheFloor =
        Lift.TIME_PER_FLOOR * Math.abs(this.nextFloor - this.currentFloor) +
        5000;

      this.direction = this.nextFloor - this.currentFloor > 0 ? 'up' : 'down';

      this.animate();

      console.log({ time: this.timeToReachTheFloor });

      setTimeout(() => {
        this.isMoving = false;
        this.currentFloor = this.nextFloor;

        this.floorsQueue.delete(this.currentFloor);

        if (this.floorsQueue.size !== 0) {
          // iterate until the queue is empty
          this.move();
        }
      }, this.timeToReachTheFloor);
    }
  }

  addFloor(floorNumber) {
    this.floorsQueue.add(floorNumber);
  }
}

class LiftSimulator {
  #eventQueue = [];
  #lastAssignedLiftId = null;

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
    let assignedLift;

    if (this.numberOfLifts === 1) {
      assignedLift = this.lifts[0];
    } else {
      assignedLift = this.lifts.find((d) => {
        return this.#lastAssignedLiftId === null ||
          Number(this.#lastAssignedLiftId) === Number(this.numberOfLifts - 1)
          ? d.id === 0
          : d.id === this.#lastAssignedLiftId + 1;
      });
    }

    this.#lastAssignedLiftId = assignedLift.id;

    assignedLift.addFloor(this.#eventQueue.shift());
    assignedLift.move();

    return assignedLift;
  }

  addEvent(floorNumber) {
    this.#eventQueue.push(floorNumber);

    return this.#assignLift();
  }
}
