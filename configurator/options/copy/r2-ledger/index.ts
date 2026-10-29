import type { CopyOption, Section } from '../../../src/contract';
import { CORE, INSTALL_HARNESSES, STACK_NODES, TRIAL, WORK_GROUPS } from '../../../src/content/facts';
import { call, core, guide, LINKS, OFFER, source, stackFooter, STUDIO_PAGE, STACK_PAGE } from '../shared';

// Every number in this copy is read from facts.ts, so a fact that changes there changes here.
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
function word(n: number): string {
  const w = WORDS[n];
  if (!w) throw new Error(`r2-ledger: no word for the count ${n}`);
  return w;
}
const Word = (n: number) => word(n).replace(/^./, (c) => c.toUpperCase());

const price = OFFER.discoveryPrice;
const credit = `$${(Number(price.replace(/[^0-9.]/g, '')) / 2).toLocaleString('en-US')}`;
const minutes = OFFER.callMinutes;
const coreLines = CORE.split('\n').length;
const playbooks = Number(STACK_NODES.find((node) => node.id === 'playbooks')?.count);
const products = WORK_GROUPS.reduce((sum, group) => sum + group.items.length, 0);
const tasks = Math.max(...TRIAL.rows.map((row) => row.total));

// Product lines from each product's own public page (poppycock/linejam/parlor.mistystep.io,
// the Landmark get-started page, the Cantrip README). Links and hosts stay in facts.ts.
const WORK_BODY: Record<string, string> = {
  Poppycock: 'A bluffing party game for 3 to 12 players. One answer is true; the rest are bluffs the players wrote.',
  Linejam: 'A poetry game for 2 to 8 players. You see only the line before yours, and after nine rounds everyone reads the poems aloud.',
  Parlor: 'An open-source multiplayer toolkit for Convex and React: guest identity, rooms, presence and matches. Poppycock runs on it.',
  Landmark: "Reads a repository's tags and conventional commits and writes the changelog and release notes. The local preview needs no GitHub token and no model key.",
  Cantrip: 'Local-first dictation for Linux. Press a shortcut, speak, press it again; your CPU does the transcribing.',
};

// Node bodies in this voice; ids, labels, counts and links stay in facts.ts.
// Playbooks named from skills/misty/playbooks/ in the mistystack repo.
const NODE_BODY: Record<string, string> = {
  core: `${Word(coreLines)} lines, loaded in every session.`,
  misty: 'Reads the task and routes it to a playbook and skills.',
  playbooks: `A route for each kind of task: bug fix, feature, refactor, incident and ${word(playbooks - 4)} more.`,
  skills: 'Specialist guidance, loaded only when the task needs it.',
  principles: 'Rules of judgment, such as one home per fact, read when their trigger applies.',
  oracle: 'The outside check, named before work starts. Done is that check passing.',
};

function rewrite(bodies: Record<string, string>, key: string): string {
  const body = bodies[key];
  if (!body) throw new Error(`r2-ledger: no copy for "${key}"; facts.ts gained an entry this option has not written`);
  return body;
}

// The briefing contract in skills/misty/SKILL.md (mistystack repo): its six fields, in its order.
const BRIEF = [
  { title: 'Outcome and why', body: 'The change the consumer gets, with links to its sources.' },
  { title: 'Terms', body: "The project's own words for the work, from its DOMAIN.md." },
  { title: 'Raw material', body: 'The failing run, logs, data or source to start from.' },
  { title: 'Oracle', body: 'The check outside the worker that proves the result, with the exact command.' },
  { title: 'Scope and Keep', body: 'The change this worker owns and the behavior that must remain.' },
  { title: 'Effort', body: 'How much judgment the unit needs.' },
];

const work: Section = {
  type: 'work',
  id: 'work',
  title: `${Word(products)} products, all ours.`,
  intro: 'Every one is live or public, so you can open it and judge the work yourself.',
  groups: WORK_GROUPS.map((group) => ({
    label: group.label,
    items: group.items.map((item) => ({ ...item, body: rewrite(WORK_BODY, item.name) })),
  })),
};

const parts: Section = {
  type: 'diagram',
  id: 'method',
  title: `${Word(STACK_NODES.length)} parts. One always on.`,
  intro: 'The core is the only part loaded in every session; the misty skill reads the task and pulls in the playbook, principles and skills it needs.',
  nodes: STACK_NODES.map((node) => ({ ...node, body: rewrite(NODE_BODY, node.id) })),
};

