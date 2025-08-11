export async function getAgent(id: string) {
  const res = await fetch(`/api/agent/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar agente");
  return await res.json();
}

export async function getAgentSkills(id: string) {
  const res = await fetch(`/api/agent/${id}/skills`);
  if (!res.ok) throw new Error("Erro ao buscar habilidades do agente");
  return await res.json();
}

export async function addAgentSkill(agentId: string, skillId: string) {
  const res = await fetch(`/api/agent/${agentId}/skills`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agent_id: agentId, skill_id: skillId }),
  });
  if (!res.ok) throw new Error("Erro ao vincular habilidade ao agente");
  return await res.json();
}
