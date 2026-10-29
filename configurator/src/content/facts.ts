import type { PageContent } from "../contract";

// Snapshot read through GitHub API on 2026-10-29. Public statements only.
export const SOURCES = {
  "offer": "https://github.com/misty-step/misty-step/blob/45628ff8eb8e68963745eea3a6964da754701925/OFFER.md",
  "work": "https://github.com/misty-step/misty-step/blob/45628ff8eb8e68963745eea3a6964da754701925/content/work.ts",
  "stack": "https://github.com/misty-step/mistystack/tree/c72698fa0cac6241f7c7bb5fc4f587c2e4445d82",
  "trial": "https://github.com/misty-step/mistystack/pull/607",
  "trialRecord": "https://github.com/misty-step/mistystack/blob/feat/stack-site/docs/evals/2026-10-28-kernel-trial.md",
  "trialReport": "https://github.com/misty-step/mistystack/issues/533#issuecomment-6476093437"
};

export const LINKS = {
  "book": "https://mistystep.io/book",
  "studio": "https://mistystep.io",
  "stack": "https://stack.mistystep.io",
  "repo": "https://github.com/misty-step/mistystack",
  "guide": "https://github.com/misty-step/mistystack/tree/master/docs/guide"
};

export const OFFER = {
  "identity": "Misty Step is a software studio.",
  "purpose": "Reimagine a key process with AI and show the savings or the gain in dollars.",
  "callMinutes": 30,
  "discoveryWeeks": 2,
  "discoveryPrice": "$4,500",
  "credit": "Half the discovery fee comes off a build signed within 30 days.",
  "steps": [
    {
      "label": "1",
      "title": "Free call",
      "terms": "30 minutes, free.",
      "body": "Talk through one process and whether we are a fit. Request an open start time. Nothing is booked until we confirm by email."
    },
    {
      "label": "2",
      "title": "Discovery",
      "terms": "Two weeks, $4,500 fixed.",
      "body": "One quick win during the two weeks, then a plan of specific projects, each with a fixed price and its expected value. Half the discovery fee comes off a build signed within 30 days."
    },
    {
      "label": "3",
      "title": "Build",
      "terms": "Fixed price per project.",
      "body": "We build the projects you choose. The software is yours to keep. On larger work, part of the fee can be tied to value we measure with you before work starts."
    }
  ],
  "commitments": [
    {
      "title": "Agree the scope and price first",
      "body": "No work, discovery included, without a scope and a price you agree to."
    },
    {
      "title": "No surprise invoice",
      "body": "No open-ended retainer. Any share of value is defined and measured before work starts."
    },
    {
      "title": "Build only when it is worth it",
      "body": "No build when the plan says not to."
    }
  ]
};

export const WORK_GROUPS = [
  {
    "label": "Games",
    "items": [
      {
        "name": "Poppycock",
        "body": "A party game of strange questions and convincing lies.",
        "href": "https://poppycock.mistystep.io/",
        "host": "poppycock.mistystep.io"
      },
      {
        "name": "Linejam",
        "body": "Write a poem together, one partly hidden line at a time.",
        "href": "https://linejam.mistystep.io/",
        "host": "linejam.mistystep.io"
      },
      {
        "name": "Parlor",
        "body": "The multiplayer toolkit for games played together.",
        "href": "https://parlor.mistystep.io/",
        "host": "parlor.mistystep.io"
      }
    ]
  },
  {
    "label": "Engineering",
    "items": [
      {
        "name": "Landmark",
        "body": "Turn commits into changelogs and release notes.",
        "href": "https://misty-step.github.io/landmark/get-started.html",
        "host": "misty-step.github.io/landmark"
      }
    ]
  },
  {
    "label": "Tools",
    "items": [
      {
        "name": "Cantrip",
        "body": "Local-first dictation for Linux. Speak instead of typing.",
        "href": "https://github.com/misty-step/cantrip",
        "host": "github.com/misty-step/cantrip"
      }
    ]
  }
];