export default {
  id: 'r2-ledger',
  layer: 'copy',
  label: 'Work order',
  summary: 'Both pages written like a well-made work order: each stage of the offer is a line item with its duration, price and deliverable, and the stack page quotes its core as the spec, because the offer promises you see the whole job before you step into it.',
  origin: 'r2',
  refs: [
    {
      name: 'Stripe',
      url: 'https://stripe.com/',
      what: 'Numbers carry the proof, each with its label, and the caveat sits beside the claim it limits.',
    },
    {
      name: 'pi',
      url: 'https://pi.dev/',
      what: 'A plain list of what was deliberately left out reads as confidence; the studio terms and the stack install line follow it.',
    },
    {
      name: 'Macroscope',
      url: 'https://macroscope.com/',
      what: 'One-sentence product lines that say what the thing does, with its units.',
    },
  ],
  voice: 'Written like a good work order: defined terms used the same way every time, numbers with their units, and every deliverable tied to when it arrives and what it costs. Short declaratives carry the facts; each section allows itself one longer sentence that says why.',
  pages: {
    studio: {
      brand: STUDIO_PAGE.brand,
      nav: [
        { label: 'The order of work', href: '#process' },
        { label: 'Terms', href: '#terms' },
        { label: 'Our products', href: '#work' },
      ],
      navCta: call,
      hero: {
        headline: 'Ship one thing. Quote the rest.',
        sub: `We apply AI to one key process. In two weeks of discovery at ${price}, one quick win ships and the plan prices each further project against the dollars it should return.`,
        primary: call,
        secondary: { label: 'What happens, in order', href: '#process' },
        proof: `Only the ${minutes}-minute call is free.`,
      },
      sections: [
        {
          type: 'steps',
          id: 'process',
          title: 'The order of work.',
          intro: 'From first call to signed build. The call decides whether there is a fit, and the two weeks produce the numbers you need to decide the rest.',
          items: [
            {
              label: '1',
              title: 'On the call',
              terms: OFFER.steps[0].terms,
              body: 'You request an open start time; it is booked when we confirm it by email. We talk through one process and whether we are a fit. If we are, we propose discovery.',
            },
            {
              label: '2',
              title: 'In the two weeks',
              terms: OFFER.steps[1].terms,
              body: 'One quick win ships. Then the plan. It lists a few specific projects, each with two numbers: a fixed price and the dollars we expect it to return.',
            },
            {
              label: '3',
              title: 'After the plan',
              terms: OFFER.steps[2].terms,
              body: `You choose which projects to build, if any. Half the discovery fee, ${credit}, comes off a build signed within 30 days. The software we build is yours to keep.`,
            },
          ],
        },
        {
          type: 'points',
          id: 'terms',
          title: 'The fine print, in large type.',
          intro: 'Three rules that hold from the first call to the last build.',
          items: [
            {
              title: 'Scope and price come first.',
              body: 'No work starts, discovery included, until you have agreed to what it covers and what it costs.',
            },
            {
              title: 'No open-ended retainer.',
              body: 'Discovery and every build have a fixed price. On larger work, part of the fee can be tied to value we define and measure with you before work starts.',
            },
            {
              title: 'The plan can say no.',
              body: 'If a project would not pay for itself, the plan says so and we do not build it. You keep the plan either way.',
            },
          ],
        },
        work,
        {
          type: 'cta',
          id: 'contact',
          title: 'Bring one process.',
          body: `The call is free and takes ${minutes} minutes. If we are a fit, the next step is two weeks of discovery at ${price} fixed, and it starts only when you have agreed to its scope.`,
          primary: call,
        },
      ],
      footer: {
        line: 'Misty Step, a software studio. Fixed prices, agreed before work starts.',
        links: [
          // Public on mistystep.io/book.
          { label: 'hello@mistystep.io', href: 'mailto:hello@mistystep.io' },
          { label: 'mistystack', href: LINKS.repo },
          { label: 'GitHub', href: 'https://github.com/misty-step' },
        ],
      },
    },
    stack: {
      brand: STACK_PAGE.brand,
      nav: [
        { label: 'The core', href: '#core' },
        { label: 'The parts', href: '#method' },
        { label: 'Evidence', href: '#evidence' },
        { label: 'Guide', href: LINKS.guide },
      ],
      navCta: { label: 'Install', href: '#install' },
      hero: {
        headline: 'Done means the check passes.',
        sub: `mistystack is Misty Step's open method for coding agents: ${word(coreLines)} always-on lines route nontrivial work and make the agent name its outside check before it starts.`,
        primary: { label: 'Install for your harness', href: '#install' },
        secondary: { label: `Read the ${word(coreLines)} lines`, href: '#core' },
        proof: 'Installs natively in OMP, Claude Code, Codex and pi.',
      },
      sections: [
        core(`${Word(coreLines)} lines. Every session.`, 'Everything else in the method, from playbooks to principles, loads only when a task calls for it.'),
        parts,
        {
          type: 'points',
          id: 'brief',
          title: 'Every handoff gets a brief.',
          intro: `${Word(BRIEF.length)} fields, one contract. When the agent hands work to a subagent, the misty skill's briefing contract lists these ${word(BRIEF.length)}, and a brief with no Oracle goes back to shaping.`,
          items: BRIEF,
        },
        {
          type: 'evidence',
          id: 'evidence',
          title: `${Word(tasks)} tasks, one run each.`,
          intro: `Reported artifact Oracle passes across ${word(tasks)} replayed tasks per arm. The ${word(TRIAL.limits.length)} limits below belong with these numbers wherever they are quoted.`,
          rows: TRIAL.rows,
          limits: TRIAL.limits,
          href: TRIAL.href,
        },
        {
          type: 'install',
          id: 'install',
          title: 'Native installs. No custom installer.',
          intro: "Each harness installs mistystack through its own plugin or package system and refreshes it the same way. Every command is copied from that harness's reference file in the repository.",
          harnesses: INSTALL_HARNESSES,
        },
        {
          type: 'cta',
          id: 'read',
          title: 'The method is plain text.',
          body: 'Every rule and skill is a Markdown file in a public, MIT-licensed repository, and the guide walks through the method in seven chapters.',
          primary: guide,
          secondary: source,
        },
      ],
      footer: {
        line: "mistystack, Misty Step's engineering method. MIT licensed.",
        links: stackFooter.links,
      },
    },
  },
} satisfies CopyOption;
