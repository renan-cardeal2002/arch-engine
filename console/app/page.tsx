"use client";

import { backendFetch } from "@/lib/backend";
import { useRouter } from "next/navigation";

export default async function WelcomePage() {
  const router = useRouter();
  const meRes = await backendFetch("/me"); // tua rota protegida no Go
  if (!meRes.ok) {
    // se token inválido/expirado, opcionalmente lançar redirect aqui
    // import { redirect } from "next/navigation"; redirect("/login");
  }
  const me = meRes.ok ? await meRes.json() : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-primary/5 flex items-center">
      <pre className="text-sm">{JSON.stringify(me, null, 2)}</pre>
      <div className="container px-4 py-8 mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-3 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Seja bem vindo ao Console Geckos AI
          </h1>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </div>

        {/* About Section */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-lg text-muted-foreground leading-relaxed">
            A nossa plataforma de criação agentes de IA!
          </p>
        </div>

        {/* Capabilities Section */}
        <div className="space-y-8">
          <h3 className="text-3xl font-semibold text-center">
            Saiba como você pode usar a nossa ferramenta
          </h3>
          <div className="grid md:grid-cols-2 gap-3 max-w-4xl mx-auto">
            <FeatureBlock
              title="Criar agentes de IA"
              description="Monte agentes inteligentes para automatizar tarefas e interações, tudo do seu jeito."
            />
            <FeatureBlock
              title="Criar tarefas autônomas"
              description="Automatize processos e deixe o sistema rodar tarefas sozinho, sem precisar ficar de olho."
            />
            <FeatureBlock
              title="Criar ChatBot personalizado"
              description="Crie chats inteligentes do zero, com respostas e comportamentos feitos pra sua necessidade."
            />
            <FeatureBlock
              title="Integrar com o Whatsapp"
              description="Conecte seu agente de IA direto no WhatsApp e atenda clientes automaticamente."
            />
            <FeatureBlock
              title="Integrar com uma Loja Online"
              description="Integre sua IA com lojas virtuais para automatizar vendas, suporte e atendimento."
            />
            <FeatureBlock
              title="Acesse nossa documentação..."
              description="Veja a documentação completa e tire qualquer dúvida rapidinho."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureBlock({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="group p-4 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors duration-300">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