export const INSTALL_HARNESSES = [
  {
    "id": "omp",
    "name": "OMP",
    "lines": [
      "omp plugin marketplace add misty-step/mistystack",
      "omp plugin install --scope user mistystack@mistystack"
    ],
    "note": "Start a fresh OMP session. Source: skills/misty/harnesses/omp.md."
  },
  {
    "id": "claude",
    "name": "Claude Code",
    "lines": [
      "claude plugin marketplace add misty-step/mistystack",
      "claude plugin install mistystack@mistystack"
    ],
    "note": "Start a fresh session after installing. Source: skills/misty/harnesses/claude.md."
  },
  {
    "id": "codex",
    "name": "Codex",
    "lines": [
      "codex plugin marketplace add misty-step/mistystack",
      "codex plugin add mistystack@mistystack"
    ],
    "note": "Review and trust the native SessionStart hook. Rigor agents are installed separately. Source: skills/misty/harnesses/codex.md."
  },
  {
    "id": "pi",
    "name": "pi",
    "lines": [
      "pi install git:github.com/misty-step/mistystack"
    ],
    "note": "Rigor runs inline; pi has no native subagent mechanism. Source: skills/misty/harnesses/pi.md."
  },
  {
    "id": "grok-bot",
    "name": "Grok Bot",
    "lines": [],
    "note": "No public install command. Follow the runtime-specific self-install and fresh-session proof brief in skills/misty/harnesses/grok-bot.md. Grok Build CLI is not a target."
  }
];

export const CORE = "- Nontrivial work: load the `misty` skill first and follow its routing.\n- Before work, name the check outside yourself that will show the result is right: a failing test, the repository's verification skill, a measurement or the user's path. Done is that check passing on the real path.\n- Ship the smallest change that solves the user's problem. New work becomes a ticket, not scope.\n- Every fact has one home. Replace an old path by migrating its callers and deleting it.\n- Label every claim measured, inferred or guess in the same sentence. Link only what you produced or read.\n- Finish the work you were given. Ask one precise question for a blocked part and finish the rest.\n- Placement: run portable builds, test suites, browser QA, untrusted code and long jobs on fresh Boat workers through the `boat-workers` skill. Everything else stays where you run unless your harness note in `misty` says otherwise.\n- Ask Phaedrus before spending money, creating or widening credentials, writing production data, messaging third parties or doing anything irreversible.";

export const STACK_NODES = [
  {
    "id": "core",
    "label": "Core",
    "body": "Small always-on routing rules and guardrails.",
    "href": "https://github.com/misty-step/mistystack/blob/master/rules/core.md"
  },
  {
    "id": "misty",
    "label": "Misty",
    "body": "The mode skill routes nontrivial work.",
    "href": "https://github.com/misty-step/mistystack/blob/master/skills/misty/SKILL.md"
  },
  {
    "id": "playbooks",
    "label": "Playbooks",
    "body": "A task-shaped route through the method.",
    "count": "7",
    "href": "https://github.com/misty-step/mistystack/tree/master/skills/misty/playbooks"
  },
  {
    "id": "skills",
    "label": "Skills",
    "body": "Load specialist guidance when the task needs it.",
    "href": "https://github.com/misty-step/mistystack/tree/master/skills"
  },
  {
    "id": "principles",
    "label": "Principles",
    "body": "On-demand leaves, not more standing instructions.",
    "count": "9",
    "href": "https://github.com/misty-step/mistystack/tree/master/skills"
  },
  {
    "id": "oracle",
    "label": "Oracle",
    "body": "The outside check named before work starts.",
    "href": "https://github.com/misty-step/mistystack/blob/master/skills/misty/SKILL.md"
  }
];

