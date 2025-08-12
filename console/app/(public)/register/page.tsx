"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (password !== confirm) {
      setFormError("As senhas não conferem.");
      return;
    }

    try {
      setLoading(true);
      // TODO: chame seu backend aqui
      // const res = await fetch("/api/register", { ... });
      // if (!res.ok) throw new Error("Falha no cadastro");
      console.log({ name, email }); // placeholder
      // redirecionar para /login ou dashboard
      // router.push("/login");
    } catch (err: any) {
      setFormError(err.message ?? "Erro ao registrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-primary/5 flex flex-col">
      {/* topo com link para login */}
      <header className="w-full py-4 px-6 flex justify-end">
        <Link href="/login">
          <Button variant="outline">Já tenho conta</Button>
        </Link>
      </header>

      {/* card central */}
      <main className="flex flex-1 items-center">
        <div className="container px-4 py-8 mx-auto max-w-md">
          <div className="space-y-8 bg-background/80 rounded-xl shadow-lg backdrop-blur p-6">
            <div className="text-center space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Criar conta
              </h1>
              <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
              <p className="text-muted-foreground">
                Cadastre-se para usar o Console Geckos AI.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="name">Nome</label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email">E-mail</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password">Senha</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm">Confirmar senha</label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registrando..." : "Registrar"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Já é cadastrado?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
