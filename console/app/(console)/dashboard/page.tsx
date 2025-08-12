"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  Play,
  RefreshCw,
  Settings,
  Shield,
  BarChart3,
  Search,
  Users,
} from "lucide-react";

const kpis = [
  { label: "Agentes", value: 12, diff: "+3", trend: "up" as const, icon: Bot },
  {
    label: "Execuções (30d)",
    value: 2847,
    diff: "+12%",
    trend: "up" as const,
    icon: Play,
  },
  {
    label: "Falhas (30d)",
    value: 37,
    diff: "-18%",
    trend: "down" as const,
    icon: Shield,
  },
  {
    label: "Usuários ativos",
    value: 26,
    diff: "+2",
    trend: "up" as const,
    icon: Users,
  },
];

const agentsShare = [
  { name: "Atendimento", value: 38 },
  { name: "Relatórios", value: 22 },
  { name: "E-commerce", value: 15 },
  { name: "WhatsApp", value: 12 },
  { name: "Outros", value: 13 },
];

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"]; // Tailwind palette

export default function DashboardPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-primary/5">
      {/* Top bar */}
      <div className="sticky top-0 z-10 backdrop-blur bg-background/60 border-b">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <BarChart3 className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Console Dashboard</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4" /> Atualizar
            </Button>
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <a href="/settings">
                <Settings className="h-4 w-4" /> Configurações
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map(({ label, value, diff, trend, icon: Icon }) => (
            <Card key={label} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {value.toLocaleString()}
                </div>
                <p
                  className={`text-xs mt-1 flex items-center gap-1 ${
                    trend === "up" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}{" "}
                  {diff}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts & side panel */}
        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Uso por dia</CardTitle>
            </CardHeader>
            <CardContent className="h-72"></CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por agente</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <div className="mt-4 grid grid-cols-2 gap-2">
                {agentsShare.map((a, i) => (
                  <div key={a.name} className="flex items-center gap-2 text-sm">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-muted-foreground">{a.name}</span>
                    <span className="ml-auto font-medium">{a.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity & quick actions */}
        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <CardTitle>Atividade recente</CardTitle>
                <Separator orientation="vertical" className="h-6" />
                <div className="relative ml-auto w-64">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por agente ou ID"
                    className="pl-8"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent></CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              <div className="space-y-2">
                <label>Status geral</label>
                <div className="flex items-center gap-2 text-sm">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">
                    Fila saudável • 4 workers ativos
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
