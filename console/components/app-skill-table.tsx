export default function SkillTable({ skills }: { skills: any[] }) {
  return (
    <table className="min-w-full">
      <thead>
        <tr className="text-neutral-600 dark:text-neutral-300">
          <th className="py-2 px-4 text-left">Nome</th>
          <th className="py-2 px-4 text-left">Descrição</th>
          <th className="py-2 px-4 text-left">Ações</th>
        </tr>
      </thead>
      <tbody>
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <tr
              key={index}
              className="border-t border-neutral-200 dark:border-neutral-800"
            >
              <td className="py-2 px-4">{skill.name}</td>
              <td className="py-2 px-4">{skill.description}</td>
              <td className="py-2 px-4"></td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} className="text-center opacity-80">
              Nenhuma habilidade vinculada a essa tarefa
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
