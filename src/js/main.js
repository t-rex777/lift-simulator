let numberOfFloors = 0;
let numberOfLifts = 0;
let displayForm = false;

const form = document.querySelector('form');
form.addEventListener('submit', handleFormSubmit);

const liftSimulator = document.querySelector('#lift-simulator');
liftSimulator.style.display = 'none';

function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const formValues = Object.fromEntries(formData.entries());

  numberOfFloors = formValues['number-of-floors'];
  numberOfLifts = formValues['number-of-lifts'];
  displayForm = true;

  liftSimulator.style.display = 'flex';
  form.style.display = 'none';
}
