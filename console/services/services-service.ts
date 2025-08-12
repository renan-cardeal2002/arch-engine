export async function getServices() {
  const res = await fetch(`/api/service`);
  if (!res.ok) throw new Error("Erro ao buscar serviços");
  return await res.json();
}

export async function addService(
  name: string,
  description: string,
  service_type: string
) {
  const res = await fetch(`/api/service`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description, service_type }),
  });
  if (!res.ok) throw new Error("Erro ao adicionar serviço");
  return await res.json();
}
