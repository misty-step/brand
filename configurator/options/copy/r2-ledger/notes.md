# r2-ledger: the work order

## Voice
Written like a good work order: defined terms used the same way every time (the call, discovery, the quick win, the plan, a build), numbers with their units, and every deliverable tied to when it arrives and what it costs. Short declaratives carry the facts; each section allows itself one longer sentence that says why.

## Headline candidates: studio (mistystep.io)
1. **Ship one thing. Quote the rest.** (hero) The work order speaking to the worker: one quick win shipped, every further project quoted. Halves of 15 and 15 characters, so it sets at full size on a 390 phone.
2. **$4,500 buys two weeks and one quick win.** Price-first, as only a work order would print it. Rendered against #1 in the baseline: it wraps to two lines at 1440, repeats the price the sub already states and leaves the plan out, so #1 stays the hero.
3. **The order of work.** (steps title) Sequence and work order in four words.
4. **The fine print, in large type.** (terms title) The terms are the pitch, and the condensed capitals make the line literal.
5. **Bring one process.** (closing statement) The whole brief for the call.
6. **The plan can say no.** (terms entry) The most trust-building fact in the offer, in five words.
7. **What it costs. What it should return.** (inside the Discovery entry as "two numbers") The plan's two columns; "should" keeps expected value honest.
8. **Only the call is free.** (hero proof line, as "Only the 30-minute call is free.") Fine print where a work order keeps it: the lower corner.
9. **We ship in the first two weeks.** True and plain, but it is first-person observation, which belongs to CopyB's register.
10. **One shipped. The rest quoted.** Cut: "One shipped" has no noun, so the first read is a riddle.

## Headline candidates: stack (stack.mistystep.io)
1. **Done means the check passes.** (hero) The core's own definition of done ("Done is that check passing on the real path") in five words, with no jargon.
2. **Eight lines. Every session.** (core section) Size and duty cycle of the always-on core, countable in the code block beside it.
3. **Six parts. One always on.** (diagram) The bill of materials, with the one part that never unloads.
4. **Every handoff gets a brief.** (briefing contract) mistystack's own work order: six fields, and no Oracle means no dispatch.
5. **Six tasks, one run each.** (evidence) The trial's first limit as its title, so the bars cannot be read without it.
6. **Native installs. No custom installer.** (install) A spec line taken from the README's own boundary.
7. **The method is plain text.** (closing statement) Every rule and skill is a Markdown file you can read before you run it.
8. **Name the check before the work.** Core line 2 as an instruction; the strongest alternative hero.
9. **Finish the work you were given.** Core line 6 verbatim; a work order's first rule. Unused, kept for a points title.
10. **Every fact has one home.** Core line 4 verbatim; it shows the method is engineering hygiene. Unused.

## Where each specific comes from
- Offer terms, prices, minutes and the credit: `OFFER` in `src/content/facts.ts`. "$4,500" and the "$2,250" credit are computed from `OFFER.discoveryPrice`, so they cannot drift. "A few specific projects" and "you keep the plan" are from mistystep.io. "You request an open start time … confirm it by email … we propose a two-week discovery" is from mistystep.io/book.
- Every count in the copy is computed: eight lines from `CORE`, six parts and seven playbooks from `STACK_NODES`, six tasks and five limits from `TRIAL`, and five products from `WORK_GROUPS`, all in facts.ts. The playbook names come from `skills/misty/playbooks/`. "Seven chapters" is `docs/guide/01` to `07`, "MIT licensed" is the repository licence and "no custom installer" is from the README. The six briefing fields and "a brief with no Oracle returns to shaping" are from `skills/misty/SKILL.md`. All of these are in the public mistystack repo at master c72698f, read 2026-10-29.
- Product lines: Poppycock (3 to 12 players) from its page's description. Linejam (2 to 8 players; you see only the line before yours; nine rounds) and "Parlor powers Poppycock" from parlor.mistystep.io. Parlor's packages and licence also come from parlor.mistystep.io. Landmark (tags and conventional commits; no GitHub token, no model key) is from its get-started page, and Cantrip (shortcut, speak, shortcut; transcribes on your CPU) from its README.

## Facts I wished I had (questions for Phaedrus)
- What one real quick win looked like, with any details removed. The hero says "Ship one thing", but the page cannot yet say what kind of thing ships.
- Which day the plan arrives, and whether there is a readout. CopyEditor has asked; until then, the only dates on the page are 30 minutes, two weeks and 30 days.
- How many projects "a few" usually means.
- Whether the client owns the quick win outright. "The software is yours to keep" is stated only for builds.
- How expected value is estimated (time horizon; savings and gain), and how the value share is measured on larger work.
- A typical build price range or duration, if one can be published.
- How soon discovery can start after the call.
- Proposed for facts.ts: `hello@mistystep.io`, which is public on mistystep.io/book. It was cut from the footer because it is not in facts.ts.
- Proposed for facts.ts, if they should be published: "no hourly rates", "no tiers" and "no free audits". They are in the round 2 brief's brand truth, but in neither facts.ts nor the live site, so this copy does not use them.
