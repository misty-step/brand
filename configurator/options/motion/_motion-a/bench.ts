// Frame-cost bench for MotionA's fields. Serve the configurator (npm run dev) and open
// /options/motion/_motion-a/bench.html in a browser with WebGL. For each field and host size
// it times one draw plus a 1px readback (forces the GPU to finish) over 120 frames, and the
// CPU still once; results land in <pre id="out"> and window.__bench as JSON.
import type { MotionCtx } from '../../../src/contract';
import { palette } from './color';
import type { Frame, GL, HostKind, RowPainter, Scene } from './field';
import * as mist from '../dither-mist/field';
import * as terraces from '../terraces/field';
import * as voxel from '../voxel-stairs/field';

declare global { interface Window { __bench?: unknown } }

const FIELDS: { id: string; gl2: boolean; depth: boolean; cell: number; stillCell: number; q: number; t0: number; scene(gl: GL): Scene; still(f: Frame): RowPainter }[] = [
  { id: 'dither-mist', gl2: false, depth: false, cell: 4, stillCell: 4, q: 5, t0: 37, ...mist },
  { id: 'terraces', gl2: false, depth: false, cell: 2, stillCell: 2, q: 3, t0: 40, ...terraces },
  { id: 'voxel-stairs', gl2: true, depth: true, cell: 4, stillCell: 4, q: 1, t0: 14, ...voxel },
];
const HOSTS: { name: string; w: number; h: number; kind: HostKind }[] = [
  { name: 'full 1440x820', w: 1440, h: 820, kind: 'full' },
  { name: 'panel 520x680', w: 520, h: 680, kind: 'panel' },
  { name: 'panel 358x220', w: 358, h: 220, kind: 'panel' },
];
const ctx: MotionCtx = {
  page: 'studio', theme: 'dark', reducedMotion: false, viewport: 'desktop', dprCap: 1.5,
  colors: { bg: 'oklch(0.17 0.002 17.3)', ink: 'oklch(0.917 0.015 98.3)', accent: 'oklch(0.67 0.1 186.6)', field1: 'oklch(0.273 0.002 67.7)', field2: 'oklch(0.337 0.047 188.8)', field3: 'oklch(0.427 0.115 254.6)' },
};
const stats = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return { median: +s[Math.floor(s.length / 2)].toFixed(2), p95: +s[Math.floor(s.length * 0.95)].toFixed(2) };
};

async function run() {
  const pal = palette(ctx, document.body);
  const results: Record<string, unknown>[] = [];
  let renderer = 'none';
  for (const F of FIELDS) {
    for (const H of HOSTS) {
      const frameFor = (cell: number, t: number): Frame => ({ t, cols: Math.ceil(H.w / cell), rows: Math.ceil(H.h / cell), cell, q: F.q, pal, kind: H.kind, ptr: [0, 0, 0], clear: new Float32Array(16), nClear: 0 });
      const still = frameFor(F.stillCell, F.t0);
      const buf = new Uint8ClampedArray(still.cols * still.rows * 4);
      const s0 = performance.now();
      F.still(still)(buf, 0, still.rows);
      const stillMs = +(performance.now() - s0).toFixed(1);
      const canvas = document.createElement('canvas');
      const f = frameFor(F.cell, F.t0);
      canvas.width = f.cols; canvas.height = f.rows;
      const attrs = { alpha: true, antialias: false, depth: F.depth, preserveDrawingBuffer: false };
      const gl = (F.gl2 ? canvas.getContext('webgl2', attrs) : canvas.getContext('webgl', attrs)) as GL | null;
      if (!gl) { results.push({ field: F.id, host: H.name, stillMs, gpu: 'no WebGL' }); continue; }
      const info = gl.getExtension('WEBGL_debug_renderer_info');
      renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : String(gl.getParameter(gl.RENDERER));
      const scene = F.scene(gl);
      const px = new Uint8Array(4), times: number[] = [];
      gl.viewport(0, 0, f.cols, f.rows);
      for (let i = 0; i < 130; i++) {
        f.t += 1 / 30;
        const a = performance.now();
        scene.draw(f);
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
        if (i >= 10) times.push(performance.now() - a);
        if (i % 10 === 9) await new Promise(requestAnimationFrame);
      }
      scene.dispose();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      results.push({ field: F.id, host: H.name, buffer: `${f.cols}x${f.rows}`, drawMs: stats(times), stillMs });
    }
  }
  const out = { renderer, ua: navigator.userAgent, results };
  window.__bench = out;
  document.getElementById('out')!.textContent = JSON.stringify(out, null, 2);
}
void run();
