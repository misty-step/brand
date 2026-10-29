import type { HeroOption, MotionOption, MotionCtx, MotionHandle } from '../contract';
export class MotionLifecycle {
  private handle?: MotionHandle;
  private heroObserver: IntersectionObserver;
  private drawObserver: IntersectionObserver;
  private heroVisible = false;
  private drawVisible = false;
  private stopped: boolean;
  private dead = false;
  private loading = false;
  private host: HTMLElement;
  private ctx: MotionCtx;
  private visibility = () => void this.sync();

  constructor(private option: MotionOption, hero: HeroOption, ctx: MotionCtx, paused: boolean) {
    this.ctx = ctx;
    this.stopped = paused;
    const root = document.querySelector<HTMLElement>('[data-hero-root]')!;
    if (hero.motionHost === 'page') {
      this.host = document.querySelector<HTMLElement>('[data-motion-root]')!;
    } else if (hero.motionHost === 'full') {
      this.host = document.createElement('div');
      this.host.className = 'hero-motion-host';
      this.host.setAttribute('aria-hidden', 'true');
      root.prepend(this.host);
    } else {
      this.host = root.querySelector<HTMLElement>('[data-motion-slot]')!;
      if (!this.host) {
        this.host = document.createElement('div');
        this.host.className = 'hero-visual';
        this.host.dataset.motionSlot = '';
        this.host.setAttribute('aria-hidden', 'true');
        root.append(this.host);
      }
    }
    this.heroObserver = new IntersectionObserver(entries => {
      this.heroVisible = entries[0].isIntersecting;
      void this.sync();
    });
    this.drawObserver = new IntersectionObserver(entries => {
      this.drawVisible = entries.some(entry => entry.isIntersecting);
      void this.sync();
    });
    this.heroObserver.observe(root);
    this.drawObserver.observe(this.host);
    document.addEventListener('visibilitychange', this.visibility);
  }

  private async sync() {
    if (this.dead) return;
    if (!this.handle && !this.loading && this.option.background && this.heroVisible && !document.hidden) {
      this.loading = true;
      // The semantic first screen paints before any background import.
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      if (this.dead) return;
      try {
        const module = await this.option.background.load();
        if (this.dead) return;
        if (document.hidden || !this.heroVisible) {
          this.loading = false;
          return;
        }
        this.handle = module.mount(this.host, this.ctx);
        this.handle.update(this.ctx);
        // Signature modules may attach their only canvas to the title instead of the panel.
        const canvas = this.host.querySelector('canvas') ?? document.querySelector('[data-hero-root] canvas');
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          this.drawVisible = rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
          this.drawObserver.disconnect();
          this.drawObserver.observe(canvas);
        }
      } catch (error) {
        console.error('Motion background failed', error);
      }
      this.loading = false;
    }
    if (!this.handle) return;
    if (this.dead) {
      this.handle.destroy();
    } else if (this.heroVisible && this.drawVisible && !document.hidden && !this.stopped && !this.ctx.reducedMotion) {
      this.handle.resume();
    } else {
      this.handle.pause();
    }
  }

  update(ctx: MotionCtx) {
    if (this.dead) return;
    this.ctx = ctx;
    this.handle?.update(ctx);
    void this.sync();
  }

  pause(value: boolean) {
    if (this.dead) return;
    this.stopped = value;
    void this.sync();
  }

  destroy() {
    this.dead = true;
    this.heroObserver.disconnect();
    this.drawObserver.disconnect();
    document.removeEventListener('visibilitychange', this.visibility);
    this.handle?.destroy();
    this.host.replaceChildren();
  }
}
