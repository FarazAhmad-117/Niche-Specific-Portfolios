/**
 * ★ Signature: the Switchboard (brief §4 item 4, "Account X-ray"), drawn as a workflow
 * builder: the workflow list on the left, the selected workflow as a vertical flow of action
 * cards in the middle, its execution log on the right. It is a MOCK of an EXAMPLE sub-account,
 * labelled as such on the page: no GoHighLevel logo, colours or screenshots.
 *
 * Six steps walk from the tangled account (a duplicate, a draft, a dead alert, found one by
 * one in the list, the flow and the log) to the rewired one, where a test contact runs the
 * clean flow end to end.
 */

export type Mode = 'before' | 'after';
export type Icon =
  | 'form'
  | 'calendar'
  | 'phone'
  | 'tag'
  | 'opportunity'
  | 'sms'
  | 'email'
  | 'bell'
  | 'branch'
  | 'clock';

/** A row in the workflow list. */
export interface WfItem {
  readonly id: string;
  readonly name: string;
  /** Phone / card label: short. */
  readonly short: string;
  readonly status: 'Published' | 'Draft';
  readonly trigger: string;
  /** What it does (case page, hidden description). */
  readonly info: string;
  readonly fault?: string;
}

export const LIST_BEFORE: readonly WfItem[] = [
  { id: 'w-lead', name: 'New Lead', short: 'New Lead', status: 'Published', trigger: 'Form Submitted', info: 'The original new-lead flow. Works, but not alone.' },
  {
    id: 'w-copy',
    name: 'New Lead (copy)',
    short: 'Copy',
    status: 'Published',
    trigger: 'Form Submitted',
    info: 'A copy made "to test" a change. Still published, so every form fill enrolls twice.',
    fault: 'Fires twice',
  },
  { id: 'w-final', name: 'new lead FINAL v2', short: 'FINAL v2', status: 'Draft', trigger: 'None', info: 'An abandoned rewrite. Harmless, but nobody knows that.' },
  { id: 'w-test', name: 'TEST - do not use', short: 'TEST', status: 'Published', trigger: 'Contact Tag', info: 'A test flow left live on real contacts.' },
  {
    id: 'w-old',
    name: 'Booking confirm (old)',
    short: 'Old booking',
    status: 'Draft',
    trigger: 'Appointment Status',
    info: 'The booking confirmation. Still a draft, so it never runs and booked leads never reach Booked.',
    fault: 'Never fires',
  },
  {
    id: 'w-hot',
    name: 'Hot lead alert',
    short: 'Hot alert',
    status: 'Published',
    trigger: 'Contact Tag',
    info: 'Alerts an inbox that belonged to someone who left. Reports success; nobody is told.',
    fault: 'Nobody reads it',
  },
];

export const LIST_AFTER: readonly WfItem[] = [
  { id: 'a-01', name: '01 · Lead · Web form', short: '01 Lead', status: 'Published', trigger: 'Form Submitted', info: 'The only workflow on the form: one opportunity, one reply, one alert.' },
  { id: 'a-02', name: '02 · Call · Text back', short: '02 Call', status: 'Published', trigger: 'Call Status', info: 'Texts the missed caller and tells the owner.' },
  { id: 'a-03', name: '03 · Booking · Confirm', short: '03 Book', status: 'Published', trigger: 'Appointment Status', info: 'Confirms the booking and moves the lead to Booked. Published and tested.' },
  { id: 'a-04', name: '04 · Lead · Hot alert', short: '04 Hot', status: 'Published', trigger: 'Contact Tag', info: 'Texts the owner, who actually reads it.' },
  { id: 'a-99', name: '99 · System · Error alert', short: '99 Errors', status: 'Published', trigger: 'Workflow error', info: 'Tells a person whenever any step above fails.' },
];

/** A card in the flow. `kind` sets its icon colour; `fault` adds an amber tag while lit. */
export interface FlowNode {
  readonly id: string;
  readonly kind: 'trigger' | 'action' | 'notify' | 'logic';
  readonly icon: Icon;
  readonly title: string;
  readonly detail: string;
  readonly fault?: string;
}
/** A flow: cards in order; `branch` (an If/Else) splits into two single-card paths, then joins. */
export interface Flow {
  readonly id: string;
  readonly nodes: readonly FlowNode[];
  readonly branch?: {
    readonly after: string;
    readonly paths: readonly [
      { readonly label: string; readonly node: FlowNode },
      { readonly label: string; readonly node: FlowNode },
    ];
  };
  readonly draft?: boolean;
}

