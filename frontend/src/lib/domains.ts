export const PIPELINE_STAGES = [
  { id: 'intent', label: 'Intent Classification', caption: 'Extract entity & operation' },
  { id: 'routing', label: 'Capability Routing', caption: 'Locate verified handler' },
  { id: 'sql', label: 'Deterministic SQL Execution', caption: 'Run verified SQL query' },
  { id: 'evidence', label: 'Evidence Serialization', caption: 'Build immutable proof set' },
  { id: 'synthesis', label: 'LLM Reasoning & Synthesis', caption: 'Generate structured insight' },
]
