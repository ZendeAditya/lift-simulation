const floorInput = document.getElementById("floor-input");
const liftInput = document.getElementById("lift-input");
const submitButton = document.getElementById("submit-btn");
const container = document.getElementById("container");
const liftContainer = document.createElement("div");

let floorVal = "";
let liftVal = "";
let prevFloor = 0;

let targetFloors = [];

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
      createFloors(i, liftInput.value, parseInt(floorInput.value));
    }

    liftInput.value = "";
    floorInput.value = "";
  }
});

function createFloors(floors, lifts, totalFloors) {
  const floorDiv = document.createElement("div");
  floorDiv.setAttribute("class", "floordiv");

  const floorContainer = document.createElement("div");
  floorContainer.setAttribute("class", "floor");
  floorContainer.dataset.floor = floors;

  const buttonContainer = document.createElement("div");
  buttonContainer.setAttribute("class", "btn-div");

  if (floors < totalFloors) {
    const upButton = document.createElement("button");
    upButton.setAttribute("class", "up-down up-button");
    upButton.setAttribute("id", `up-${floors}`);
    upButton.innerText = "UP";
    upButton.dataset.floor = floors;
    buttonContainer.append(upButton);
  }

  if (floors > 1) {
    const downButton = document.createElement("button");
    downButton.setAttribute("class", "up-down down-button");
    downButton.setAttribute("id", `down-${floors}`);
    downButton.innerText = "Down";
    downButton.dataset.floor = floors;
    buttonContainer.append(downButton);
  }

  let floorNumber = document.createElement("p");
  floorNumber.setAttribute("class", "floorName");
  floorNumber.innerText = `Floor ${floors}`;

  buttonContainer.append(floorNumber);
  floorContainer.append(buttonContainer);
  floorDiv.append(floorContainer);
  container.append(floorDiv);

  if (floors === 1) {
    for (let j = 0; j < lifts; j++) {
      let lift = createLift();
      liftContainer.appendChild(lift);
    }
    
    liftContainer.setAttribute("class", "lift");
    floorContainer.append(liftContainer);
    floorDiv.append(floorContainer);
  }
}

function createLift() {
  let lift = document.createElement("div");
  lift.setAttribute("class", "lift-div");
  lift.setAttribute("onfloor", 1);
  lift.dataset.currentLocation = prevFloor;

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

    const clickedFloor = parseInt(e.target.dataset.floor);
    
    // Disable the button
    e.target.disabled = true;
    e.target.classList.add("button-disabled");

    liftStatus(clickedFloor, e.target);
  }
});

function liftStatus(clickedFloor, button) {
  const lifts = document.querySelectorAll(".lift-div");
  let nearestLift = null;
  let minDistance = Infinity;

  for (let i = 0; i < lifts.length; i++) {
    if (!lifts[i].classList.contains("busy")) {
      let onFloorVal = parseInt(lifts[i].getAttribute("onfloor"));
      let distance = Math.abs(onFloorVal - clickedFloor);

      if (distance < minDistance) {
        minDistance = distance;
        nearestLift = i;
      }
    }
  }

  if (nearestLift !== null) {
    moveLift(clickedFloor, nearestLift, button);
  } else {
    targetFloors.push({floor: clickedFloor, button: button});
  }
}

function moveLift(clickedFloor, pos, button) {
  const elevators = document.getElementsByClassName("lift-div");
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

    if (targetFloors.length) {
      const nextFloor = targetFloors.shift();
      liftStatus(nextFloor.floor, nextFloor.button);
    }
  }, duration * 1000 + 7000);
}