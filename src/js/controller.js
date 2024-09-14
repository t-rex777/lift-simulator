class Lift {
  static TIME_PER_FLOOR = 1000;
  static TIME_TO_OPEN_DOOR = 2500;
  static TIME_TO_CLOSE_DOOR = 2500;
  static WIDTH = 50;
  static HEIGHT = 100;
  static BORDER_HEIGHT = 1;

  currentFloor = 1;
  nextFloor = 1;
  /** @type {Set<{floorNumber: Number; direction: 'up' | 'down'}>} */
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
      (floor) => Number(floor.floorNumber) > Number(this.currentFloor)
    );

    if (floorsToGo.length === 0) return null;

    return Math.min(floorsToGo);
  }

  #moveDown() {
    /**
     * floors that are below current floor
     */
    const floorsToGo = [...this.floorsQueue].filter(
      (floor) => Number(floor.floorNumber) < Number(this.currentFloor)
    );

    if (floorsToGo.length === 0) return null;

    return Math.min(floorsToGo);
  }

  animateLiftDoors(liftElement) {
    const liftDoor1 = liftElement.firstChild;
    const liftDoor2 = liftElement.lastChild;

    if (liftDoor1 === null || liftDoor2 === null) {
      throw new Error('lift doors not found');
    }

    liftDoor1.classList.add('slide-door-1__open');
    liftDoor2.classList.add('slide-door-2__open');

    setTimeout(() => {
      liftDoor1.classList.add('slide-door-1__close');
      liftDoor2.classList.add('slide-door-2__close');
    }, Lift.TIME_TO_OPEN_DOOR);

    setTimeout(() => {
      liftDoor1.classList.remove('slide-door-1__open', 'slide-door-1__close');
      liftDoor2.classList.remove('slide-door-2__open', 'slide-door-2__close');
    }, Lift.TIME_TO_OPEN_DOOR + Lift.TIME_TO_CLOSE_DOOR);
  }

  animateLiftMoving() {
    const liftElement = document.getElementById(this.id);

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
      // just open doors and close
      this.animateLiftDoors(liftElement);

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
        this.animateLiftDoors(liftElement);

        clearInterval(intervalKey);
      }
    }, step);
  }

  notifyAfterLiftArrives() {
    window.dispatchEvent(
      new CustomEvent('lift-arrived', {
        detail: {
          floorNumber: this.currentFloor,
          direction: this.direction,
        },
      })
    );
  }

  getNextFloorToMove() {
    console.log(this.direction, this.currentFloor, [...this.floorsQueue]);

    if (
      this.direction === 'up' ||
      (this.currentFloor === 1 && this.direction === null)
    ) {
      const nextFloor = [...this.floorsQueue].find((floor) => {
        return (
          Number(floor.floorNumber) > Number(this.currentFloor) &&
          floor.direction === 'up'
        );
      });

      if (nextFloor === undefined) {
        return [...this.floorsQueue].shift();
      }

      return nextFloor;
    }

    if (this.direction === 'down') {
      const nextFloor = [...this.floorsQueue].find((floor) => {
        return (
          Number(floor.floorNumber) < Number(this.currentFloor) &&
          floor.direction === 'down'
        );
      });

      if (nextFloor === undefined) {
        return [...this.floorsQueue].shift();
      }

      return nextFloor;
    }
  }

  move() {
    if (this.floorsQueue.size === 0) return;

    if (!this.isMoving) {
      this.nextFloor = this.getNextFloorToMove().floorNumber;

      this.isMoving = true;

      this.timeToReachTheFloor =
        Lift.TIME_PER_FLOOR * Math.abs(this.nextFloor - this.currentFloor) +
        5000;

      this.direction = this.nextFloor - this.currentFloor > 0 ? 'up' : 'down';

      this.animateLiftMoving();

      setTimeout(() => {
        this.isMoving = false;

        this.currentFloor = this.nextFloor;

        this.notifyAfterLiftArrives();

        this.floorsQueue = new Set(
          [...this.floorsQueue].filter(
            (d) => d.floorNumber !== this.currentFloor
          )
        );

        if (this.floorsQueue.size !== 0) {
          // iterate until the queue is empty
          this.move();
        }
      }, this.timeToReachTheFloor);
    }
  }

  /** @param {floorNumber: Number; direction: 'up' | 'down'} */
  addFloor(props) {
    this.floorsQueue.add(props);
  }
}

class LiftSimulator {
  /** @type { {floorNumber: Number; direction: 'up' | 'down'}[] } */
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

  get #isLastLift() {
    return (
      this.#lastAssignedLiftId === null ||
      Number(this.#lastAssignedLiftId) === this.numberOfLifts - 1
    );
  }

  /**
   *
   * @param {Lift} lift
   * @param {Number} floorNumber
   * @returns {boolean}
   */
  #isSameFloor = (lift, floorNumber) => {
    return (
      Number(lift.currentFloor) === Number(floorNumber - 1) && !lift.isMoving
    );
  };

  /**
   * @param { floorNumber: Number; direction: 'up' | 'down' }
   */
  #assignLift({ floorNumber, direction }) {
    /** @type Lift */
    let assignedLift;

    if (this.numberOfLifts === 1) {
      assignedLift = this.lifts[0];
    } else {
      assignedLift = this.lifts.find((lift) => {
        if (this.#isSameFloor(lift, floorNumber)) return true;

        if (this.#isLastLift) return lift.id === 0;

        // round robin
        return lift.id === this.#lastAssignedLiftId + 1;
      });
    }

    this.#lastAssignedLiftId = assignedLift.id;

    assignedLift.addFloor(this.#eventQueue.shift());
    assignedLift.move();

    return assignedLift;
  }

  /**
   * @param { floorNumber: Number; direction: 'up' | 'down' }
   * @returns {Lift}
   */
  addEvent({ floorNumber, direction }) {
    this.#eventQueue.push({ floorNumber, direction });

    return this.#assignLift({ floorNumber, direction });
  }
}
