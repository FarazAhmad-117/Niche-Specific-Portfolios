/**
 * The generic lead-intake workflow (spec §5.4) behind the hero's "Example run" console.
 * Owner-neutral on purpose: it names no project, tool or client, and the hero labels it an
 * example. (Each case's own flow lives in src/data/ai/cases.ts › diagram.)
 */

/** TODO(owner): replace with the real, anonymized steps of one of your own builds.
 *  `placeholder: true` marks a step that is still the generic example. */
export const WORKFLOW_STEPS = [
  { id: 'trigger',  label: 'Trigger',  tool: null, placeholder: true,
    summary: 'A new lead arrives from a form or inbox.' },
  { id: 'enrich',   label: 'Enrich',   tool: null, placeholder: true,
    summary: 'Company and contact details are filled in.' },
  { id: 'classify', label: 'Classify', tool: null, placeholder: true,
    summary: 'A model labels intent and fit, with a confidence score.' },
  { id: 'route',    label: 'Route',    tool: null, placeholder: true,
    summary: 'The lead goes to the right pipeline, or to a person if unsure.' },
  { id: 'notify',   label: 'Notify',   tool: null, placeholder: true,
    summary: 'The owner is alerted with the context they need.' },
] as const;

export type WorkflowStep = (typeof WORKFLOW_STEPS)[number];
export type WorkflowStepId = WorkflowStep['id'];

/** True while any step is still a placeholder (drives the "real steps" chip). */
export const WORKFLOW_HAS_PLACEHOLDERS: boolean = WORKFLOW_STEPS.some((s) => s.placeholder);
