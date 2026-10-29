import type { CopyOption, PageContent } from '../../../src/contract';
import { LINKS, OFFER, STACK_PAGE, WORK_GROUPS } from '../../../src/content/facts';

// Studio prose fetched from https://mistystep.io/ on 2026-10-29, including
// navigation and footer from the response HTML. The shared content model folds
// the live discovery list and booking note into their respective section bodies.
// stack.mistystep.io did not resolve during that fetch, so its comparison page
// is the explicit source-based baseline, not a claim to reproduce a live site.
const studio: PageContent = {
  brand: 'Misty Step',
  nav: [
    { label: 'How it works', href: '#steps' },
    { label: "What we won't do", href: '#wont' },
    { label: "What we've built", href: '#work' },
    { label: 'Contact', href: '#contact' },
  ],
  hero: {
    headline: 'Reimagine the process. Show the dollars.',
    sub: 'We use AI on a key process anywhere in the business, and show the savings or the gain. It starts with a free 30-minute call. A paid two-week discovery follows.',
    primary: { label: 'Request a free call', href: LINKS.book },
    secondary: { label: "See what we've built", href: '#work' },
    proof: 'Make room for the work that matters.',
  },
  sections: [
    {
      type: 'steps',
      id: 'steps',
      title: 'How it works',
      items: [
        {
          label: '01',
          title: 'Free call',
          terms: OFFER.steps[0].terms,
          body: 'We talk through one process and whether we are a fit.',
        },
        {
          label: '02',
          title: 'Discovery',
          terms: OFFER.steps[1].terms,
          body: 'Half the fee comes off a build signed within 30 days. One quick win, shipped during the two weeks. A plan: a few specific projects, each with a fixed price and the value we expect it to return.',
        },
        {
          label: '03',
          title: 'Build',
          terms: OFFER.steps[2].terms,
          body: 'We build the projects you choose. On larger work, part of the fee can be tied to value we measure with you.',
        },
      ],
    },
    {
      type: 'points',
      id: 'wont',
      title: "What we won't do",
      intro: 'You should know where the edges are before the first conversation.',
      items: [
        {
          title: 'Start work without a scope and a price you agreed to.',
          body: 'That includes the discovery. Nothing starts until you have agreed to what it covers and what it costs.',
        },
        {
          title: 'Put you on an open-ended retainer or send a surprise invoice.',
          body: 'The price you agreed to is the price of the work. Any share of value is defined and measured before we start.',
        },
        {
          title: 'Build anything when the plan says not to.',
          body: 'If it would not pay for itself, the discovery says so, and you keep the plan.',
        },
      ],
    },
    {
      type: 'work',
      id: 'work',
      title: "What we've built",
      intro: 'Games, engineering tools, and everyday software we make ourselves. None of it is client work.',
      groups: WORK_GROUPS,
    },
    {
      type: 'cta',
      id: 'contact',
      title: 'Start with a free call.',
      body: 'Pick an open time, or tell us about the process and we will reply by email. The call is free. If we fit, the next step is a two-week discovery at $4,500 fixed. Nothing is booked until we confirm the time by email.',
      primary: { label: 'Pick a time for the call', href: LINKS.book },
    },
  ],
  footer: {
    line: 'Misty Step',
    links: [
      { label: 'hello@mistystep.io', href: 'mailto:hello@mistystep.io' },
      { label: 'GitHub', href: 'https://github.com/misty-step' },
      { label: 'Changelog', href: 'https://mistystep.io/changelog' },
      { label: 'Privacy', href: 'https://mistystep.io/privacy' },
      { label: 'Terms', href: 'https://mistystep.io/terms' },
      { label: 'Back to top', href: '#top' },
    ],
  },
};

export default {
  id: 'baseline-copy',
  layer: 'copy',
  label: 'Live baseline',
  summary: 'The fetched live studio wording in the shared section model, with the source-based stack page as its comparison.',
  origin: 'baseline',
  refs: [
    {
      name: 'Misty Step, live',
      url: 'https://mistystep.io/',
      what: 'Studio headline, offer, commitments, product descriptions, and closing language fetched on 2026-10-29. Kept as the control, not presented as a new direction.',
    },
    {
      name: 'mistystack, source',
      url: LINKS.repo,
      what: 'The canonical source-based comparison page. The public stack hostname did not resolve during capture, so this does not claim to reproduce a live page.',
    },
  ],
  voice: 'The live studio voice, including its original headline, rather than a proposed rewrite. Stack is the factual source baseline. Prose is preserved; the shared renderer replaces the live page structure and contact form.',
  pages: { studio, stack: STACK_PAGE },
} satisfies CopyOption;
