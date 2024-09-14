# Lift-Simulation

Create a web app where you can simulate lift mechanics for a client

# UI Example

![Lift Simulation Example](Lift-Simulation-Example.png 'Lift Simulation Example')

# Requirements

1. Have a page where you input the number of floors and lifts from the user
2. An interactive UI is generated, where we have visual depictions of lifts and buttons on floors
3. Upon clicking a particular button on the floor, a lift goes to that floor

Milestone 1:

- Data store that contains the state of your application data
- JS Engine that is the controller for which lift goes where
- Dumb UI that responds to controller's commands

Milestone 2:

- Lift having doors open in 2.5s, then closing in another 2.5s
- Lift moving at 2s per floor
- Lift stopping at every floor where it was called
- Mobile friendly design

# The standard elevator algorithm works as follows:

- Start going in the direction of the first button pressed.
- Keep track of which direction you're currently traveling.
- When a floor is reached and that button was pressed, stop and open the doors.
- Mark the buttons for that floor as not pressed anymore.
- If there are still more floors to visit in the same direction, continue going in that direction.
- If not, and there are still floors to visit in the opposite direction, move in that direction.
- If there are no more floors to visit, start over when a new button is pressed.
