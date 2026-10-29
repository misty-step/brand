import type { CopyOption } from '../../../src/contract';
import {
  architecture, call, core, discoveryTerms, evidence, guide, installation,
  installLink, OFFER, projects, source, stackFooter, STACK_PAGE, studioFooter, STUDIO_PAGE,
} from '../shared';

export default {
  id: 'working-code',
  layer: 'copy',
  label: "Working code",
  summary: "Developer clarity: describe the thing, put the next action first, and make the technical path exact.",
  origin: 'new',
  refs: [
    {
      "name": "Vercel",
      "url": "https://vercel.com/",
      "what": "Use concrete developer actions and put the path to using the tool close to its description."
    },
    {
      "name": "Cloudflare",
      "url": "https://www.cloudflare.com/",
      "what": "Explain what the parts do in plain technical English and keep commands and boundaries literal."
    }
  ],
  voice: "Direct developer clarity. Name the thing, show the path to using it, keep technical details exact, and use actions that describe their destination.",
  pages: {
    studio: {
      brand: STUDIO_PAGE.brand,
      nav: [
        {
          "label": "How it works",
          "href": "#process"
        },
        {
          "label": "Built here",
          "href": "#work"
        },
        {
          "label": "Scope and price",
          "href": "#terms"
        }
      ],
      navCta: call,
      hero: {
        headline: "Your process, turned into software.",
        sub: "Misty Step uses AI to improve a process in your business. Start with a free 30-minute call. A paid discovery ships a quick win and a fixed-price plan for the projects you might build next.",
        primary: call,
        secondary: { label: "See the process", href: "#process" },
        proof: discoveryTerms,
      },
      sections: [
        {
          type: 'steps',
          id: 'process',
          title: "From first call to fixed-price build.",
          items: [
            { label: '1', title: "Describe the process.", terms: OFFER.steps[0].terms, body: "Use the free call to discuss one business process and find out whether Misty Step is a fit." },
            { label: '2', title: "Get a quick win and a build plan.", terms: OFFER.steps[1].terms, body: "We ship one quick win during discovery. Your plan lists specific projects with a fixed price and expected value for each." + ' ' + OFFER.credit },
            { label: '3', title: "Choose the projects to ship.", terms: OFFER.steps[2].terms, body: "We build the projects you select, each with its own agreed scope and fixed price." },
          ],
        },
        projects("Open the things we have built.", "These are our own products. They show what we make, not work commissioned by clients."),
        {
          type: 'points',
          id: 'terms',
          title: "Know the terms before the work.",
          items: [
            {
              "title": "The call is free. Discovery is not.",
              "body": "The initial conversation is free. Discovery is a separate fixed-price engagement, not a free audit."
            },
            {
              "title": "Each project gets its own price.",
              "body": "No hourly rates or open-ended retainer. Scope and price are agreed before work starts."
            },
            {
              "title": "The plan does not oblige you to build.",
              "body": "Keep the plan. Commission the projects you choose. If the work would not pay for itself, the plan says so."
            }
          ],
        },
        {
          type: 'cta',
          id: 'contact',
          title: "Tell us what the process does.",
          body: "Start with the free 30-minute call. If we are a fit, we will agree on the discovery scope and price before beginning.",
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
        headline: "Give your coding agent a method.",
        sub: "Install mistystack for your harness. Read the core, use a playbook for the task, and choose an outside check before the agent starts.",
        primary: installLink,
        secondary: { label: "Inspect the core", href: "#core" },
        proof: STACK_PAGE.hero.proof,
      },
      sections: [
        installation("Install for your harness.", "Choose the harness you use. Copy the source commands below."),
        core("See what stays in context.", "The actual always-on core from the pinned source."),
        architecture("What the method is made of.", "The core, mode, playbooks, principles, skills, and outside check have different jobs."),
        {
          type: 'points',
          id: 'practice',
          title: "Put the instructions around the task.",
          items: [
            {
              "title": "Start with an outside check.",
              "body": "Choose the Oracle before the agent starts work. It is the check the result has to face."
            },
            {
              "title": "Use the task's working method.",
              "body": "The playbooks and skills supply instructions for the work at hand. The small core stays always on."
            },
            {
              "title": "Inspect the source.",
              "body": "Read the actual rules, playbooks, principles, and skills. The method is not hidden behind the installation commands."
            }
          ],
        },
        evidence("Read the trial before making a claim.", "These are results from the historical kernel trial. The comparison is small and directional, with the limits shown below."),
        {
          type: 'cta',
          id: 'read',
          title: "Choose a harness. Read the instructions.",
          body: "Use the documentation for the working method and the repository for the files behind it.",
          primary: guide,
          secondary: source,
        },
      ],
      footer: stackFooter,
    },
  },
} satisfies CopyOption;
