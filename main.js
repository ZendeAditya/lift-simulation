const floorInput = document.getElementById("floor-input");
const liftInput = document.getElementById("lift-input");
const submitButton = document.getElementById("submit-btn");
const container = document.getElementById("container");
const liftContainer = document.createElement("div");

let floorVal = "";
let liftVal = "";
let prevFloor = 0;

let upTargetFloors = [];
let downTargetFloors = [];

submitButton.addEventListener("click", () => {
  if (!liftInput.value && !floorInput.value) {
    alert("Please Enter number to generate Floors and Lifts");
  } else if (!floorInput.value) {
    alert("Please enter floor number in range 1-15");
  } else if (!liftInput.value) {
    alert("Please enter lift number in range 1-4");
  } else if (liftInput.value == 0 || floorInput.value == 0) {
    alert("Value can't be zero");
  } else if (liftInput.value < 0 || floorInput.value < 0) {
    alert("No negative values are allowed");
  } else {
    container.innerHTML = "";
    liftContainer.innerHTML = "";
    for (let i = floorInput.value; i > 0; i--) {
      createFloors(i, liftInput.value);
    }

    liftInput.value = "";
    floorInput.value = "";
  }
});

function createFloors(floors, lifts) {
  const floorDiv = document.createElement("div");
  floorDiv.setAttribute("class", "floordiv");

  const floorContainer = document.createElement("div");
  floorContainer.setAttribute("class", "floor");
  floorContainer.dataset.floor = floors;

  const buttonContainer = document.createElement("div");
  buttonContainer.setAttribute("class", "btn-div");

  const upButton = document.createElement("button");
  const downButton = document.createElement("button");

  upButton.setAttribute("class", "up-down up-button");
  downButton.setAttribute("class", "up-down down-button");

  upButton.setAttribute("id", `up-${floors}`);
  downButton.setAttribute("id", `down-${floors}`);

  upButton.innerText = "UP";
  downButton.innerText = "Down";

  upButton.dataset.floor = floors;
  downButton.dataset.floor = floors;

  buttonContainer.append(upButton);
  buttonContainer.append(downButton);

  let floorNumber = document.createElement("p");
  floorNumber.setAttribute("class", "floorName");
  floorNumber.innerText = `Floor ${floors}`;

  buttonContainer.append(floorNumber);
  floorContainer.append(buttonContainer);
  floorDiv.append(floorContainer);
  container.append(floorDiv);

  if (floors === 1) {
    for (let j = 0; j < lifts; j++) {
      let upLift = createLift("up");
      let downLift = createLift("down");
      
      liftContainer.appendChild(upLift);
      liftContainer.appendChild(downLift);
    }
    
    liftContainer.setAttribute("class", "lift");
    floorContainer.append(liftContainer);
    floorDiv.append(floorContainer);
    
    if (floors === 1) {
      downButton.classList.add("remove-btn");
    }
  }
}

function createLift(direction) {
  let lift = document.createElement("div");
  lift.setAttribute("class", `lift-div ${direction}-lift`);
  lift.setAttribute("onfloor", 1);
  lift.dataset.currentLocation = prevFloor;
  lift.dataset.direction = direction;

  let leftDoor = document.createElement("div");
  let rightDoor = document.createElement("div");

  leftDoor.setAttribute("class", "left-door");
  rightDoor.setAttribute("class", "right-door");

  lift.appendChild(leftDoor);
  lift.appendChild(rightDoor);

  return lift;
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("up-button") || e.target.classList.contains("down-button")) {
    if (e.target.disabled) return;

    const direction = e.target.classList.contains("up-button") ? "up" : "down";
    const clickedFloor = parseInt(e.target.dataset.floor);
    
    // Disable the button
    e.target.disabled = true;
    e.target.classList.add("button-disabled");

    liftStatus(clickedFloor, direction, e.target);
  }
});

function liftStatus(clickedFloor, direction, button) {
  const lifts = document.querySelectorAll(`.${direction}-lift`);
  let pos;

  for (let i = 0; i < lifts.length; i++) {
    if (!lifts[i].classList.contains("busy")) {
      let onFloorVal = parseInt(lifts[i].getAttribute("onfloor"));

      if (onFloorVal === clickedFloor) {
        moveLift(clickedFloor, i, direction, button);
        return;
      }

      pos = i;
      moveLift(clickedFloor, pos, direction, button);
      return;
    }
  }

  if (pos === undefined) {
    if (direction === "up") {
      upTargetFloors.push({floor: clickedFloor, button: button});
    } else {
      downTargetFloors.push({floor: clickedFloor, button: button});
    }
  }
}

function moveLift(clickedFloor, pos, direction, button) {
  const elevators = document.getElementsByClassName(`${direction}-lift`);
  const elevator = elevators[pos];

  let currentFloor = elevator.getAttribute("onfloor");
  let duration = Math.abs(parseInt(clickedFloor) - parseInt(currentFloor)) * 2;

  elevator.setAttribute("onfloor", clickedFloor);

  elevator.style.transition = `transform ${duration}s linear`;
  elevator.style.transform = `translateY(-${
    100 * parseInt(clickedFloor) - 100
  }px)`;
  elevator.classList.add("busy");

  setTimeout(() => {
    elevator.children[0].style.transform = "translateX(-100%)";
    elevator.children[1].style.transform = "translateX(100%)";
  }, duration * 1000 + 1000);

  setTimeout(() => {
    elevator.children[0].style.transform = "none";
    elevator.children[1].style.transform = "none";
  }, duration * 1000 + 4000);

  setTimeout(() => {
    elevator.classList.remove("busy");

    // Re-enable the button
    button.disabled = false;
    button.classList.remove("button-disabled");

    const targetFloors = direction === "up" ? upTargetFloors : downTargetFloors;
    if (targetFloors.length) {
      const nextFloor = targetFloors.shift();
      moveLift(nextFloor.floor, pos, direction, nextFloor.button);
    }
  }, duration * 1000 + 7000);
}