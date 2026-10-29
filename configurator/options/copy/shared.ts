import type { Link, Section } from '../../src/contract';
import {
  CORE,
  INSTALL_HARNESSES,
  LINKS,
  OFFER,
  STACK_NODES,
  STACK_PAGE,
  STUDIO_PAGE,
  TRIAL,
  WORK_GROUPS,
} from '../../src/content/facts';

// Shared facts, not a shared voice: every option authors its own complete pages.
// Prices, project descriptions, commands, counts, core, and trial limits stay at
// their single source. In particular, never promote the trial to a hero statistic.
export { LINKS, OFFER, STACK_PAGE, STUDIO_PAGE };

export const call: Link = { label: 'Request a free call', href: LINKS.book };
export const guide: Link = { label: 'Read the guide', href: LINKS.guide };
export const source: Link = { label: 'Browse the source', href: LINKS.repo };
export const installLink: Link = { label: 'Install for your harness', href: '#install' };
export const studioFooter = STUDIO_PAGE.footer;
export const stackFooter = STACK_PAGE.footer;
export const discoveryTerms = OFFER.steps[1].terms;

const coreSourceCaption = STACK_PAGE.sections.find((section) => section.type === 'code')!.caption;
const trialMeasure = STACK_PAGE.sections.find((section) => section.type === 'evidence')!.intro!;

export function projects(title: string, intro: string): Section {
  return { type: 'work', id: 'work', title, intro, groups: WORK_GROUPS };
}

export function architecture(title: string, intro: string): Section {
  return { type: 'diagram', id: 'method', title, intro, nodes: STACK_NODES };
}

export function installation(title: string, intro: string): Section {
  return {
    type: 'install',
    id: 'install',
    title,
    intro: `${intro} These commands are read from the harness references, not executed by this lab.`,
    harnesses: INSTALL_HARNESSES,
  };
}

export function evidence(title: string, intro: string): Section {
  return {
    type: 'evidence',
    id: 'evidence',
    title,
    intro: `${trialMeasure} ${intro}`,
    rows: TRIAL.rows,
    limits: TRIAL.limits,
    href: TRIAL.href,
  };
}

export function core(title: string, caption: string): Section {
  return {
    type: 'code',
    id: 'core',
    title,
    caption: `${caption} ${coreSourceCaption}`,
    code: CORE,
  };
}
