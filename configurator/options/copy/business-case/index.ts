import type { CopyOption } from '../../../src/contract';
import {
  architecture, call, core, discoveryTerms, evidence, guide, installation,
  installLink, OFFER, projects, source, stackFooter, STACK_PAGE, studioFooter, STUDIO_PAGE,
} from '../shared';

export default {
  id: 'business-case',
  layer: 'copy',
  label: "Business case",
  summary: "Commercial confidence: begin with the investment decision, then state the deliverables, terms, and limits without promising a return.",
  origin: 'new',
  refs: [
    {
      "name": "Stripe",
      "url": "https://stripe.com/",
      "what": "Name the commercial job first, then make terms and expected value precise. An estimate remains an estimate."
    },
    {
      "name": "Linear",
      "url": "https://linear.app/",
      "what": "Use a direct statement of purpose and keep the argument about the work, rather than the company."
    }
  ],
  voice: "Precise commercial confidence. Lead with the investment decision, distinguish expected value from a promised return, and put terms beside deliverables.",
  pages: {
    studio: {
      brand: STUDIO_PAGE.brand,
      nav: [
        {
          "label": "The decision",
          "href": "#process"
        },
        {
          "label": "The terms",
          "href": "#terms"
        },
        {
          "label": "Our products",
          "href": "#work"
        }
      ],
      navCta: call,
      hero: {
        headline: "Build on a business case.",
        sub: "AI projects should have a reason to exist. We improve a key business process, then give each proposed project a fixed price and an expected value before you choose what to build.",
        primary: call,
        secondary: { label: "Read the process", href: "#process" },
        proof: discoveryTerms,
      },
      sections: [
        {
          type: 'steps',
          id: 'process',
          title: "A decision before a commitment.",
          intro: "Each stage answers a different question. You choose whether to move to the next.",
          items: [
            { label: '1', title: "Is this the right problem?", terms: OFFER.steps[0].terms, body: "Talk through a key process and whether Misty Step is a fit. Only this call is free." },
            { label: '2', title: "What is worth building?", terms: OFFER.steps[1].terms, body: "One quick win ships during discovery. The plan gives each proposed project a fixed price and the value we expect it to return." + ' ' + OFFER.credit },
            { label: '3', title: "Choose the investment.", terms: OFFER.steps[2].terms, body: "Commission the projects that make sense to you, each at its agreed fixed price." },
          ],
        },
        {
          type: 'points',
          id: 'terms',
          title: "The numbers should help you decide.",
          items: [
            {
              "title": "Expected value is an estimate.",
              "body": "The plan sets out the value we expect a project to return. It is a basis for a decision, not a promise of a return."
            },
            {
              "title": "A plan is not a build commitment.",
              "body": "You keep the plan and choose which projects, if any, to commission. If the work would not pay for itself, the plan says so."
            },
            {
              "title": "Agree on the scope and price.",
              "body": "Discovery and builds have an agreed scope and price before work starts. No hourly billing or open-ended retainer."
            }
          ],
        },
        projects("Built by the people doing the work.", "Our own games, engineering tools, and everyday software. These are first-party products, not client case studies."),
        {
          type: 'cta',
          id: 'contact',
          title: "Bring a process to the table.",
          body: "The first conversation is about the work and whether we can help. It is a free 30-minute call. Discovery is a separate, paid next step.",
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
        headline: "A working method for coding agents.",
        sub: "Give the work a clear process and an outside check. mistystack makes the instructions explicit, so you can read the method before you put it to work.",
        primary: installLink,
        secondary: { label: "Read the working method", href: "#method" },
        proof: STACK_PAGE.hero.proof,
      },
      sections: [
        {
          type: 'points',
          id: 'practice',
          title: "Make the working agreement explicit.",
          items: [
            {
              "title": "Define the check before the work.",
              "body": "The Oracle is the outside check chosen before work starts. It gives the result something to answer to beyond the agent's own judgment."
            },
            {
              "title": "Separate the core from the task.",
              "body": "Keep the always-on rules small. Use the playbooks and skills for the work in front of you."
            },
            {
              "title": "Read the evidence at its actual size.",
              "body": "The kernel trial is directional. Read the denominators and the limits before treating the results as evidence for your own work."
            }
          ],
        },
        architecture("A method with distinct parts.", "The core stays in context. The other layers provide the method and detail for the task."),
        evidence("A small test, stated in full.", "The historical kernel trial is a bounded comparison, not a general performance claim. Read its results with the limits below."),
        installation("Put the method to work.", "Choose your harness for the source installation commands."),
        core("Inspect the core before installing.", "The always-on core from the pinned source. These are the actual instructions, not an illustrative prompt."),
        {
          type: 'cta',
          id: 'read',
          title: "Read the method before you rely on it.",
          body: "The documentation and source make the working agreement available for inspection. Decide whether it fits the work you are doing.",
          primary: guide,
          secondary: source,
        },
      ],
      footer: stackFooter,
    },
  },
} satisfies CopyOption;
