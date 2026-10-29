import type { CopyOption } from '../../../src/contract';
import {
  architecture, call, core, discoveryTerms, evidence, guide, installation,
  installLink, OFFER, projects, source, stackFooter, STACK_PAGE, studioFooter, STUDIO_PAGE,
} from '../shared';

export default {
  id: 'hard-edges',
  layer: 'copy',
  label: "Hard edges",
  summary: "Stark industrial plainness: short sentences, concrete nouns, visible prices, and explicit limits.",
  origin: 'new',
  refs: [
    {
      "name": "Grok",
      "url": "https://grok.com/",
      "what": "Use the least language needed to state a job and an action, without borrowing its personality or making expansive claims."
    },
    {
      "name": "Brass Hands",
      "url": "https://brasshands.com/",
      "what": "Take only the direct ownership statement, 'All work is our own.' Reject the mission-briefing voice, status labels, military vocabulary, and industrial costume."
    }
  ],
  voice: "Stark plainness. Short sentences, concrete nouns, visible prices, no grand claims. Grok supplies the economy of language. Brass Hands contributes only the direct statement of ownership, never its military-industrial voice.",
  pages: {
    studio: {
      brand: STUDIO_PAGE.brand,
      nav: [
        {
          "label": "Terms",
          "href": "#process"
        },
        {
          "label": "Work",
          "href": "#work"
        },
        {
          "label": "Limits",
          "href": "#terms"
        }
      ],
      navCta: call,
      hero: {
        headline: "Useful AI. Fixed-price work.",
        sub: "One business process. A shipped quick win. A plan with a price and expected value for every project. Then you decide what gets built.",
        primary: call,
        secondary: { label: "Read the terms", href: "#process" },
        proof: discoveryTerms,
      },
      sections: [
        {
          type: 'steps',
          id: 'process',
          title: "The terms.",
          items: [
            { label: '1', title: "Call.", terms: OFFER.steps[0].terms, body: "One process. Fit. No fee. Only the call is free." },
            { label: '2', title: "Discovery.", terms: OFFER.steps[1].terms, body: "One quick win, shipped. A project plan. A fixed price and expected value for each project." + ' ' + OFFER.credit },
            { label: '3', title: "Build.", terms: OFFER.steps[2].terms, body: "Choose the projects. Agree the scope and fixed price. We build them." },
          ],
        },
        projects("Our own work.", "First-party products. Not client work."),
        {
          type: 'points',
          id: 'terms',
          title: "The limits.",
          items: [
            {
              "title": "No blank cheque.",
              "body": "No work without an agreed scope and price. No hourly rates. No open-ended retainer."
            },
            {
              "title": "No assumed return.",
              "body": "Expected value is an estimate. If the work would not pay for itself, the plan says so."
            },
            {
              "title": "No obligation to build.",
              "body": "Keep the plan. Choose what happens next."
            }
          ],
        },
        {
          type: 'cta',
          id: 'contact',
          title: "Name the process.",
          body: "Start with a free 30-minute call. Discovery is paid. Builds are fixed price.",
          primary: call,
        },
      ],
      footer: studioFooter,
    },
    stack: {
      brand: STACK_PAGE.brand,
      nav: [
        { label: 'The method', href: '#method' },
        { label: 'Evidence', href: '#evidence' },
        guide,
      ],
      navCta: installLink,
      hero: {
        headline: "Tell it what done means.",
        sub: "mistystack is a method for coding agents. Read the rules. Choose the outside check. Judge the result against it.",
        primary: installLink,
        secondary: { label: "Read the core", href: "#core" },
        proof: STACK_PAGE.hero.proof,
      },
      sections: [
        core("The core.", "Actual instructions. Pinned source."),
        {
          type: 'points',
          id: 'practice',
          title: "The method.",
          items: [
            {
              "title": "Choose the outside check.",
              "body": "Name the Oracle before the work starts."
            },
            {
              "title": "Use the task instructions.",
              "body": "Keep the core always on. Use the playbooks and skills for the job."
            },
            {
              "title": "Check the result.",
              "body": "Judge it against the Oracle, not the agent's claim that it is done."
            }
          ],
        },
        architecture("The parts.", "Each layer has a job."),
        evidence("The evidence.", "A small historical kernel trial. Directional only. Full denominators and limits below."),
        installation("The installation.", "Choose the harness. Copy its source commands."),
        {
          type: 'cta',
          id: 'read',
          title: "Read the instructions.",
          body: "Documentation for the method. Source for the instructions.",
          primary: guide,
          secondary: source,
        },
      ],
      footer: stackFooter,
    },
  },
} satisfies CopyOption;
