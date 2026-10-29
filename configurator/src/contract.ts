export type Layer = 'mark'|'type'|'color'|'layout'|'hero'|'motion'|'copy';
export interface Ref { name: string; url: string; what: string }      // what this option learns from that reference
export interface OptionMeta {
  id: string; layer: Layer; label: string;                      // short picker label
  summary: string;                                              // one sentence: what it is, why it suits Misty Step
  refs: Ref[];                                                  // at least one
  origin?: 'A'|'B'|'C'|'baseline'|'new'|'r2';                  // 'r2': round 2 (after Phaedrus's 29 Oct pick); listed first
}
export interface Ctx { page: 'studio'|'stack'; theme: 'light'|'dark'; reducedMotion: boolean; viewport: 'phone'|'desktop' }

// MARK: the Misty Step symbol (and optional custom wordmark). Colours only via currentColor / var(--accent) / var(--ink*) so any palette works.
export interface MarkOption extends OptionMeta { layer: 'mark';
  svg(o: { size: number; title: string }): string;
  wordmark?(o: { name: string }): string;       // custom lockup; otherwise the renderer sets the name in var(--font-display)
  animateIn?(el: Element, ctx: Ctx): () => void; // once per load; never runs when ctx.reducedMotion
}

// TYPE: self-hosted OFL/Apache faces + tokens. No layout/colour decisions.
export interface TypeOption extends OptionMeta { layer: 'type';
  faces: { family: string; src: string; weight: string; style?: string; unicodeRange?: string }[]; // src = new URL('./fonts/x.woff2', import.meta.url).href
  tokens: Record<'--font-display'|'--font-body'|'--font-ui'|'--font-mono'
    |'--display-weight'|'--display-tracking'|'--display-leading'|'--display-transform'
    |'--body-weight'|'--body-leading'|'--measure'
    |'--step--1'|'--step-0'|'--step-1'|'--step-2'|'--step-3'|'--step-4'|'--step-5', string>; // fluid clamp() sizes; --step-0 = body
  license: string;                               // e.g. 'OFL-1.1: Inter (rsms), JetBrains Mono'; licence files beside the fonts
}

// COLOR: role tokens for both themes, designed (not inverted). OKLCH preferred.
export type ColorTokens = Record<'--bg'|'--bg-2'|'--bg-3'|'--ink'|'--ink-2'|'--ink-3'|'--line'|'--line-2'
  |'--accent'|'--accent-ink'|'--accent-2'|'--focus'|'--selection'|'--field-1'|'--field-2'|'--field-3', string>;
// --bg page, --bg-2 raised, --bg-3 sunken/code; --ink text, --ink-2 secondary, --ink-3 faint (still AA for its use);
// --accent + --accent-ink (text on accent, >= 4.5:1); --accent-2 optional second ink; --field-1..3 colours handed to motion backgrounds.
export interface ColorOption extends OptionMeta { layer: 'color'; light: ColorTokens; dark: ColorTokens }

// LAYOUT: the page system. Styles nav, all section types, footer, buttons. Consumes tokens only; never sets font families or colours directly.
export interface LayoutOption extends OptionMeta { layer: 'layout'; css: string } // every rule scoped under html[data-layout="<id>"]

// HERO: the opening section. Renders inner HTML of <section class="hero">. Consumes tokens only.
export interface HeroCtx extends Ctx { content: PageContent['hero']; brand: string; mark(size: number): string; wordmark(): string }
export interface HeroOption extends OptionMeta { layer: 'hero';
  render(ctx: HeroCtx): string;   // must contain h1.hero-title, p.hero-sub, .actions > a.btn.btn-primary (+ optional a.btn.btn-quiet), optional .hero-proof, optional div.hero-visual[data-motion-slot]
  css: string;                    // scoped under html[data-hero="<id>"]
  motionHost: 'panel'|'full'|'page'; // panel: mount in .hero-visual; full: full-bleed behind the hero; page: fixed page background
}

// MOTION: ambient background + entrance choreography + micro-interactions.
export interface MotionCtx extends Ctx { colors: { bg: string; ink: string; accent: string; field1: string; field2: string; field3: string }; dprCap: number; tune?: Record<string, number> } // tune: the lab's Tune panel values for this option, keyed by MotionParam.key
export interface MotionHandle { pause(): void; resume(): void; update(ctx: MotionCtx): void; destroy(): void }
// A tunable number the lab shows as a slider (or a select when `options` names each integer value).
// `value` is this option's default; the background receives overrides in MotionCtx.tune and clamps them.
export interface MotionParam { key: string; label: string; min: number; max: number; step: number; value: number; options?: string[] }
export interface MotionOption extends OptionMeta { layer: 'motion';
  renderer?: 'webgl'|'canvas2d'|'none'; // Defaults to webgl when background exists, otherwise none; drives off-Mac proof.
  background?: { load(): Promise<{ mount(host: HTMLElement, ctx: MotionCtx): MotionHandle }> }; // lazy; host is sized by the hero/page
  entrance: { css: string };     // scoped html[data-motion="<id>"]; animates [data-enter] -> [data-enter].is-in; respect [data-reduced-motion="1"] (show final)
  interaction?: { css: string }; // hover/press/focus micro-interactions for .btn, .item, a.link
  params?: MotionParam[];        // optional tuner; values travel in LabState.tune[<id>]
  budget: { gzipKB: number; frameMs: string; note: string };   // measured, not guessed
}
// Background rules: no work on the critical path; draw nothing until visible; stop when offscreen or tab hidden; cap devicePixelRatio (<= 1.5) and render at reduced resolution where the look allows; step quality down when frames drop; under reduced motion draw one still frame and stop; respond to update() for theme/palette changes; release the GL context on destroy. Target <= 60 KB gzip incl. libraries (raw WebGL/OGL preferred; three.js only if it earns 190 KB) and <= 4 ms/frame on this Mac.

// COPY: the words for both pages, from facts. Voice and strategy differ; facts never do.
export interface CopyOption extends OptionMeta { layer: 'copy'; voice: string; pages: { studio: PageContent; stack: PageContent } }

export interface Link { label: string; href: string }
export interface PageContent {
  brand: string; nav: Link[]; navCta?: Link;
  hero: { headline: string; sub: string; primary: Link; secondary?: Link; proof?: string };
  sections: Section[];
  footer: { line: string; links: Link[] };
}
export type Section =
 | { type: 'steps';    id: string; title: string; intro?: string; items: { label: string; title: string; terms?: string; body: string }[] }
 | { type: 'work';     id: string; title: string; intro?: string; groups: { label: string; items: { name: string; body: string; href: string; host: string }[] }[] }
 | { type: 'points';   id: string; title: string; intro?: string; items: { title: string; body: string }[] }
 | { type: 'diagram';  id: string; title: string; intro?: string; nodes: { id: string; label: string; body: string; count?: string; href?: string }[] }
 | { type: 'install';  id: string; title: string; intro?: string; harnesses: { id: string; name: string; lines: string[]; note?: string }[] }
 | { type: 'evidence'; id: string; title: string; intro?: string; rows: { label: string; passed: number; total: number; highlight?: boolean }[]; limits: string[]; href: string }
 | { type: 'code';     id: string; title: string; caption: string; code: string }
 | { type: 'cta';      id: string; title: string; body: string; primary: Link; secondary?: Link };
