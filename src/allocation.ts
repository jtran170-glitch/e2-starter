export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let assignedProducers = 2;

type ShiftResult = {
  assignedProducers: number;
  production: number;
  consumption: number;
  balance: number;
};

type BarChartRow = {
  label: string;
  value: number;
  color: string;
};

function calculateShift(producers: number): ShiftResult {
  const production = producers * 3;
  const consumption = 6;
  const balance = production - consumption;
  return {
    assignedProducers: producers,
    production: production,
    consumption: consumption,
    balance: balance,
  };
}

function renderCanvas(result: ShiftResult) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < result.assignedProducers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < result.assignedProducers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${result.assignedProducers} / 6`, 18, 76);
  const rows: BarChartRow[] = [
    { label: "Production", value: result.production, color: "#27766b" },
    { label: "Consumption", value: result.consumption, color: "#a44d23" },
  ];
  rows.forEach((row, index) => {
    const textY = 102 + index * 52;
    const barY = 110 + index * 52;
    ctx.fillStyle = "#233e43";
    ctx.fillText(`${row.label}: ${row.value}`, 18, textY);
    ctx.fillStyle = row.color;
    ctx.fillRect(18, barY, row.value * 14, 20);
  });
}

function renderText(result: ShiftResult) {
  readout.textContent =
    `Assigned: ${result.assignedProducers}/6 · Production: ${result.production} · Consumption: ${result.consumption} · Balance: ${
      result.balance > 0 ? "+" : ""
    }${result.balance}`;
}

function updateDisplay() {
  const result = calculateShift(assignedProducers);
  renderCanvas(result);
  renderText(result);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  assignedProducers = Math.max(0, assignedProducers - 1);
  updateDisplay();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  assignedProducers = Math.min(6, assignedProducers + 1);
  updateDisplay();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    assignedProducers = 2;
    updateDisplay();
  };
updateDisplay();