// Why four of the principles exist, from each leaf's `prevents` metadata at mistystack c72698f.
// "corrections" counts operator corrections recorded in initiative #533; deep-modules marks its count as inferred.
export const PRINCIPLE_EVIDENCE = [
  { "id": "principle-prove-it-on-the-real-path", "prevents": "Fix still fails or regresses", "corrections": 36, "inferred": false, "href": "https://github.com/misty-step/mistystack/blob/c72698fa0cac6241f7c7bb5fc4f587c2e4445d82/skills/principle-prove-it-on-the-real-path/SKILL.md" },
  { "id": "principle-deep-modules", "prevents": "Overengineering and special-case growth", "corrections": 16, "inferred": true, "href": "https://github.com/misty-step/mistystack/blob/c72698fa0cac6241f7c7bb5fc4f587c2e4445d82/skills/principle-deep-modules/SKILL.md" },
  { "id": "principle-one-home-per-fact", "prevents": "Data-fidelity loss and duplicates", "corrections": 15, "inferred": false, "href": "https://github.com/misty-step/mistystack/blob/c72698fa0cac6241f7c7bb5fc4f587c2e4445d82/skills/principle-one-home-per-fact/SKILL.md" },
  { "id": "principle-finish-the-work", "prevents": "Half-finished work handed back or parked", "corrections": 11, "inferred": false, "href": "https://github.com/misty-step/mistystack/blob/c72698fa0cac6241f7c7bb5fc4f587c2e4445d82/skills/principle-finish-the-work/SKILL.md" }
];

export const TRIAL = {
  "title": "Six tasks. Directional evidence.",
  "rows": [
    {
      "label": "Current guidance",
      "passed": 4,
      "total": 6
    },
    {
      "label": "Mistystack kernel",
      "passed": 5,
      "total": 6,
      "highlight": true
    },
    {
      "label": "No injected guidance",
      "passed": 2,
      "total": 6
    }
  ],
  "limits": [
    "One run per task and arm. Directional only, not statistically conclusive superiority.",
    "9 of 18 runs hit the 720-second administrative cap. Artifact checks were observed; natural completion was not.",
    "The no-injected-guidance arm still read repository AGENTS.md and verification source.",
    "Five of six tasks come from one repository; three exercise the same dispatcher.",
    "This imports the 2026-10-28 record in draft PR #607. It is not a rerun or a test of today's adapters. Raw replay artifacts remain private."
  ],
  "href": "https://github.com/misty-step/mistystack/blob/feat/stack-site/docs/evals/2026-10-28-kernel-trial.md"
};

export const STUDIO_PAGE: PageContent = {
  "brand": "Misty Step",
  "nav": [
    {
      "label": "The process",
      "href": "#process"
    },
    {
      "label": "Our work",
      "href": "#work"
    }
  ],
  "navCta": {
    "label": "Request a free call",
    "href": "https://mistystep.io/book"
  },
  "hero": {
    "headline": "Reimagine the process. Show the dollars.",
    "sub": "Apply AI to one key process and measure the savings or gain in dollars. Start with a free 30-minute call. A paid two-week discovery follows.",
    "primary": {
      "label": "Request a free call",
      "href": "https://mistystep.io/book"
    },
    "secondary": {
      "label": "See what we have built",
      "href": "#work"
    }
  },
  "sections": [
    {
      "type": "steps",
      "id": "process",
      "title": "Start small. Know the terms.",
      "items": [
        {
          "label": "1",
          "title": "Free call",
          "terms": "30 minutes, free.",
          "body": "Talk through one process and whether we are a fit. Request an open start time. Nothing is booked until we confirm by email."
        },
        {
          "label": "2",
          "title": "Discovery",
          "terms": "Two weeks, $4,500 fixed.",
          "body": "One quick win during the two weeks, then a plan of specific projects, each with a fixed price and its expected value. Half the discovery fee comes off a build signed within 30 days."
        },
        {
          "label": "3",
          "title": "Build",
          "terms": "Fixed price per project.",
          "body": "We build the projects you choose. The software is yours to keep. On larger work, part of the fee can be tied to value we measure with you before work starts."
        }
      ]
    },
    {
      "type": "points",
      "id": "commitments",
      "title": "What we will not do",
      "items": [
        {
          "title": "Agree the scope and price first",
          "body": "No work, discovery included, without a scope and a price you agree to."
        },
        {
          "title": "No surprise invoice",
          "body": "No open-ended retainer. Any share of value is defined and measured before work starts."
        },
        {
          "title": "Build only when it is worth it",
          "body": "No build when the plan says not to."
        }
      ]
    },
    {
      "type": "work",
      "id": "work",
      "title": "Things we have built",
      "intro": "Our own games and tools. Not claimed client case studies.",
      "groups": [
        {
          "label": "Games",
          "items": [
            {
              "name": "Poppycock",
              "body": "A party game of strange questions and convincing lies.",
              "href": "https://poppycock.mistystep.io/",
              "host": "poppycock.mistystep.io"
            },
            {
              "name": "Linejam",
              "body": "Write a poem together, one partly hidden line at a time.",
              "href": "https://linejam.mistystep.io/",
              "host": "linejam.mistystep.io"
            },
            {
              "name": "Parlor",
              "body": "The multiplayer toolkit for games played together.",
              "href": "https://parlor.mistystep.io/",
              "host": "parlor.mistystep.io"
            }
          ]
        },
        {
          "label": "Engineering",
          "items": [
            {
              "name": "Landmark",
              "body": "Turn commits into changelogs and release notes.",
              "href": "https://misty-step.github.io/landmark/get-started.html",
              "host": "misty-step.github.io/landmark"
            }
          ]
        },
        {
          "label": "Tools",
          "items": [
            {
              "name": "Cantrip",
              "body": "Local-first dictation for Linux. Speak instead of typing.",
              "href": "https://github.com/misty-step/cantrip",
              "host": "github.com/misty-step/cantrip"
            }
          ]
        }
      ]
    },
    {
      "type": "cta",
      "id": "contact",
      "title": "Start with a free call.",
      "body": "Talk through one process in 30 minutes. If we are a fit, discovery is two weeks at $4,500 fixed.",
      "primary": {
        "label": "Request a free call",
        "href": "https://mistystep.io/book"
      }
    }
  ],
  "footer": {
    "line": "Misty Step. A software studio.",
    "links": [
      {
        "label": "mistystack",
        "href": "https://github.com/misty-step/mistystack"
      },
      {
        "label": "GitHub",
        "href": "https://github.com/misty-step"
      }
    ]
  }
};

