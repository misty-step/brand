# Brass Hands (brasshands.com, Dribbble, Webflow, X)

Brass Hands, LLC is the New York studio of Kyle Anthony Miller (Dribbble credits shots to @kyleanthonymiller; the store links to his X and Instagram). Not to be confused with brasshand.ca, a different studio, which was not used. Sources read 2026-10-29: brasshands.com and /contact (Firecrawl's hosted Chrome, 1440 and 390, plus HTML), store.brasshands.com and portal.brasshands.com (text), dribbble.com/brasshands (24 recent shots downloaded at 1200px for review), webflow.com/@brasshands and its Made in Webflow pages (text), and the X account through xAI's X search (posts and captions only; X blocks direct reading). Private captures: `~/.cache/tmp/misty-design/refs/brasshands/` (site captures, `dribbble/shot_01-24.webp`, `dribbble/sheet_01-12.jpg`, `dribbble/sheet_13-24.jpg`).

**Who they are, from their own pages.** "For over a decade, Brass Hands has partnered with b2b tech startups from seed stage to IPO" (Webflow profile; Certified Partner since March 2022; projects "starting at $20,000"). Client names given: Square, Ease, Propel VC, Trainual, Rally, Abound, Demio, Medable (Webflow); Square, Ease, Sun Basket, Bestow, Squarespace, Cloudflare (Dribbble profile description). Today's positioning: "Design for the new industrial age… AI / Robotics / Defense / Industry", a merch store ("neo-industrial design system", "Made in the U.S.A.") and a client portal.

**The idea in one line:** brand identity as field equipment. Spec plates, unit IDs, seals, stippled 1-bit glyphs and condensed type, applied to AI, robotics, energy and defense startups.

## Mark
- **Own mark:** an orange square holding a stacked-bar glyph, beside a two-line BRASS / HANDS wordmark set in mono caps.
- **Client marks (Dribbble), the strongest work in the set:** "Synthetic" (an S built from stacked horizontal bars, cream on black, with a serif wordmark); "RE-IND / Homeland Machines" (a pixel-bitmap glyph, a circular seal with a star, and a data plate: "UNIT ID: HM-FU-01 / DIVISION: CORE PRODUCTION / STATUS: ACTIVE"); "TACK" (a dithered rainbow block mark over a heavy bitmap wordmark); "Cadrian" (a C in a square, and the same C rendered as stipple); "Overgrid" (a four-petal mark); "Portal" (a sunburst on yellow).
- Stated test from X: "Every brand should pass the shipping container test." Marks are drawn to work stencilled, embroidered, on a lanyard or as a QR code (a data-conference logo designed to become one).

## Type
- **brasshands.com:** one family, Construct Mono (commercial), and one rendered text size, 16px, for all visible text; titles and art live inside the case-study videos and images. There is no `h1` and no `h2` on the page.
- **Portfolio:** two recurring pairings. (a) A condensed transitional serif display ("We assist, not replace", "The future of American dynamism", "Predictive & Adaptive Intelligence", "MOVING AMERICA FORWARD") over mono body and labels. (b) Extended or bitmap display caps ("SP-01", "THERMION", "AI SYSTEMS REPORT", "THE LARGEST ENERGY TRANSFER IN AMERICAN HISTORY") with mono spec tables. Several client systems use Inter or Inter Tight as the text face (Cadrian's guide names Inter Tight).

## Colour
- **brasshands.com:** charcoal ground #242424 (oklch 26%), grey text #adb3b7 (7.3:1 on the ground), orange #ff6200 / #ff7235 / #ff781e for the logo square, the CTA and rules (#ff6200 on the ground 5.2:1). No light theme.
- **Portfolio:** mostly black and white with one signal colour per client (acid green CTAs, safety orange, yellow on black for Portal, IKB-like blue for a HUD diagram), plus a Bauhaus primaries set (red, yellow, blue circles) on Particle and MTS, and periwinkle or spectral photography for a few AI clients.

## Layout system
- **brasshands.com (Framer):** a header that reads like a spec plate (status lines: "STATUS: DEPLOYED IN SECTOR", "FIELD OPERATION: ACTIVE", "NEW YORK CITY"), bracketed nav items ("[ STORE ]", "[ PORTAL ]"), an outlined orange "ENGAGE DESIGN OPS" button, a client-logo marquee, then a very long column of case-study reels and stills (35180px at 1440). No radii anywhere.
- **Portfolio web comps:** the "Fellow" page is the most distinctive layout: the page sits inside a hairline frame whose four corner cells hold the mark, a ® seal, a bracket icon and a flag, with vertical rails carrying "BUILDING IN NEW YORK CITY" and a footer rail ("Born from the spirit of American Dynamism / V. 1.3"). Others use spec-sheet grids (labelled rows, unit IDs, capability tables) beside documentary photography.

## Hero pattern
- **brasshands.com:** no headline; the first screen is the spec-plate header and the first case-study reel (an autoplaying video, 1345×757). 27 words in the first viewport at 1440, 9 at 390.
- **Portfolio heroes:** a condensed serif headline of three to five words, one mono sentence, an acid or orange CTA, and a half-width image that is either stippled, character-dithered (a hand rendered in green and violet ASCII on navy) or a black-and-white documentary photo.

## Motion and animation
- **brasshands.com:** two autoplay case-study videos, an animated film-grain overlay (`grain-r3`, translating noise on an 833ms infinite loop) and a logo marquee (`bh-logobar`, 23s infinite). The remote capture measured 61–68% of pixels changing per 450ms at 1440 and 27–31% at 390: the busiest page in this set. Two reduced-motion rules, no pause control.
- **Portfolio:** stills and short reels on Dribbble and X ("in motion" posts); no live build to measure beyond the studio's own site.

## Copy voice
Military-industrial cosplay, consistently applied: "Design for the new industrial age"; "Status: Deployed in sector"; "ENGAGE DESIGN OPS"; on /contact "Engage command for mission briefing… REPORT ID: SYSTEM-DELTA-412… Design operations standing by. Transmission will be verified upon receipt."; "ALL WORK IS OUR OWN". Client copy in the portfolio leans on the same register ("UNIT ID", "CLEARANCE: LEVEL 3", "OPTIMIZE / ADAPT / EVOLVE") and on "not X" constructions ("We assist, not replace"; "The outcome isn't a slide, it's a running system").

## Canon read
brasshands.com: no `h1`, one mono face at one size (mono as running text), tracked caps and bracketed labels throughout, autoplay video plus animated grain with two reduced-motion rules and no pause control, a 35180px page. Portfolio comps: eyebrow pills, tricolon slogans, "not X, it's Y" lines; they are images, so contrast, focus and motion cannot be checked.

## Verdict: keep, for three layers only
Brass Hands is worth keeping as a reference, narrowly, because its portfolio is the best source in this set for **marks**, **one hero composition** and **the steps illustration**, and is a poor source for everything else.

- **Mark: keep.** Evidence: the Synthetic bar-built S, the RE-IND bitmap glyph and seal, the stippled Cadrian C, and the stated "shipping container test" are exactly the "few authored pixel pieces" the owner asked for, drawn as marks rather than as UI. The marks are monochrome, built on simple grids and survive small sizes and hard media.
- **Hero: keep one pattern.** Evidence: the Fellow and "American dynamism" pages pair a condensed serif headline, one mono sentence and a single treated image (stipple, character dither or documentary photo); that composition is distinctive, cheap to build and works with any palette. Use it as one hero option, not as the system.
- **Steps illustrations: keep.** Evidence: an AI consulting client's process cards ("Signal 01 / Transform 02 / Deploy 03 / Refine 04 / Measure 05 / Repeat 06"), each a stippled 1-bit glyph (rings, pixel bars, triple chevrons, a broken ring), are the closest thing in any reference to Misty Step's own offer and to its `steps` section.
- **Do not use for:** layout system (their own site has no headline, one type size and a 35180px reel; the comps are unbuilt images), motion (video and grain loops at 61–68% pixel change, two reduced-motion rules), colour (charcoal with safety orange, acid green and Bauhaus primaries are genre signals for defense tech), and copy voice (mission-briefing language is costume for a studio that sells a free 30-minute call and fixed-price builds; the canon also flags its "not X" lines and tricolons).

## Three moves for Misty Step
1. **One stippled 1-bit glyph per step.** Draw the call, the discovery and the build (and, on the stack page, core, playbooks, skills, Oracle) as monochrome stipple or pixel glyphs on one integer grid, static by default. MarkSmith owns the glyph family; LayoutA/B place them in `.s-steps` and `.diagram` items.
2. **A mark that passes the shipping container test.** Build the Misty Step mark from stacked bars or steps on a coarse grid, like Synthetic's S, and prove it stencilled, at 16px, as a favicon and as a one-colour patch. MarkSmith: ship the optical small variant the canon requires.
3. **Condensed serif headline, mono sentence, one treated image.** A hero option with a three-to-five-word condensed serif line, a single sentence, one action, and a stippled or halftone image of Misty Step's own bird-and-hand. TypeSetter supplies the condensed OFL display face; HeroSmith the composition; keep mono to the one sentence or to figures, never labels.

## Traps
- **Defense-tech costume.** Status lines, unit IDs, clearance levels and "engage" language would make a small consultancy look like it is pretending; the canon calls tracked mono labels and bracketed eyebrows tells.
- **Mono at one size with no headline.** The studio's own site has no hierarchy; do not take its layout.
- **Video and grain loops** with almost no reduced-motion handling.
- **Licensing.** Construct Mono is commercial, and several client systems sit on Inter or Inter Tight, which the canon treats as a default needing an argument.
- **Images, not builds.** Most of the portfolio is Dribbble comps; accessibility, motion and responsiveness are unproven.

## Links
- https://brasshands.com/ and https://brasshands.com/contact
- https://store.brasshands.com/
- https://dribbble.com/brasshands
- https://webflow.com/@brasshands
- https://x.com/brass_hands (linked from the site; X search returned the account as @brasshands) and https://x.com/kyleanthony
- X posts cited: https://x.com/brasshands/status/2032832073111585059 (Synthetic Brand System, "Sector: AI Bookkeeping"), https://x.com/brasshands/status/2066497035335799068 ("shipping container test"), https://x.com/brasshands/status/2066921628873654615 (NYC robotics design language), https://x.com/brasshands/status/2075550782313685241 (American Turbines concept)
