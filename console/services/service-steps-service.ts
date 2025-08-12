export async function getSteps(serviceId: string) {
  const res = await fetch(`/api/service/${serviceId}/step`);
  if (!res.ok) throw new Error("Erro ao buscar etapas");
  return await res.json();
}

export async function addStep(
  serviceId: string,
  name: string,
  prompt_instruction: string,
  expected_output: string,
  status: string
) {
  const res = await fetch(`/api/service/${serviceId}/step`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, prompt_instruction, expected_output, status }),
  });
  if (!res.ok) throw new Error("Erro ao adicionar etapa");
  return await res.json();
}
