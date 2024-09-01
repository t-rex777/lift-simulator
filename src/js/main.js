let numberOfFloors = 0;
let numberOfLifts = 0;
let displayForm = false;

const form = document.querySelector('form');
form.addEventListener('submit', handleFormSubmit);

const liftSimulator = document.querySelector('#lift-simulator');

const engine = new LiftSimulator();

function handleCallLift(floorNumber) {
  engine.addEvent(floorNumber);
}

function setupFloors(numberOfFloors) {
  Array.from({ length: numberOfFloors }).forEach((_, i) => {
    const floor = document.createElement('div');
    const floorWrapper = document.createElement('div');
    const floorNumberDiv = document.createElement('span');
    const upButton = document.createElement('button');
    const downButton = document.createElement('button');

    const floorNumber = Number(numberOfFloors - i);
    upButton.onclick = () => handleCallLift(floorNumber);
    downButton.onclick = () => handleCallLift(floorNumber);

    floor.appendChild(upButton);
    floor.appendChild(downButton);

    floorWrapper.appendChild(floor);
    floorWrapper.appendChild(floorNumberDiv);

    upButton.innerText = 'Up';
    downButton.innerText = 'Down';
    floorNumberDiv.innerText = `Floor ${floorNumber}`;

    floor.className = 'floor';
    floorNumberDiv.className = 'floor__number';
    floorWrapper.className = 'floor__wrapper';
    upButton.className = 'floor__up-button';
    downButton.className = 'floor__down-button';

    if (i === 0) {
      upButton.style.display = 'none';
    }

    floorWrapper.setAttribute('data-first-floor', 'false');

    if (i === numberOfFloors - 1) {
      downButton.style.display = 'none';
      floorWrapper.setAttribute('data-first-floor', 'true');
    }

    liftSimulator.appendChild(floorWrapper);
  });
}

function setupLifts(numberOfLifts) {
  const lastFloor = document.querySelectorAll("[data-first-floor='true']")[0];

  const liftWrapper = document.createElement('div');
  liftWrapper.className = 'lift__wrapper';

  Array.from({ length: numberOfLifts }).forEach((_, i) => {
    const lift = document.createElement('div');
    lift.className = 'lift';
    lift.style.left = `${100 + i * 40}px`;

    liftWrapper.appendChild(lift);
  });

  lastFloor.appendChild(liftWrapper);
}

function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const formValues = Object.fromEntries(formData.entries());

  numberOfFloors = formValues['number-of-floors'];
  numberOfLifts = formValues['number-of-lifts'];
  displayForm = true;

  // liftSimulator.style.display = 'flex';
  // form.style.display = 'none';

  setupFloors(numberOfFloors);
  setupLifts(numberOfLifts);

  form.reset();
}

setupFloors(5);
setupLifts(3);
