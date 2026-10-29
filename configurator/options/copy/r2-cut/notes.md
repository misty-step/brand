# r2-cut: the editor's cut (round 2 copy)

This is the strongest complete copy for both pages, taken from the two round-2 writers and rewritten where neither line held. CopyA wrote `r2-ledger` (the work order) and CopyB wrote `r2-field-notes` (field notes from a studio that builds). The spine is the brand truth: you only step to a place you can see. On the studio page that means two weeks to see what is worth building before any build is signed. On the stack page it means the check is named before the work. The name is explained once, in the studio footer.

## Voice
An engineer who ships, talking across a table: short declaratives carry the numbers, and each section allows one longer sentence for the reason. Every line points at something the visitor can open, price or run.

## Headline candidates

Line breaks were measured on the Boat worker in the baseline (`~/.cache/tmp/misty-design/r2/copy/render/probe1/index.json`). The horizon hero sizes the h1 to its best two-line split.

### Studio (mistystep.io)
1. **Two weeks to see what’s worth building.** (chosen; CopyB's line, my contraction) The spell's "a place you can see" in business words, and true to the plan. "what’s" moves the break to "TWO WEEKS TO SEE | WHAT’S WORTH BUILDING." at 1440, 390 and 320; "what is" broke as "SEE WHAT | IS WORTH".
2. **Ship one thing. Quote the rest.** (CopyA) The discovery's two outputs written as orders. One line at 1440.
3. **Even the discovery ships.** (mine) The differentiator for anyone who has paid for a discovery made of slides. Risk: "discovery" is trade jargon.
4. **See it work. Then decide.** (mine) The quick win comes before any build is signed. Risk: it reads like a free trial, and the discovery is paid.
5. **We'll tell you what not to build.** (CopyB) A surprising line from a studio that sells builds, and true to "No build when the plan says not to".
6. **Know what it’s worth before we build it.** (mine) Expected value on every project. Breaks as "KNOW WHAT IT’S WORTH | BEFORE WE BUILD IT."
7. **Look before you build.** (mine) The idiom turned to the offer. Risk: it reads as a pun.
8. **Bring one process.** (CopyA) The whole brief for the call in three words. Used as the close.
9. **The fine print, in large type.** (CopyA) The terms as the pitch, literal in Sofia Sans Extra Condensed. Used as the terms title.
10. **Poppycock needed rooms, so we built Parlor.** (CopyB) The studio builds the infrastructure it needs. Used as the work title.

### Stack (stack.mistystep.io)
1. **Before work, name the check.** (chosen; mine) The opening words of the core's second line, verbatim, and the sub says so. One line at 1440; "BEFORE WORK, | NAME THE CHECK." at 390 and 320.
2. **Done means the check passes.** (CopyA) The same line's definition of done. Used as the close, so the page opens and closes on the two halves of one rule.
3. **Our agents read this first.** (CopyB) First person, true, and it points at the core printed next.
4. **Eight lines. Every session.** (CopyA and CopyB) The core's size and duty cycle, countable in the block below. Used as the core title.
5. **Every handoff gets a brief.** (CopyA) The misty skill's briefing contract with its six real fields. Used as a section title.
6. **Six parts. One always on.** (CopyA) The architecture in five words. Used as the diagram title.
7. **The method is plain text.** (CopyA) Every part is a Markdown file in an MIT-licensed repository.
8. **Read it. Then make it yours.** (CopyB) Points at guide chapter 7, "Make it yours".
9. **Finish the work you were given.** (core line 6) Anyone who has watched an agent stop halfway knows why it is there (CopyB's case).
10. **Shipped for OMP first.** (mine, after Main's harness ruling) The install title states the status: OMP is shipped and the other adapters are in progress (#591). It replaces CopyA's "Native installs. No custom installer.", which the ruling bars.

## Credits, line by line
Studio
- Hero headline: CopyB. Proof "Only the 30-minute call is free.": CopyA.
- "The order of work." and the item titles "On the call", "In the two weeks" and "After the plan": CopyA. The intro and the discovery body are CopyA's, lightly edited. The derived "$2,250" credit is CopyA's idea; here it is computed from `OFFER.discoveryPrice`.
- Work title: CopyB. The intro rewrites CopyB's list. The Landmark changelog detail is CopyB's; "your CPU does the transcribing" is CopyA's.
- "The fine print, in large type.", "Scope and price come first.", "The plan can say no." and the close "Bring one process.": CopyA.
- Mine: the hero sub, the secondary action, the Poppycock, Linejam and Parlor entries, the retainer item and the footer line. The `hello@mistystep.io` link follows Main's ruling that the address is public on mistystep.io/book.

Stack
- "Eight lines. Every session.": CopyA and CopyB. "Six parts. One always on.", the brief section and its six field bodies, "Six tasks, one run each." with its limits sentence, and the proof line "Install commands for OMP, Claude Code, Codex and pi.": CopyA.
- Close "Done means the check passes.": CopyA's stack hero, moved to the close as the bookend. The close body rewrites CopyA's "The method is plain text." body without its list of three.
- Mine: the hero headline and sub, the diagram intro and the six node bodies.

## Claims beyond facts.ts, with their sources
Each claim was checked on 2026-10-29 against the product's own site or repository.
- Poppycock, "a bluffing game for 3 to 12 friends": https://github.com/misty-step/poppycock (README: "A phone-first bluffing party game for 3–12 people ... exactly one truth") and https://poppycock.mistystep.io/ (meta: "Write a believable bluff. Find the truth. A free, untimed party game for 3–12 friends, powered by Parlor.").
- Poppycock, "make the wrong answer sound very right": https://parlor.mistystep.io/ ("a bluffing game about making the wrong answer sound very, very right").
- Linejam, "2 to 8 players": https://github.com/misty-step/linejam/blob/master/convex/game.ts (`minPlayers: 2`, `maxPlayers: 8`), and https://parlor.mistystep.io/ ("2–8 players").
- Linejam, "you see only the line before yours", "the lines climb from one word to five and back", "everyone reads the poems aloud": https://github.com/misty-step/linejam (README: "seeing only the line before theirs. Nine rounds follow `1, 2, 3, 4, 5, 4, 3, 2, 1` words. Then everyone reads the complete poems aloud.").
- Parlor, "guest identity, rooms, presence and matches ... Convex and React" and "MIT licensed": https://parlor.mistystep.io/ (meta description; "Open source, MIT licensed") and https://github.com/misty-step/parlor (README: "MIT licensed").
- "Poppycock and Linejam run on it": https://parlor.mistystep.io/ ("Parlor powers Poppycock"; Linejam is listed under "Same rooms, guests, presence, and matches underneath"), the Poppycock README ("How Parlor is used") and the Linejam README ("Parlor is the vendored ...").
- Work title "Poppycock needed rooms, so we built Parlor.": https://parlor.mistystep.io/ ("Poppycock is a bluffing game ... It's also why Parlor exists. The rooms, guest identities, presence, and matches are shared.").
- Landmark, "reads a repository's tags and conventional commits": https://misty-step.github.io/landmark/get-started.html ("It reads the checkout's tags and conventional commits"). "Writes the changelog and the release notes": https://github.com/misty-step/landmark (description: "conventional commits → technical changelogs → LLM-synthesized user-facing release notes").
- Landmark, "prepares mistystack's changelog": https://github.com/misty-step/mistystack#release ("Landmark prepares a generated changelog PR, then publishes only its verified, landed commit.").
- Cantrip, "local-first dictation for Linux", "press a shortcut, speak, press it again", "your CPU does the transcribing": https://github.com/misty-step/cantrip (description; README: "Press a shortcut, speak, press it again. Cantrip transcribes on your CPU.").
- "All five are ours and open to inspect": all five repositories are public (`gh api repos/misty-step/<name>`). Four are MIT and Poppycock has no licence, so the copy avoids "open source".
- `hello@mistystep.io`: https://mistystep.io/book.
- Oracle node, "a check outside the agent that can disprove completion": https://github.com/misty-step/mistystack/blob/master/DOMAIN.md. The playbook list: https://github.com/misty-step/mistystack/tree/master/skills/misty/playbooks. Routing to a playbook or a skill, principles read when their trigger applies, and the briefing contract with "A brief with no Oracle returns to shaping instead of dispatch.": https://github.com/misty-step/mistystack/blob/master/skills/misty/SKILL.md. "Reads the task and chooses the playbook and skills": https://github.com/misty-step/mistystack/blob/master/docs/guide/02-misty.md.
- Install status, "Shipped for OMP first" and "The Claude Code, Codex and pi adapters are in progress (#591)": https://github.com/misty-step/mistystack/tree/master/docs/guide (README: "OMP shipped first; other adapters and their proofs are tracked by #591, not claimed as shipped here") and https://github.com/misty-step/mistystack/issues/591 (open). The install commands are in facts.ts, read from each harness's reference file. Main's ruling of 2026-10-29: show the commands for all four, call only OMP shipped, and never call the others shipped, supported, native or proven.
- "Every part of the method is a Markdown file in a public, MIT-licensed repository" and "seven chapters": the README's one Agent Skills content tree, the MIT LICENSE, and https://github.com/misty-step/mistystack/tree/master/docs/guide (chapters 01 to 07).
- Proposal pending Phaedrus (questions.md, question 6): the footer's spell line. Main keeps it in the lab as a proposal. Without it the footer reads "Misty Step is a software studio."

## Facts I wished I had
Sent to Main for Phaedrus on 2026-10-29: `~/.cache/tmp/misty-design/r2/copy/questions.md`.
1. Who speaks: one person or a team, and may the page say "I" and name him?
2. Who the studio is for, with two or three example processes we may call typical.
3. One or two real quick wins we may describe unnamed, with the day each shipped and its result in units.
4. What arrives on which day of the two weeks, and what one plan entry contains.
5. Whether the five products and client builds run on mistystack.
6. Whether the site may say the name comes from the D&D spell Misty Step.
Resolved: Main's harness ruling (2026-10-29) is applied. The proof line shows install commands for all four harnesses, and the install section calls only OMP shipped.

## Bar check (line by line, in renders)
- No hype words. No dashes, exclamation marks or rhetorical questions. No "X, not Y" in our own lines; the core block quotes "a ticket, not scope" verbatim. The lists name four, six or seven real items rather than habitual threes.
- Hero subs run 29 words (studio) and 27 (stack). The proof lines run 6 words (studio) and 9 (stack).
- Every count spelled in prose (eight lines, seven playbooks, six parts, six tasks, five limits) is checked against facts.ts at import and fails loudly if facts.ts changes.
- The trial appears only with its denominators (4/6, 5/6, 2/6), the measure sentence from facts.ts and all five limits. It never appears in a hero.