export const FLOWS: readonly Flow[] = [
  {
    id: 'lead',
    nodes: [
      { id: 'l1', kind: 'trigger', icon: 'form', title: 'Form Submitted', detail: 'Form: Website enquiry' },
      { id: 'l2', kind: 'action', icon: 'opportunity', title: 'Create / Update Opportunity', detail: 'Pipeline: Sales · Stage: New lead' },
      { id: 'l3', kind: 'action', icon: 'email', title: 'Send Email', detail: 'To contact · “Thanks for reaching out”' },
      { id: 'l4', kind: 'notify', icon: 'bell', title: 'Internal Notification', detail: 'Email · team@' },
    ],
  },
  {
    id: 'copy',
    nodes: [
      { id: 'c1', kind: 'trigger', icon: 'form', title: 'Form Submitted', detail: 'Form: Website enquiry', fault: 'Same trigger as New Lead' },
      { id: 'c2', kind: 'action', icon: 'opportunity', title: 'Create / Update Opportunity', detail: 'Pipeline: Sales (old) · Stage: New Lead (2)', fault: 'Second opportunity' },
      { id: 'c3', kind: 'action', icon: 'email', title: 'Send Email', detail: 'To contact · the same email again', fault: 'Duplicate email' },
      { id: 'c4', kind: 'notify', icon: 'bell', title: 'Internal Notification', detail: 'Email · team@, again' },
    ],
  },
  {
    id: 'old',
    draft: true,
    nodes: [
      { id: 'o1', kind: 'trigger', icon: 'calendar', title: 'Appointment Status', detail: 'Status: booked', fault: 'Draft: never runs' },
      { id: 'o2', kind: 'action', icon: 'sms', title: 'Send SMS', detail: '“Your call is booked for…”' },
      { id: 'o3', kind: 'action', icon: 'opportunity', title: 'Create / Update Opportunity', detail: 'Stage: Booked · never reached' },
    ],
  },
  {
    id: 'hot',
    nodes: [
      { id: 'h1', kind: 'trigger', icon: 'tag', title: 'Contact Tag', detail: 'Tag added: hot' },
      { id: 'h2', kind: 'notify', icon: 'bell', title: 'Internal Notification', detail: 'Email · jess@ (left in May)', fault: 'Nobody reads this inbox' },
    ],
  },
  {
    id: 'clean',
    nodes: [
      { id: 'k1', kind: 'trigger', icon: 'form', title: 'Form Submitted', detail: 'Form: Website enquiry' },
      { id: 'k2', kind: 'action', icon: 'opportunity', title: 'Create / Update Opportunity', detail: 'Pipeline: Sales · Stage: New lead' },
      { id: 'k3', kind: 'action', icon: 'tag', title: 'Add Contact Tag', detail: 'source:website' },
      { id: 'k4', kind: 'logic', icon: 'branch', title: 'If / Else', detail: 'Has a phone number?' },
      { id: 'k7', kind: 'notify', icon: 'bell', title: 'Internal Notification', detail: 'Team inbox · one alert per lead' },
    ],
    branch: {
      after: 'k4',
      paths: [
        { label: 'Yes', node: { id: 'k5', kind: 'action', icon: 'sms', title: 'Send SMS', detail: '“Thanks, Alex here…”' } },
        { label: 'No', node: { id: 'k6', kind: 'action', icon: 'email', title: 'Send Email', detail: '“Thanks for asking…”' } },
      ],
    },
  },
];

export interface LogLine {
  readonly time: string;
  readonly text: string;
  readonly fault?: boolean;
}

export interface XStep {
  readonly id: string;
  readonly short: string;
  readonly title: string;
  readonly text: string;
  readonly mode: Mode;
  /** Selected row in the workflow list. */
  readonly wf: string;
  /** Flow shown on the canvas. */
  readonly flow: string;
  readonly log: readonly LogLine[];
  /** Faults found so far (the window's counter). */
  readonly faults: number;
  /** A test contact runs the flow. */
  readonly test?: boolean;
}

