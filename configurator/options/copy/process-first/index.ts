import type { CopyOption } from '../../../src/contract';
import {
  architecture, call, core, discoveryTerms, evidence, guide, installation,
  installLink, OFFER, projects, source, stackFooter, STACK_PAGE, studioFooter, STUDIO_PAGE,
} from '../shared';

export default {
  id: 'process-first',
  layer: 'copy',
  label: "Process first",
  summary: "Plain systems talk: start with how work happens and explain the parts before talking about the technology.",
  origin: 'new',
  refs: [
    {
      "name": "Cloudflare",
      "url": "https://www.cloudflare.com/",
      "what": "Name each component and explain its job without turning a technical system into a cloud of benefit adjectives."
    },
    {
      "name": "Pi",
      "url": "https://pi.dev/",
      "what": "Keep the workflow in charge of the tool and state which instructions belong in the small core."
    }
  ],
  voice: "Plain systems talk. Start with how work happens, explain the moving parts, and treat AI as a means rather than the subject.",
  pages: {
    studio: {
      brand: STUDIO_PAGE.brand,
      nav: [
        {
          "label": "The process",
          "href": "#process"
        },
        {
          "label": "Boundaries",
          "href": "#terms"
        },
        {
          "label": "Our software",
          "href": "#work"
        }
      ],
      navCta: call,
      hero: {
        headline: "Start with the process, not the model.",
        sub: "We look at one process in your business and where AI could improve it. Two weeks of discovery deliver a quick win and a project plan with fixed prices and expected value.",
        primary: call,
        secondary: { label: "How the work happens", href: "#process" },
        proof: discoveryTerms,
      },
      sections: [
        {
          type: 'steps',
          id: 'process',
          title: "Follow the process through.",
          items: [
            { label: '1', title: "Talk through the process.", terms: OFFER.steps[0].terms, body: "We discuss one process and whether we are a fit. This first call is the only free stage." },
            { label: '2', title: "Find the useful change.", terms: OFFER.steps[1].terms, body: "We ship one quick win and produce a plan for specific projects. Each project has a fixed price and an expected value." + ' ' + OFFER.credit },
            { label: '3', title: "Commission a defined project.", terms: OFFER.steps[2].terms, body: "Choose what to build from the plan. We agree on the scope and fixed price before starting." },
          ],
        },
        {
          type: 'points',
          id: 'terms',
          title: "AI is a means. The process is the point.",
          items: [
            {
              "title": "Give the work a business reason.",
              "body": "The plan connects each proposed project to the savings or gain we expect it to produce, in dollars."
            },
            {
              "title": "Separate planning from commitment.",
              "body": "Discovery gives you a quick win and a plan. You choose which further projects, if any, to build."
            },
            {
              "title": "Keep the boundaries explicit.",
              "body": "Scope and price are agreed before work starts. There is no hourly billing or open-ended retainer."
            }
          ],
        },
        projects("Software we make ourselves.", "First-party games, engineering tools, and everyday software. None of these are client engagements."),
        {
          type: 'cta',
          id: 'contact',
          title: "Which process should we look at?",
          body: "A free 30-minute call is enough to discuss the process and fit. If we proceed, discovery is two weeks at a fixed price.",
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
        headline: "A small core for complex work.",
        sub: "mistystack separates the rules that stay in context from the instructions a task needs. The Oracle is the outside check, chosen before the work begins.",
        primary: installLink,
        secondary: { label: "See the parts", href: "#method" },
        proof: STACK_PAGE.hero.proof,
      },
      sections: [
        architecture("Separate the jobs of the stack.", "Always-on rules, a working mode, task instructions, and an outside check form one readable method."),
        core("The always-on part.", "The actual core from the pinned source. The rest of the method sits in its own files."),
        {
          type: 'points',
          id: 'practice',
          title: "Check the result outside the process.",
          items: [
            {
              "title": "Name the Oracle before starting.",
              "body": "The Oracle is the outside check for the work. Choose it before the work begins."
            },
            {
              "title": "Keep context and procedure distinct.",
              "body": "The small core stays in context. Playbooks and skills carry the task-specific instructions."
            },
            {
              "title": "Keep evidence and expectation distinct.",
              "body": "The historical kernel trial is directional evidence from a small comparison. It does not establish performance on your tasks."
            }
          ],
        },
        evidence("What the historical trial can tell you.", "Read the complete comparison and its limits. The results are a reason to investigate, not a guarantee."),
        installation("Connect the method to your harness.", "Use the source installation commands for your chosen harness."),
        {
          type: 'cta',
          id: 'read',
          title: "Inspect the parts in context.",
          body: "Read the documentation for the method and the repository for the actual instructions.",
          primary: guide,
          secondary: source,
        },
      ],
      footer: stackFooter,
    },
  },
} satisfies CopyOption;
