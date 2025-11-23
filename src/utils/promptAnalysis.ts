export const FRAMEWORKS = {
  MICRO: { name: 'MICRO', fields: ['Message', 'Intention', 'Context', 'Rhythm', 'Output'] },
  COSTAR: { name: 'COSTAR', fields: ['Context', 'Offer', 'Style', 'Target', 'Action', 'Result'] },
  ICDF: { name: 'ICDF', fields: ['Instruction', 'Context', 'Data', 'Format'] },
  RCREOC: { name: 'RCREOC', fields: ['Role', 'Context', 'Request', 'Examples', 'Output', 'Constraints'] }
};

export function analyzePromptIntent(input: string): string {
  const text = input.toLowerCase();
  if (/(sell|buy|marketing|email|ad|promotion|campaign|offer)/.test(text)) return 'COSTAR';
  if (/(analyze|review|data|metrics|report)/.test(text)) return 'ICDF';
  if (/(expert|advice|consult|critique)/.test(text)) return 'RCREOC';
  return 'MICRO';
}