export const STEPS: readonly XStep[] = [
  {
    id: 'map',
    short: 'Map',
    title: 'Map what is really there',
    text: 'An example sub-account, opened the way I start every audit: the workflow list, then each workflow as it actually runs, then its execution log.',
    mode: 'before',
    wf: 'w-lead',
    flow: 'lead',
    faults: 0,
    log: [
      { time: '09:14:02', text: 'Sam Rivera enrolled · New Lead' },
      { time: '09:14:02', text: 'Create / Update Opportunity · done' },
      { time: '09:14:03', text: 'Send Email · delivered' },
    ],
  },
  {
    id: 'twice',
    short: 'Fires twice',
    title: 'One form, two workflows',
    text: '“New Lead (copy)” was made to test a change and never switched off. Every form fill enrolls twice: two opportunities in two pipelines, and the same email sent twice.',
    mode: 'before',
    wf: 'w-copy',
    flow: 'copy',
    faults: 1,
    log: [
      { time: '09:14:02', text: 'Sam Rivera enrolled · New Lead' },
      { time: '09:14:02', text: 'Sam Rivera enrolled · New Lead (copy)', fault: true },
      { time: '09:14:03', text: 'Send Email · delivered ×2', fault: true },
    ],
  },
  {
    id: 'never',
    short: 'Never fires',
    title: 'A booking that moves nothing',
    text: 'The booking confirmation is still a draft, so it never runs. Booked leads never reach the Booked stage, and the pipeline report undercounts.',
    mode: 'before',
    wf: 'w-old',
    flow: 'old',
    faults: 2,
    log: [{ time: '—', text: 'No enrollments · workflow is in Draft', fault: true }],
  },
  {
    id: 'nobody',
    short: 'Nobody told',
    title: 'An alert nobody reads',
    text: 'Hot leads trigger an email to an inbox that belonged to someone who left. The workflow reports success; nobody is told.',
    mode: 'before',
    wf: 'w-hot',
    flow: 'hot',
    faults: 3,
    log: [
      { time: '11:02:40', text: 'Sam Rivera enrolled · Hot lead alert' },
      { time: '11:02:40', text: 'Internal Notification · sent to jess@' },
      { time: '—', text: 'No reply · inbox not monitored', fault: true },
    ],
  },
  {
    id: 'rewire',
    short: 'Rewire',
    title: 'Rewired: one trigger, one job',
    text: 'One workflow per trigger, numbered and named by purpose, one pipeline instead of near-copies, and a 99 · System workflow that tells a person when anything fails.',
    mode: 'after',
    wf: 'a-01',
    flow: 'clean',
    faults: 0,
    log: [
      { time: 'Audit', text: 'Renamed and numbered 5 workflows' },
      { time: 'Audit', text: 'Merged 2 pipelines into 1' },
      { time: 'Audit', text: 'Errors now alert 99 · System' },
    ],
  },
  {
    id: 'test',
    short: 'Test',
    title: 'Tested, then handed over',
    text: 'A test contact runs every path end to end before a real lead does. Then you get the map, the naming scheme and a recorded walkthrough of your own account.',
    mode: 'after',
    wf: 'a-01',
    flow: 'clean',
    faults: 0,
    test: true,
    log: [
      { time: 'Test', text: 'Test contact enrolled · 01 · Lead · Web form' },
      { time: 'Test', text: 'Create / Update Opportunity · executed' },
      { time: 'Test', text: 'If / Else · Yes branch' },
      { time: 'Test', text: 'Send SMS · delivered' },
      { time: 'Test', text: 'Internal Notification · team inbox' },
      { time: 'Test', text: 'Passed · 0 errors' },
    ],
  },
];

/** Every card in a flow, in reading order (branch paths after the If/Else). */
export function flowOrder(f: Flow): FlowNode[] {
  const out: FlowNode[] = [];
  for (const n of f.nodes) {
    out.push(n);
    if (f.branch && f.branch.after === n.id) out.push(...f.branch.paths.map((p) => p.node));
  }
  return out;
}
