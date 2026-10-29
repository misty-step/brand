import type { CopyOption } from '../../../src/contract';
import {
  architecture, call, core, discoveryTerms, evidence, guide, installation,
  installLink, OFFER, projects, source, stackFooter, STACK_PAGE, studioFooter, STUDIO_PAGE,
} from '../shared';

export default {
  id: 'show-the-work',
  layer: 'copy',
  label: "Show the work",
  summary: "Proof before ambition: lead with a tangible deliverable, then show inspectable products and bounded evidence.",
  origin: 'new',
  refs: [
    {
      "name": "Greptile",
      "url": "https://www.greptile.com/",
      "what": "Offer actual files and working examples to inspect rather than asking a broad quality claim to do the selling."
    },
    {
      "name": "Macroscope",
      "url": "https://macroscope.com/",
      "what": "Name the work being checked and let the method and evidence carry the argument. No borrowed customer results."
    }
  ],
  voice: "Concrete proof before ambition. Lead with the tangible discovery deliverable and put inspectable products or bounded evidence immediately after the opening.",
  pages: {
    studio: {
      brand: STUDIO_PAGE.brand,
      nav: [
        {
          "label": "Our products",
          "href": "#work"
        },
        {
          "label": "What you get",
          "href": "#process"
        },
        {
          "label": "What this means",
          "href": "#terms"
        }
      ],
      navCta: call,
      hero: {
        headline: "Two weeks. One working improvement.",
        sub: "Our fixed $4,500 discovery ships one quick win in a key business process, plus a plan that prices each project and the value we expect it to return. Fixed-price builds follow only if you choose them.",
        primary: call,
        secondary: { label: "Open our products", href: "#work" },
        proof: `Start with a free ${OFFER.callMinutes}-minute call.`,
      },
      sections: [
        projects("Real things. Built here.", "Open a game, inspect a tool, or read the source. These are our own products, not client case studies."),
        {
          type: 'steps',
          id: 'process',
          title: "What you get, and when.",
          items: [
            { label: '1', title: "A conversation about fit.", terms: OFFER.steps[0].terms, body: "Talk through one process in your business. The call is free; it is not a free discovery or audit." },
            { label: '2', title: "A shipped improvement and a priced plan.", terms: OFFER.steps[1].terms, body: "One quick win ships during the two weeks. The plan names specific projects, their fixed prices, and the value we expect each to return." + ' ' + OFFER.credit },
            { label: '3', title: "The projects you choose.", terms: OFFER.steps[2].terms, body: "Select the work that makes sense. We agree the scope and fixed price for each project before starting." },
          ],
        },
        {
          type: 'points',
          id: 'terms',
          title: "A useful result is not a promised return.",
          items: [
            {
              "title": "A quick win is included.",
              "body": "Discovery ships one quick win during the two weeks. Further projects are separate fixed-price builds."
            },
            {
              "title": "The value in the plan is expected value.",
              "body": "It is the value we expect each project to return, not a guarantee. The plan says so if the work would not pay for itself."
            },
            {
              "title": "Our products are not your case study.",
              "body": "The games and tools shown here are first-party work. They are not evidence of client savings or results."
            }
          ],
        },
        {
          type: 'cta',
          id: 'contact',
          title: "Let's look at the actual work.",
          body: "Bring one process to a free 30-minute call. If there is a fit, the next step is the paid, two-week discovery.",
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
        headline: "Read the rules. Check the results.",
        sub: "mistystack puts a coding agent's working method in files you can inspect. Start with the core and the outside check, then read the trial with its limits.",
        primary: installLink,
        secondary: { label: "Read the trial", href: "#evidence" },
        proof: STACK_PAGE.hero.proof,
      },
      sections: [
        evidence("Start with the evidence and its limits.", "The historical kernel trial is small and directional. The complete comparison is below, with the constraints that keep it honest."),
        core("Read the actual instructions.", "The always-on core from the pinned source. Not a sample prompt or a product illustration."),
        architecture("Inspect the working parts.", "The core is one part of the method. Playbooks, principles, skills, and the outside check fill different roles."),
        installation("Try the method in your harness.", "Choose your harness and use the source installation commands."),
        {
          type: 'points',
          id: 'practice',
          title: "What to inspect next.",
          items: [
            {
              "title": "The check chosen before the task.",
              "body": "Read how the Oracle is named before the work begins. It is the outside check for the result."
            },
            {
              "title": "The instructions for the task.",
              "body": "The core stays always on. Read the playbooks and skills to see the rest of the working method."
            },
            {
              "title": "The comparison behind the numbers.",
              "body": "Use the linked trial source. A small historical comparison does not establish what will happen on your work."
            }
          ],
        },
        {
          type: 'cta',
          id: 'read',
          title: "Go to the source.",
          body: "Read the instructions, inspect the trial, and judge the method for yourself.",
          primary: guide,
          secondary: source,
        },
      ],
      footer: stackFooter,
    },
  },
} satisfies CopyOption;