export const STACK_PAGE: PageContent = {
  "brand": "mistystack",
  "nav": [
    {
      "label": "The method",
      "href": "#method"
    },
    {
      "label": "Evidence",
      "href": "#evidence"
    },
    {
      "label": "Guide",
      "href": "https://github.com/misty-step/mistystack/tree/master/docs/guide"
    }
  ],
  "navCta": {
    "label": "Install",
    "href": "#install"
  },
  "hero": {
    "headline": "Give your agent a method.",
    "sub": "Misty Step's harness-neutral engineering method. A small always-on core, guidance loaded when needed, and an outside check named before work starts.",
    "primary": {
      "label": "Install for your harness",
      "href": "#install"
    },
    "secondary": {
      "label": "Read the method",
      "href": "#method"
    },
    "proof": "Open source. One shared Agent Skills tree."
  },
  "sections": [
    {
      "type": "diagram",
      "id": "method",
      "title": "A small core. The rest on demand.",
      "nodes": [
        {
          "id": "core",
          "label": "Core",
          "body": "Small always-on routing rules and guardrails.",
          "href": "https://github.com/misty-step/mistystack/blob/master/rules/core.md"
        },
        {
          "id": "misty",
          "label": "Misty",
          "body": "The mode skill routes nontrivial work.",
          "href": "https://github.com/misty-step/mistystack/blob/master/skills/misty/SKILL.md"
        },
        {
          "id": "playbooks",
          "label": "Playbooks",
          "body": "A task-shaped route through the method.",
          "count": "7",
          "href": "https://github.com/misty-step/mistystack/tree/master/skills/misty/playbooks"
        },
        {
          "id": "skills",
          "label": "Skills",
          "body": "Load specialist guidance when the task needs it.",
          "href": "https://github.com/misty-step/mistystack/tree/master/skills"
        },
        {
          "id": "principles",
          "label": "Principles",
          "body": "On-demand leaves, not more standing instructions.",
          "count": "9",
          "href": "https://github.com/misty-step/mistystack/tree/master/skills"
        },
        {
          "id": "oracle",
          "label": "Oracle",
          "body": "The outside check named before work starts.",
          "href": "https://github.com/misty-step/mistystack/blob/master/skills/misty/SKILL.md"
        }
      ]
    },
    {
      "type": "install",
      "id": "install",
      "title": "Use your own harness.",
      "intro": "Native installation. Shared method. Commands from the current harness references; not executed by this lab.",
      "harnesses": [
        {
          "id": "omp",
          "name": "OMP",
          "lines": [
            "omp plugin marketplace add misty-step/mistystack",
            "omp plugin install --scope user mistystack@mistystack"
          ],
          "note": "Start a fresh OMP session. Source: skills/misty/harnesses/omp.md."
        },
        {
          "id": "claude",
          "name": "Claude Code",
          "lines": [
            "claude plugin marketplace add misty-step/mistystack",
            "claude plugin install mistystack@mistystack"
          ],
          "note": "Start a fresh session after installing. Source: skills/misty/harnesses/claude.md."
        },
        {
          "id": "codex",
          "name": "Codex",
          "lines": [
            "codex plugin marketplace add misty-step/mistystack",
            "codex plugin add mistystack@mistystack"
          ],
          "note": "Review and trust the native SessionStart hook. Rigor agents are installed separately. Source: skills/misty/harnesses/codex.md."
        },
        {
          "id": "pi",
          "name": "pi",
          "lines": [
            "pi install git:github.com/misty-step/mistystack"
          ],
          "note": "Rigor runs inline; pi has no native subagent mechanism. Source: skills/misty/harnesses/pi.md."
        },
        {
          "id": "grok-bot",
          "name": "Grok Bot",
          "lines": [],
          "note": "No public install command. Follow the runtime-specific self-install and fresh-session proof brief in skills/misty/harnesses/grok-bot.md. Grok Build CLI is not a target."
        }
      ]
    },
    {
      "type": "evidence",
      "id": "evidence",
      "title": "Six tasks. Directional evidence.",
      "intro": "Reported artifact Oracle passes across six replayed tasks per arm. Not a general superiority claim.",
      "rows": [
        {
          "label": "Current guidance",
          "passed": 4,
          "total": 6
        },
        {
          "label": "Mistystack kernel",
          "passed": 5,
          "total": 6,
          "highlight": true
        },
        {
          "label": "No injected guidance",
          "passed": 2,
          "total": 6
        }
      ],
      "limits": [
        "One run per task and arm. Directional only, not statistically conclusive superiority.",
        "9 of 18 runs hit the 720-second administrative cap. Artifact checks were observed; natural completion was not.",
        "The no-injected-guidance arm still read repository AGENTS.md and verification source.",
        "Five of six tasks come from one repository; three exercise the same dispatcher.",
        "This imports the 2026-10-28 record in draft PR #607. It is not a rerun or a test of today's adapters. Raw replay artifacts remain private."
      ],
      "href": "https://github.com/misty-step/mistystack/blob/feat/stack-site/docs/evals/2026-10-28-kernel-trial.md"
    },
    {
      "type": "code",
      "id": "core",
      "title": "The always-on core",
      "caption": `rules/core.md at ${SOURCES.stack.slice(-40, -33)}, read 2026-10-29. The trial evaluated an earlier snapshot.`,
      "code": CORE
    },
    {
      "type": "cta",
      "id": "read",
      "title": "Read it before you install it.",
      "body": "The method is public, built for Misty Step, and yours to inspect.",
      "primary": {
        "label": "Read the guide",
        "href": "https://github.com/misty-step/mistystack/tree/master/docs/guide"
      },
      "secondary": {
        "label": "Browse the source",
        "href": "https://github.com/misty-step/mistystack"
      }
    }
  ],
  "footer": {
    "line": "mistystack. Misty Step's engineering method.",
    "links": [
      {
        "label": "Misty Step",
        "href": "https://mistystep.io"
      },
      {
        "label": "Source",
        "href": "https://github.com/misty-step/mistystack"
      },
      {
        "label": "Trial source: draft PR #607",
        "href": "https://github.com/misty-step/mistystack/pull/607"
      }
    ]
  }
};

export const BASELINE_PAGES = { studio: STUDIO_PAGE, stack: STACK_PAGE };
export const FACTS = { offer: OFFER, work: WORK_GROUPS, install: INSTALL_HARNESSES, core: CORE, nodes: STACK_NODES, trial: TRIAL, sources: SOURCES, links: LINKS };
