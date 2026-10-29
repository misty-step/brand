import type { CopyOption } from '../../../src/contract';
import {
  architecture, call, core, discoveryTerms, evidence, guide, installation,
  installLink, OFFER, projects, source, stackFooter, STACK_PAGE, studioFooter, STUDIO_PAGE,
} from '../shared';

export default {
  id: 'quiet-craft',
  layer: 'copy',
  label: "Quiet craft",
  summary: "Selective, terse craft: make the case for a smaller, useful build and a readable working method.",
  origin: 'new',
  refs: [
    {
      "name": "Linear",
      "url": "https://linear.app/",
      "what": "Short declarative sentences, a considered purpose, and attention to the actual work instead of a transformation pitch."
    },
    {
      "name": "Pi",
      "url": "https://pi.dev/",
      "what": "Make deliberate choices visible and let the reader inspect the real method, rather than presenting breadth as a virtue."
    }
  ],
  voice: "Terse, considered, selective. Focus on what deserves to be built and the discipline of leaving unnecessary work undone.",
  pages: {
    studio: {
      brand: STUDIO_PAGE.brand,
      nav: [
        {
          "label": "Commitments",
          "href": "#terms"
        },
        {
          "label": "Approach",
          "href": "#process"
        },
        {
          "label": "Things we make",
          "href": "#work"
        }
      ],
      navCta: call,
      hero: {
        headline: "Build only what earns its place.",
        sub: "We apply AI to a key business process. Discovery ships one useful improvement and a plan that puts a price and an expected value on the work ahead. Build the parts that make sense.",
        primary: call,
        secondary: { label: "See what we make", href: "#work" },
        proof: discoveryTerms,
      },
      sections: [
        {
          type: 'points',
          id: 'terms',
          title: "A smaller plan can be the right plan.",
          items: [
            {
              "title": "Build for a reason.",
              "body": "Each project in the discovery plan has a fixed price and an expected value. If it would not pay for itself, the plan says so."
            },
            {
              "title": "Ship something useful first.",
              "body": "Discovery includes one quick win, shipped during the two weeks. You leave with more than a recommendation."
            },
            {
              "title": "Keep the choice.",
              "body": "The plan is yours. Choose the projects to build, or stop with the discovery. There is no open-ended retainer."
            }
          ],
        },
        {
          type: 'steps',
          id: 'process',
          title: "A clear way to work together.",
          items: [
            { label: '1', title: "Talk it through.", terms: OFFER.steps[0].terms, body: "One process. A conversation about fit. The call is free; the work after it is paid." },
            { label: '2', title: "Make the plan useful.", terms: OFFER.steps[1].terms, body: "Ship one quick win. Set out specific projects, with a fixed price and expected value for each." + ' ' + OFFER.credit },
            { label: '3', title: "Build what makes sense.", terms: OFFER.steps[2].terms, body: "Choose the projects you want us to build. Agree on each scope and fixed price before the work starts." },
          ],
        },
        projects("Things we chose to make.", "Games and useful software from our own studio. First-party work, not client work."),
        {
          type: 'cta',
          id: 'contact',
          title: "Start with a conversation.",
          body: "Tell us which process you have in mind. We will spend 30 minutes talking it through, free. If there is a fit, discovery is the paid next step.",
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
        headline: "Good judgment, written down.",
        sub: "A small core. Instructions for the work at hand. An outside check before you call it done. mistystack gives coding agents a method you can read.",
        primary: installLink,
        secondary: { label: "Read the core", href: "#core" },
        proof: STACK_PAGE.hero.proof,
      },
      sections: [
        core("Start with the core.", "The actual always-on core, from the pinned source."),
        architecture("A place for each kind of instruction.", "Small rules stay in context. The task determines which playbook or skill comes next."),
        {
          type: 'points',
          id: 'practice',
          title: "The discipline is in the method.",
          items: [
            {
              "title": "Choose the check first.",
              "body": "Name the Oracle before work begins. Check the result against something outside the agent's own account of it."
            },
            {
              "title": "Use the detail the task needs.",
              "body": "The core is always on. Playbooks, principles, and skills hold the rest of the working method."
            },
            {
              "title": "Keep the claim modest.",
              "body": "The kernel trial is a small historical comparison. Its limits belong beside the results."
            }
          ],
        },
        installation("Use it in your harness.", "Choose the installation instructions for the tool you already use."),
        evidence("A little evidence. Clear limits.", "The historical kernel trial offers a direction to investigate, not a promise of performance."),
        {
          type: 'cta',
          id: 'read',
          title: "Read the whole method.",
          body: "The documentation explains the parts. The source shows the instructions themselves.",
          primary: guide,
          secondary: source,
        },
      ],
      footer: stackFooter,
    },
  },
} satisfies CopyOption;
