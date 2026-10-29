import type { CopyOption } from '../../../src/contract';
import {
  architecture, call, core, discoveryTerms, evidence, guide, installation,
  installLink, OFFER, projects, source, stackFooter, STACK_PAGE, studioFooter, STUDIO_PAGE,
} from '../shared';

export default {
  id: 'human-scale',
  layer: 'copy',
  label: "Human scale",
  summary: "A warm, candid small-studio voice: talk to a person, invite a real conversation, and keep the money straightforward.",
  origin: 'new',
  refs: [
    {
      "name": "Earendil",
      "url": "https://earendil.com/",
      "what": "Place the human purpose ahead of the mechanism, with short, calm sentences and no agency posturing."
    },
    {
      "name": "Pi",
      "url": "https://pi.dev/",
      "what": "Address the person using the tool, explain the choices candidly, and leave the working method open to inspection."
    }
  ],
  voice: "Warm, candid small-studio language. Address the person rather than an organization chart, invite a real conversation, and keep the money straightforward.",
  pages: {
    studio: {
      brand: STUDIO_PAGE.brand,
      nav: [
        {
          "label": "What to expect",
          "href": "#terms"
        },
        {
          "label": "Working together",
          "href": "#process"
        },
        {
          "label": "What we make",
          "href": "#work"
        }
      ],
      navCta: call,
      hero: {
        headline: "Bring us the work that gets in the way.",
        sub: "Tell us about a process you would like to improve. We will look at where AI could help, ship one quick win during discovery, and make a clear plan for what is worth building next.",
        primary: call,
        secondary: { label: "How we work together", href: "#process" },
        proof: discoveryTerms,
      },
      sections: [
        {
          type: 'points',
          id: 'terms',
          title: "You should know what you are saying yes to.",
          items: [
            {
              "title": "First, just a conversation.",
              "body": "We will talk through one process and whether we are a fit. The call is free. Anything after it is paid work, agreed in advance."
            },
            {
              "title": "Something useful to show for discovery.",
              "body": "We ship one quick win during the two weeks, alongside a plan that gives each proposed project a fixed price and an expected value."
            },
            {
              "title": "The next decision is yours.",
              "body": "You keep the plan and choose what to build. If the work would not pay for itself, the plan says so. No open-ended retainer."
            }
          ],
        },
        {
          type: 'steps',
          id: 'process',
          title: "Here is how we can help.",
          items: [
            { label: '1', title: "Tell us about the work.", terms: OFFER.steps[0].terms, body: "Tell us about one process in your business. We will talk through the work and whether we are a fit." },
            { label: '2', title: "Make a useful start.", terms: OFFER.steps[1].terms, body: "We ship one quick win and make a plan for what might come next. Each project has a fixed price and the value we expect it to return." + ' ' + OFFER.credit },
            { label: '3', title: "Choose where to go from there.", terms: OFFER.steps[2].terms, body: "Pick the projects that make sense for your business. We will agree on the scope and fixed price before building." },
          ],
        },
        projects("A few things we have made ourselves.", "Games to play together, tools for making software, and other useful things. Our own projects, not client work."),
        {
          type: 'cta',
          id: 'contact',
          title: "We would like to hear about it.",
          body: "Tell us which process is on your mind. We can talk it through on a free 30-minute call. Discovery, if we decide to proceed, is a separate paid engagement.",
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
        headline: "Give your agent a way to work with you.",
        sub: "You should be able to read the instructions your coding agent works from. mistystack gives you a small core, a method for the task, and a way to check the result.",
        primary: installLink,
        secondary: { label: "See how it fits", href: "#method" },
        proof: STACK_PAGE.hero.proof,
      },
      sections: [
        {
          type: 'points',
          id: 'practice',
          title: "A way to be clear with each other.",
          items: [
            {
              "title": "Say how you will check the work.",
              "body": "Choose an outside check before the agent starts. mistystack calls it the Oracle."
            },
            {
              "title": "Give the task its own instructions.",
              "body": "The core stays small and always on. Playbooks and skills hold the detail for the work at hand."
            },
            {
              "title": "Keep the method where you can read it.",
              "body": "Read the rules and task instructions in the source. You should be able to see the method you are asking an agent to follow."
            }
          ],
        },
        architecture("Here is how the pieces fit.", "A small core for every task. More specific instructions for the task in front of you. An outside check for the result."),
        core("You can read the core right here.", "These are the actual always-on instructions, from the pinned source."),
        installation("Start with the tool you use.", "Choose your harness for its source installation commands."),
        evidence("What we know, with the limits left in.", "The historical kernel trial is a small, directional comparison. Here are the results and what they cannot tell you."),
        {
          type: 'cta',
          id: 'read',
          title: "Take a look before you try it.",
          body: "Read the documentation, open the source, and see whether this is a way you would like to work.",
          primary: guide,
          secondary: source,
        },
      ],
      footer: stackFooter,
    },
  },
} satisfies CopyOption;
