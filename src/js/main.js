let numberOfFloors = 0;
let numberOfLifts = 0;
let displayForm = false;

const form = document.querySelector('form');
form.addEventListener('submit', handleFormSubmit);

const liftSimulator = document.querySelector('#lift-simulator');
// liftSimulator.style.display = 'none';

function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const formValues = Object.fromEntries(formData.entries());

  numberOfFloors = formValues['number-of-floors'];
  numberOfLifts = formValues['number-of-lifts'];
  displayForm = true;

  // liftSimulator.style.display = 'flex';
  // form.style.display = 'none';

  Array.from({ length: numberOfFloors }).forEach((_, i) => {
    const floor = document.createElement('div');
    const floorWrapper = document.createElement('div');
    const floorNumber = document.createElement('span');

    floorWrapper.appendChild(floor);
    floorWrapper.appendChild(floorNumber);

    floorNumber.innerText = `Floor ${i + 1}`;

    floor.className = 'floor';
    floorNumber.className = 'floor__number';
    floorWrapper.className = 'floor__wrapper';

    liftSimulator.appendChild(floorWrapper);
  });

  console.log('inputs are in');

  form.reset();
}

new LiftSimulator().move(5);
