const zlib = require("zlib");
const fs = require("fs");
const path = require("path");
const S = 256;
const px = Buffer.alloc(S * S * 4);
const BG = [11, 16, 32], ACC = [77, 184, 255], WHT = [240, 246, 255];
function setP(x, y, c, a) {
  if (x < 0 || y < 0 || x >= S || y >= S) return;
  const i = (y * S + x) * 4;
  const r = px[i + 3] / 255;
  const na = a + r * (1 - a);
  if (na <= 0) return;  px[i] = Math.round((c[0] * a + px[i] * r * (1 - a)) / na);
  px[i + 1] = Math.round((c[1] * a + px[i + 1] * r * (1 - a)) / na);
  px[i + 2] = Math.round((c[2] * a + px[i + 2] * r * (1 - a)) / na);
  px[i + 3] = Math.round(na * 255);
}
function fillCircle(cx, cy, r, col) {
  const x0 = Math.max(0, Math.floor(cx - r - 2)), x1 = Math.min(S - 1, Math.ceil(cx + r + 2));
  const y0 = Math.max(0, Math.floor(cy - r - 2)), y1 = Math.min(S - 1, Math.ceil(cy + r + 2));  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
    const a = d >= r + 0.75 ? 0 : d <= r - 0.75 ? 1 : (r + 0.75 - d) / 1.5;
    if (a > 0) setP(x, y, col, a);
  }
}
const m = 10, R = 56;
for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
  const dx = Math.max(m + R - x, x - (S - 1 - m - R), 0);
  const dy = Math.max(m + R - y, y - (S - 1 - m - R), 0);  const d = Math.hypot(dx, dy) - R;
  const a = Math.max(0, Math.min(1, 0.5 - d));
  if (a > 0) setP(x, y, BG, a);
}
for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
  const a = Math.max(0, 1 - Math.hypot(x - 128, y - 132) / 110) * 0.16;
  if (a > 0) setP(x, y, ACC, a);
}
fillCircle(120, 142, 56, WHT);
fillCircle(112, 126, 50, BG);
fillCircle(168, 92, 13, WHT);
fillCircle(184, 78, 9, WHT);
fillCircle(150, 62, 5, ACC);
fillCircle(166, 50, 4, ACC);
fillCircle(180, 40, 3, ACC);
fillCircle(150, 170, 4, BG);
let CRC_T = null;
function crc32(buf) {
  if (!CRC_T) { CRC_T = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; CRC_T[n] = c >>> 0; } }  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_T[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(size, buf) {
  const ihdr = Buffer.alloc(13);  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6;
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) { raw[y * (size * 4 + 1)] = 0; buf.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4); }  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}
const out = path.join(__dirname, "resources");
fs.writeFileSync(path.join(out, "icon.png"), png(S, px));
const T = 32, K = S / T, tray = Buffer.alloc(T * T * 4);
for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
  let r = 0, g = 0, b = 0, a = 0;  for (let dy = 0; dy < K; dy++) for (let dx = 0; dx < K; dx++) {
    const i = ((y * K + dy) * S + (x * K + dx)) * 4;
    r += px[i]; g += px[i + 1]; b += px[i + 2]; a += px[i + 3];
  }
  const n = K * K, j = (y * T + x) * 4;  tray[j] = Math.round(r / n); tray[j + 1] = Math.round(g / n); tray[j + 2] = Math.round(b / n); tray[j + 3] = Math.round(a / n);
}
fs.writeFileSync(path.join(out, "tray.png"), png(T, tray));
console.log("icon.png + tray.png generated");
