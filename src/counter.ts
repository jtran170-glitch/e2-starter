export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;
const shieldModel = new EventTarget();

type ShieldSnapshot = {
  charge: number;
  capacity: number;
  missing: number;
};

function getShieldSnapshot(): ShieldSnapshot {
  return {
    charge: count,
    capacity: 10,
    missing: 10 - count,
  };
}

function drawMeter(snapshot: ShieldSnapshot) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < snapshot.capacity; i++) {
    ctx.fillStyle = i < snapshot.charge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${snapshot.charge} / ${snapshot.capacity} shield`, 12, 100);
  readout.textContent =
    `Shield charge: ${snapshot.charge} / ${snapshot.capacity}`;
}

function renderStats(snapshot: ShieldSnapshot) {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${snapshot.charge} · Missing charge: ${snapshot.missing}`;
}

function inspectorListener(e: Event) {
  const event = e as CustomEvent<ShieldSnapshot>;
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(event.detail);
}

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(10, next));
  if (bounded === count) return;
  count = bounded;
  const snapshot = getShieldSnapshot();
  shieldModel.dispatchEvent(new CustomEvent("change", { detail: snapshot }));
}

shieldModel.addEventListener("change", (e) => {
  const event = e as CustomEvent<ShieldSnapshot>;
  drawMeter(event.detail);
});

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats(getShieldSnapshot());
  shieldModel.addEventListener("change", inspectorListener);
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  panel.remove();
  panel = null;
  shieldModel.removeEventListener("change", inspectorListener);
};
drawMeter(getShieldSnapshot());
