# Cloudflare (cloudflare.com)

Captured 2026-10-29 through Firecrawl's hosted Chrome 156 (off this Mac): 1440×900 and 390×844 (DPR 1), fold, four frames over 2.85s, six and five scroll positions, full page, style probe and animation dump; CSS rule counts read in-page from its 19 same-origin stylesheets. The page rendered light; its tokens are written with CSS `light-dark()` so a dark theme is prepared in the system, but no theme control was found on the home page. Method: `README.md`. Private captures: `~/.cache/tmp/misty-design/refs/cloudflare/`.

**The idea in one line:** one drenched orange panel. The first viewport is a rounded slab of Cloudflare orange with a faint dot-matrix of tiny tick marks and a sun rising at the bottom, and a centred white headline about the network.

## Mark
- The orange cloud (two tones of orange) beside a wide, tracked uppercase CLOUDFLARE wordmark in near-black. The cloud is the only colour in the nav.
- A red "Under attack?" link with an alert icon sits beside Login: a utility action promoted to the nav because it is the one visitors in trouble need.

## Type
- **Families:** STK Bureau Sans (400 and 500; commercial) for everything you read; Apercu Mono Pro (Colophon, commercial) for labels and figures. Kunst Grotesk files are also requested.
- **Display:** h1 56 / 500 / line-height 0.99 / −0.025em, white, centred, two lines at 1440 ("Everything we learned from powering / 20% of the Internet—yours by default"); 40 / 0.99 at 390. h2 48–56 / 500 / 1.0 / −0.025em.
- **Lead:** 19.2 / 400 / 1.2 / −0.025em. **Body:** 16 / 400. **Labels:** Apercu Mono 12–14.
- **Scale in use (1440):** 12, 13, 14, 16, 18, 19, 32, 48, 56: nine sizes.

## Colour
Strategy in canon terms: Drenched for the hero, Restrained everywhere else.

| Role | Value | OKLCH | Contrast |
|---|---|---|---|
| Ground | #ffffff, #fdfdfc | 100% | n/a |
| Ink | #262626 | 26.9% 0 | 15.1:1 |
| Ink 2 | #727272 / #707070 | 55.2% 0 | 4.8:1 |
| Brand orange (hero panel, text accents) | #ff5e1f; `theme-color` #ff4801 | 68.7% 0.208 39 | **white on it 3.06:1** (passes only as large text); #262626 on it 4.95:1 |
| Darker orange for text | #bf4c14 | 56.3% 0.160 42 | 4.9:1 |
| Hairlines | #f0f0f0 on 148 elements | | |

The "Kumo" token system (`--color-kumo-*`) writes each role as `light-dark(<light>, <dark>)` in OKLCH, the cleanest two-theme token pattern in this set.

## Layout system
- Containers of 1200, 1080 and 1480px; three-column rows with 16px gaps; two-column splits with 32px.
- The hero is an inset panel (8px from the viewport edges, rounded corners), not full-bleed. Below it, a field of dashed and hairline cell borders frames the sections.
- Radii are small: 1, 3, 4, 6, 8px, plus pills for the hero button and nav buttons.
- Astro, Tailwind; 22 View Transition rules.

## Hero pattern
Inside the orange panel: a centred two-line white h1, a two-line sub ("One platform for your apps, agents, and workforce. Build, secure, and scale without managing infrastructure."), and one white pill button, "Start building for free". A looping background video (`hero-background-video.mp4`, muted, `playsinline`, with a poster) supplies the rising glow; a faint, regular grid of tiny tick marks (a dot-matrix texture, lighter orange) covers the panel. 52 words in the first viewport at 1440, 56 at 390.

## Motion and animation
- **Hero:** the background video loops; the remote capture measured 0–0.09% change per 450ms at 1440 (the glow moves slowly) and 2–3% at 390.
- **Sections:** SVG illustrations fade from 0.5 to 1 over 2000ms with expo-out (`cubic-bezier(.19,1,.22,1)`); a `waveform-scroll` strip loops every 20s; customer logos scroll on an 80s `infinite-scroll`; a `marquee` and a `rotating-text-noise-drift` effect loop; 104 keyframes in total.
- **Reduced motion:** 13 reduced-motion rules. Whether the hero video pauses under `reduce` was not verified (the page has no pause control).

## Copy voice
Scale plainly stated, then a promise: "Everything we learned from powering 20% of the Internet—yours by default"; "Region: Earth"; "Cloudflare powers 45% of the Fortune 500"; "Build without boundaries"; "Pay only when your code runs". The page title is "Cloudflare: Build for the agent era".

## Canon read
White text on orange at 3.06:1 (fine at 56px, not for the sub at 19px), a radial glow, logo marquees and loops with no pause control, two `h1`s on the page, an em dash in the headline (the canon bans dashes in heroes), commercial faces.

## Three moves for Misty Step
1. **Drench one panel, not the page.** An inset hero slab in the brand colour, with everything after it on a plain ground. Colorist and HeroSmith: a "drenched" option where `--accent` fills the hero panel and `--accent-ink` carries the headline, checked at 4.5:1 for the sub, not just 3:1 for the display line.
2. **`light-dark()` tokens.** Cloudflare's Kumo tokens write both themes in one declaration (`--color-kumo-control: light-dark(#fff, oklch(20.5% 0 0))`). Colorist and LabCore: emitting colour options this way keeps light and dark composed side by side and reviewable as pairs.
3. **A utility action in the nav for the visitor in trouble.** "Under attack?" is the most specific nav item in this set. Misty Step's equivalent is the free 30-minute call for someone with one painful process; Copywriter and LayoutA/B can give it a named, specific nav action instead of "Contact".

## Traps
- **An orange slab with a sun is easy to turn into a sunset gradient.** The canon bans halos and aurora; keep any glow tied to a meaning (the stack, the step) or leave it out.
- **Accent as text ground.** White on #ff5e1f fails body-text contrast; small text on the panel must be darker ink or a darker orange.
- **Loops everywhere** (logo marquees, waveform, rotating text) with no pause.
- **Scale claims** ("20% of the Internet") are Cloudflare's to make; Misty Step's proof is small and specific.

## Captures (private)
`fc_desk_t0/t045/t090/t285.png`, `fc_desk_motion_sheet.jpg`, `fc_desk_s01-06.png`, `fc_desk_storyboard.jpg`, `fc_desk_full.png`, `fc_mob_*`, `texture_crop.png`, `logo_crop.png`, `fc_desk.json`, `fc_mob.json`.

## Links
- https://www.cloudflare.com/
