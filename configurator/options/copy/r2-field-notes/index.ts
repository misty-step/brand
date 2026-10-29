import type { CopyOption, PageContent } from '../../../src/contract';
import {
  CORE, INSTALL_HARNESSES, LINKS, OFFER, PRINCIPLE_EVIDENCE, STACK_NODES, STACK_PAGE, TRIAL, WORK_GROUPS,
} from '../../../src/content/facts';
import { call, guide, installLink, source } from '../shared';

// Field notes from a studio that builds: the studio's own words, first person plural.
// Offer terms, commands, the core, node counts, correction counts and trial numbers come
// from facts.ts. Every other specific is public and sourced in notes.md: the product sites
// and repos, and mistystack c72698f.

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const say = (n: number) => WORDS[n] ?? String(n);

const coreLineCount = CORE.split('\n').length;
const coreCaption = STACK_PAGE.sections.find((section) => section.type === 'code')!.caption;
const harnessesWithCommands = INSTALL_HARNESSES.filter((harness) => harness.lines.length > 0).map((harness) => harness.name);

// A clause of the core, set as a title. If facts.ts stops containing it, the error
// surfaces in the lab's console gate instead of the page quietly misquoting.
function fromCore(clause: string): string {
  if (!CORE.includes(clause)) console.error(`r2-field-notes cites a clause the core no longer contains: ${clause}`);
  return `${clause}.`;
}

// A principle leaf's correction count from facts.ts, marked inferred when the source says
// so. A missing leaf surfaces in the lab's console gate.
function corrections(principle: string): string {
  const evidence = PRINCIPLE_EVIDENCE.find((entry) => entry.id === principle);
  if (!evidence) {
    console.error(`r2-field-notes cites evidence that facts.ts does not hold: ${principle}`);
    return 'operator corrections';
  }
  return `${evidence.corrections}${evidence.inferred ? ' inferred' : ''} operator corrections`;
}

const productNotes: Record<string, string> = {
  Poppycock: 'A free, untimed bluffing game for 3 to 12 friends. One answer is true. The rest are lies your friends wrote.',
  Linejam: 'A poetry game for 2 to 8 players. You write one line, seeing only the line before it. After nine rounds, everyone reads the poems aloud.',
  Parlor: 'Rooms, guest identity, presence and matches for Convex and React, MIT licensed. Linejam runs on it too.',
  Landmark: 'Turns tags and conventional commits into changelogs and release notes. The local preview needs no GitHub token and no LLM key. It prepares mistystack\u2019s changelog too.',
  Cantrip: 'Local-first dictation for Linux. Press a shortcut, speak, press it again. It transcribes on your CPU, with telemetry off by default.',
};

const nodeNotes: Record<string, string> = {
  core: `Always on: the ${say(coreLineCount)} lines quoted above.`,
  misty: 'Reads each nontrivial task first and sends it to the matching playbook or skill.',
  playbooks: 'Bug fix, feature, refactor, investigation, incident, eval and authoring a skill.',
  skills: 'Specialist guidance, from research and verification to security audits, loaded when a task calls for it.',
  principles: 'Short leaves, each read when its trigger applies. Nothing fails silently is one: errors fail loudly, and no fallback hides them.',
  oracle: `The outside check, named before work starts. The principle behind it, prove it on the real path, cites ${corrections('principle-prove-it-on-the-real-path')} in the initiative #533 audit.`,
};

const studio: PageContent = {
  brand: 'Misty Step',
  nav: [
    { label: 'What we\u2019ve built', href: '#work' },
    { label: 'How it goes', href: '#process' },
    { label: 'Terms', href: '#terms' },
  ],
  navCta: call,
  hero: {
    headline: 'Two weeks to see what\u2019s worth building.',
    sub: 'Bring us one business process and we\u2019ll put AI to work on it. In those two weeks we ship a quick win and a plan pricing each project against what it should return.',
    primary: call,
    secondary: { label: 'See what we\u2019ve built', href: '#work' },
    proof: `Made here: ${WORK_GROUPS.flatMap((group) => group.items.map((item) => item.name)).join(', ')}.`,
  },
  sections: [
    {
      type: 'work',
      id: 'work',
      title: 'Poppycock needed rooms, so we built Parlor.',
      intro: 'Two games, the toolkit under them, a release tool and a dictation app. All of it is ours, and all of it is public.',
      groups: WORK_GROUPS.map((group) => ({
        label: group.label,
        items: group.items.map((item) => ({ ...item, body: productNotes[item.name] ?? item.body })),
      })),
    },
    {
      type: 'steps',
      id: 'process',
      title: 'From first call to first build.',
      intro: 'Three steps, in this order. After each one, you decide whether to take the next.',
      items: [
        {
          label: '1',
          title: 'A conversation.',
          terms: OFFER.steps[0].terms,
          body: 'We talk through one process in your business and where AI could change it. Request an open start time. Nothing is booked until we confirm by email.',
        },
        {
          label: '2',
          title: 'A quick win, then a plan.',
          terms: OFFER.steps[1].terms,
          body: `We ship one quick win during the two weeks of discovery. Then comes the plan: a few specific projects, each with a fixed price and the value we expect it to return. ${OFFER.credit}`,
        },
        {
          label: '3',
          title: 'The builds you choose.',
          terms: OFFER.steps[2].terms,
          body: 'We build the projects you pick. On larger work, part of the fee can be tied to value we measure with you before work starts. The software is yours to keep.',
        },
      ],
    },
    {
      type: 'points',
      id: 'terms',
      title: 'We\u2019ll tell you what not to build.',
      intro: 'Discovery ends in a plan, and a plan can say no. Three rules hold from the first call.',
      items: [
        {
          title: 'No build when the plan says not to.',
          body: 'If a project would not pay for itself, the plan says so. You keep the plan either way.',
        },
        {
          title: 'No work without a scope and a price you agreed to.',
          body: 'That includes discovery. You know what it covers and what it costs before anything begins.',
        },
        {
          title: 'No open-ended retainer, no surprise invoice.',
          body: 'Any share of value is defined and measured before work starts. The price you agree to is the price of the work.',
        },
      ],
    },
    {
      type: 'cta',
      id: 'contact',
      title: 'We only step where we can see.',
      body: `The name comes from a spell: a short step through mist, to a place you can see. We start with a free ${OFFER.callMinutes}-minute call about one process. If we\u2019re a fit, discovery comes next: ${say(OFFER.discoveryWeeks)} weeks at ${OFFER.discoveryPrice} fixed.`,
      primary: call,
    },
  ],
  footer: {
    line: 'Misty Step. We build things, then write down how.',
    links: [
      { label: 'mistystack', href: LINKS.stack },
      { label: 'GitHub', href: 'https://github.com/misty-step' },
    ],
  },
};

