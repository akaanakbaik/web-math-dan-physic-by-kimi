import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export async function askAI(prompt, system = 'You are a helpful PhD-level physics and mathematics assistant.') {
  const res = await api.get('/ai/qwq32b', {
    params: { prompt, system, temperature: 0.7 },
  });
  return res.data;
}

export async function getFormulaExplanation(formula, context) {
  const prompt = `Explain the formula ${formula} in the context of ${context}. Provide step-by-step derivation.`;
  return askAI(prompt);
}

export async function getUnsolvedProblemInsight(problem) {
  const prompt = `Provide current research insights on the unsolved problem: ${problem}. Include recent approaches and why it remains unsolved.`;
  return askAI(prompt);
}

export async function getPhysicsSimulationInsight(simulationType, params) {
  const prompt = `Analyze the ${simulationType} simulation with parameters ${JSON.stringify(params)}. Explain the physical significance of each parameter and expected behavior.`;
  return askAI(prompt);
}

export async function getMathVisualizationInsight(visualizationType, params) {
  const prompt = `Explain the mathematical visualization ${visualizationType} with parameters ${JSON.stringify(params)}. Describe the underlying mathematical structure and its significance.`;
  return askAI(prompt);
}

export default api;
