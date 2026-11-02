/**
 * The Lead Drift intake workflow (spec §5.4). ONE array drives the hero's
 * example run and the Lead Drift case diagram.
 */

/** TODO(owner): replace with the real, anonymized Lead Drift steps.
 *  While any step has placeholder:true the case page shows the "real steps" TODO chip. */
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
