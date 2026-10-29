import type { CopyOption, Section } from '../../../src/contract';
import { CORE, INSTALL_HARNESSES, STACK_NODES, TRIAL, WORK_GROUPS } from '../../../src/content/facts';
import { call, core, evidence, guide, LINKS, OFFER, source, stackFooter, STACK_PAGE, studioFooter, STUDIO_PAGE } from '../shared';

// The editor's cut of round 2. Credits for every borrowed line are in notes.md.
// Facts stay at their single source: offer terms, hosts and links, install
// commands, the core, node counts and trial rows all come from facts.ts.

// The prose spells some counts as words. Fail loudly if facts.ts moves under it.
function spelled(word: string, actual: number | string | undefined, expected: number): string {
  if (Number(actual) !== expected) throw new Error(`r2-cut: the copy says "${word}" but facts.ts now gives ${actual}`);
  return word;
}
const eight = spelled('eight', CORE.split('\n').length, 8);
const seven = spelled('seven', STACK_NODES.find((node) => node.id === 'playbooks')?.count, 7);
const five = spelled('five', TRIAL.limits.length, 5);
const Six = spelled('Six', STACK_NODES.length, 6);
const SixTasks = spelled('Six', TRIAL.rows[0].total, 6);

const [callStep, discoveryStep, buildStep] = OFFER.steps;
const halfFee = `$${(Number(OFFER.discoveryPrice.replace(/[^0-9]/g, '')) / 2).toLocaleString('en-US')}`;

// Product lines from each product's own site or repo (sources listed in notes.md):
// the Poppycock README and site, the Linejam README and convex/game.ts, the Parlor
// site and README, the Landmark get-started page and the mistystack README (Release),
// the Cantrip README.
const WORK_BODY: Record<string, string> = {
  Poppycock: 'A bluffing game for 3 to 12 friends. Make the wrong answer sound very right, then find the one that is true.',
  Linejam: 'A poetry game for 2 to 8 players. You see only the line before yours, and the lines climb from one word to five and back. Then everyone reads the poems aloud.',
  Parlor: 'Guest identity, rooms, presence and matches for games built on Convex and React. Poppycock and Linejam run on it. MIT licensed.',
  Landmark: "Reads a repository's tags and conventional commits, then writes the changelog and the release notes. It prepares mistystack's changelog too.",
  Cantrip: 'Local-first dictation for Linux. Press a shortcut, speak, press it again; your CPU does the transcribing.',
};

const NODE_BODY: Record<string, string> = {
  core: 'The always-on routing and guardrails.',
  misty: 'Reads the task and chooses the playbook and skills.',
  playbooks: 'Bug fix, feature, refactor, investigation, incident, eval and authoring a skill.',
  skills: 'Specialists such as research and security audit, loaded when a task needs one.',
  principles: 'Rules of judgment such as one home per fact, read only when they apply.',
  oracle: 'A check outside the agent that can disprove completion, named before work starts.',
};

function written(bodies: Record<string, string>, key: string): string {
  const body = bodies[key];
  if (!body) throw new Error(`r2-cut: no copy for "${key}"; facts.ts gained an entry this option has not written`);
  return body;
}

const work: Section = {
  type: 'work',
  id: 'work',
  title: 'Poppycock needed rooms, so we built Parlor.',
  intro: 'Two party games, the toolkit they run on, a release-notes tool and a dictation app. All five are ours and open to inspect. None of it is client work.',
  groups: WORK_GROUPS.map((group) => ({
    label: group.label,
    items: group.items.map((item) => ({ ...item, body: written(WORK_BODY, item.name) })),
  })),
};

const parts: Section = {
  type: 'diagram',
  id: 'method',
  title: `${Six} parts. One always on.`,
  intro: `Only the core loads every time. The misty skill reads each task and routes it to one of ${seven} playbooks or a specialist skill, and principles load only when their trigger applies.`,
  nodes: STACK_NODES.map((node) => ({ ...node, body: written(NODE_BODY, node.id) })),
};

// The misty skill's briefing contract, field for field (skills/misty/SKILL.md at the facts.ts snapshot).
const brief: Section = {
  type: 'points',
  id: 'brief',
  title: 'Every handoff gets a brief.',
  intro: 'When work goes to a subagent, the misty skill lists six fields for its brief. A brief with no Oracle goes back to shaping.',
  items: [
    { title: 'Outcome and why', body: 'The change the consumer gets, with links to its sources.' },
    { title: 'Terms', body: "The project's own words for the work, from its DOMAIN.md." },
    { title: 'Raw material', body: 'The failing run, logs, data or source to start from, rather than a summary of them.' },
    { title: 'Oracle', body: 'The check outside the worker that proves the result, with the exact command.' },
    { title: 'Scope and Keep', body: 'The change this worker owns, and the behavior that must remain.' },
    { title: 'Effort', body: 'How much judgment the unit needs.' },
  ],
};

