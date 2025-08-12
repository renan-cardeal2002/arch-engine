export async function getAllSkills() {
  const res = await fetch("/api/skill");
  if (!res.ok) throw new Error("Erro ao buscar habilidades");
  return await res.json();
}
