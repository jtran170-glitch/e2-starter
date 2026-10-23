export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;

const pendingList = document.querySelector<HTMLOListElement>("#rover-pending")!;
const queueStatus = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;
const runBtn = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearBtn = document.querySelector<HTMLButtonElement>("#rover-clear")!;

type Direction = {
  name: string;
  dx: number;
  dy: number;
};

const headings: Direction[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

type Command = {
  label: string;
  execute(): void;
};

let x = 2;
let y = 2;
let direction = 0;
let queue: Command[] = [];

const createForwardCommand = (): Command => ({
  label: "Forward",
  execute: () => {
    const dir = headings[direction];
    x = Math.max(0, Math.min(4, x + dir.dx));
    y = Math.max(0, Math.min(4, y + dir.dy));
  },
});

const createRightCommand = (): Command => ({
  label: "Right",
  execute: () => {
    direction = (direction + 1) % 4;
  },
});

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    headings[direction].name
  }`;
}

function updateQueueDisplay() {
  pendingList.innerHTML = "";
  queue.forEach((cmd) => {
    const li = document.createElement("li");
    li.textContent = cmd.label;
    pendingList.appendChild(li);
  });
  queueStatus.textContent = queue.length === 0
    ? "Empty"
    : `${queue.length} pending`;
  runBtn.disabled = queue.length === 0;
  clearBtn.disabled = queue.length === 0;
}

function enqueue(command: Command) {
  queue.push(command);
  updateQueueDisplay();
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  enqueue(createForwardCommand());
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  enqueue(createRightCommand());
};

runBtn.onclick = () => {
  while (queue.length > 0) {
    const cmd = queue.shift()!;
    cmd.execute();
  }
  drawRover();
  updateQueueDisplay();
};

clearBtn.onclick = () => {
  queue = [];
  updateQueueDisplay();
};

document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  queue = [];
  drawRover();
  updateQueueDisplay();
};
drawRover();
updateQueueDisplay();