export default {
  id: 'r2-cut',
  layer: 'copy',
  label: "Editor's cut",
  summary: "The round-2 editor's cut for both pages: the best lines of the work order and the field notes, set around the spell's idea that you only step where you can see.",
  origin: 'r2',
  refs: [
    {
      name: 'Stripe',
      url: 'https://stripe.com/',
      what: 'Numerate claims that carry their denominators and footnotes: the trial rows stay beside their limits, and every price appears with its unit.',
    },
    {
      name: 'pi.dev',
      url: 'https://pi.dev/',
      what: 'An honest list of what the product will not do; the studio terms are written as limits the visitor can hold us to.',
    },
    {
      name: 'Greptile',
      url: 'https://www.greptile.com/',
      what: 'Real artefacts as proof and personality only where it is true: named products with their actual mechanics, and the core printed whole.',
    },
  ],
  voice: 'An engineer who ships, talking across a table: short declaratives carry the numbers, and each section allows one longer sentence for the reason. Every line points at something the visitor can open, price or run, and the name stays quiet until the footer explains it.',
  pages: {
    studio: {
      brand: STUDIO_PAGE.brand,
      nav: [
        { label: 'The order of work', href: '#process' },
        { label: 'Our products', href: '#work' },
        { label: 'The fine print', href: '#terms' },
      ],
      navCta: call,
      hero: {
        headline: 'Two weeks to see what\u2019s worth building.',
        sub: `We put AI to work on one key process. The ${OFFER.discoveryPrice} discovery ships a quick win and prices every project in the plan against the dollars it should return.`,
        primary: call,
        secondary: { label: 'See what we build', href: '#work' },
        proof: `Only the ${OFFER.callMinutes}-minute call is free.`,
      },
      sections: [
        {
          type: 'steps',
          id: 'process',
          title: 'The order of work.',
          intro: 'The call settles whether there is a fit. The two weeks produce the numbers you need to decide everything after them.',
          items: [
            {
              label: callStep.label,
              title: 'On the call',
              terms: callStep.terms,
              body: 'We talk through one process and whether we are a fit. You request an open start time; nothing is booked until we confirm it by email.',
            },
            {
              label: discoveryStep.label,
              title: 'In the two weeks',
              terms: discoveryStep.terms,
              body: 'One quick win ships. Then the plan: a few specific projects, each with a fixed price and the value we expect it to return.',
            },
            {
              label: buildStep.label,
              title: 'After the plan',
              terms: buildStep.terms,
              body: `You choose which projects we build, if any, and the software is yours to keep. Half the discovery fee, ${halfFee}, comes off a build signed within 30 days.`,
            },
          ],
        },
        work,
        {
          type: 'points',
          id: 'terms',
          title: 'The fine print, in large type.',
          intro: 'Three rules hold from the first call to the last build.',
          items: [
            {
              title: 'Scope and price come first.',
              body: 'No work starts, the discovery included, until you have agreed what it covers and what it costs.',
            },
            {
              title: 'No open-ended retainer.',
              body: 'The price you agreed is the price of the work. If part of a fee is tied to value, we define and measure that value with you before work starts.',
            },
            {
              title: 'The plan can say no.',
              body: 'If a project would not pay for itself, the plan says so and we do not build it. You keep the plan either way.',
            },
          ],
        },
        {
          type: 'cta',
          id: 'contact',
          title: 'Bring one process.',
          body: `The call takes ${OFFER.callMinutes} minutes and costs nothing. If we are a fit, the next step is two weeks of discovery at ${OFFER.discoveryPrice} fixed.`,
          primary: call,
        },
      ],
      footer: {
        line: 'Misty Step is a software studio, named for a spell: a short step through mist, to a place you can see.',
        links: [{ label: 'hello@mistystep.io', href: 'mailto:hello@mistystep.io' }, ...studioFooter.links],
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
        headline: 'Before work, name the check.',
        sub: `mistystack is Misty Step's open method for coding agents. Its core is ${eight} lines long and loads in every session; the second line starts with this headline.`,
        primary: { label: 'Install for your harness', href: '#install' },
        secondary: { label: `Read all ${eight} lines`, href: '#core' },
        proof: 'Installs natively in OMP, Claude Code, Codex and pi.',
      },
      sections: [
        core('Eight lines. Every session.', 'The whole always-on core, verbatim.'),
        parts,
        brief,
        evidence(`${SixTasks} tasks, one run each.`, `The ${five} limits below belong with these numbers wherever they are quoted.`),
        {
          type: 'install',
          id: 'install',
          title: 'Native installs. No custom installer.',
          intro: "OMP, Claude Code and Codex install it as a plugin; pi installs it as a Git package. Each command comes from that harness's reference file in the repository.",
          harnesses: INSTALL_HARNESSES,
        },
        {
          type: 'cta',
          id: 'read',
          title: 'Done means the check passes.',
          body: 'Every part of the method is a Markdown file in a public, MIT-licensed repository. The guide walks through it in seven chapters.',
          primary: guide,
          secondary: source,
        },
      ],
      footer: {
        line: "mistystack is Misty Step's engineering method, MIT licensed.",
        links: stackFooter.links,
      },
    },
  },
} satisfies CopyOption;