const stack: PageContent = {
  brand: 'mistystack',
  nav: [
    { label: 'The core', href: '#core' },
    { label: 'The trial', href: '#evidence' },
    guide,
  ],
  navCta: installLink,
  hero: {
    headline: 'Our agents read this first.',
    sub: `mistystack is the method our coding agents work from. Its core is the ${say(coreLineCount)} lines below, loaded in every session. You can install it too.`,
    primary: installLink,
    secondary: { label: 'Read the core', href: '#core' },
    proof: `Install commands for ${harnessesWithCommands.slice(0, -1).join(', ')} and ${harnessesWithCommands.at(-1)}.`,
  },
  sections: [
    {
      type: 'code',
      id: 'core',
      title: 'Every session starts here.',
      caption: `All ${say(coreLineCount)} lines, quoted whole. ${coreCaption}`,
      code: CORE,
    },
    {
      type: 'points',
      id: 'lines',
      title: 'What the lines are for.',
      intro: 'We wrote down how we work. Here are four of the lines above, with what each one does.',
      items: [
        {
          title: fromCore('Ship the smallest change'),
          body: 'Anything new the agent finds goes into a ticket for later. The fix stays the size of the fix.',
        },
        {
          title: fromCore('Every fact has one home'),
          body: 'When a path changes, its callers move with it and the old path is deleted. Nothing is left behind to drift.',
        },
        {
          title: fromCore('Finish the work you were given'),
          body: `If part of a task is blocked, the agent asks one precise question and finishes the rest. The principle behind it, finish the work, cites ${corrections('principle-finish-the-work')} in initiative #533.`,
        },
        {
          title: fromCore('Label every claim'),
          body: 'Measured, inferred or guess, in the same sentence. When an agent reports back, you can tell what it measured from what it guessed.',
        },
      ],
    },
    {
      type: 'diagram',
      id: 'method',
      title: 'What loads, and when.',
      intro: 'Only the core is always on. The misty skill reads each nontrivial task and opens the playbook it needs. Principles and skills load when their trigger applies.',
      nodes: STACK_NODES.map((node) => ({ ...node, body: nodeNotes[node.id] ?? node.body })),
    },
    {
      type: 'install',
      id: 'install',
      title: 'Install it where you already work.',
      intro: 'Shipped for OMP; the other adapters are in progress (#591). Each command comes from that harness\u2019s note in the repository.',
      harnesses: INSTALL_HARNESSES,
    },
    {
      type: 'evidence',
      id: 'evidence',
      title: `We replayed ${say(TRIAL.rows[0].total)} tasks, once each.`,
      intro: `We counted the independent artifact Oracles that passed under ${say(TRIAL.rows.length)} kinds of guidance. It points a direction. The limits below say how far.`,
      rows: TRIAL.rows,
      limits: TRIAL.limits,
      href: TRIAL.href,
    },
    {
      type: 'cta',
      id: 'read',
      title: 'Read it. Then make it yours.',
      body: 'The guide walks through the method in seven chapters. The last one is about fitting it to your own projects. Every line of the method is in the source.',
      primary: guide,
      secondary: source,
    },
  ],
  footer: {
    line: 'mistystack. How Misty Step works, written down.',
    links: STACK_PAGE.footer.links,
  },
};

export default {
  id: 'r2-field-notes',
  layer: 'copy',
  label: 'Field notes',
  summary: 'A studio\u2019s working notes in the first person plural: warm, and exact about what we built and what our method says word for word.',
  origin: 'r2',
  refs: [
    {
      name: 'Parlor',
      url: 'https://parlor.mistystep.io/',
      what: 'The studio\u2019s own warmest product writing: concrete nouns (rooms, guests, presence, matches) and a plural voice that makes room, as in \u201cYou bring the game. We make room.\u201d',
    },
    {
      name: 'Earendil',
      url: 'https://earendil.com/',
      what: 'Writes as a deliberate "we" in calm, humane sentences, letting a long line breathe before a short one lands.',
    },
  ],
  voice: 'We write like a studio keeping notes as it builds: first person plural, warm and observational, exact about what we made and what our method says. Long sentences carry the detail, and a short one lands it.',
  pages: { studio, stack },
} satisfies CopyOption;
