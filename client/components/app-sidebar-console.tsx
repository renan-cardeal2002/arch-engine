'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroupAction
} from "@/components/ui/sidebar"
import { Bot, House, ListChecks, MessageCircle, Server, MessageCircleCode, BookText, Hammer, Mic, SquareKanban, Timer } from "lucide-react"
import { useChatStore } from "@/stores/chat-store"
import ThemeSwitcher from "./theme-switcher"

export function AppSidebarConsole() {
  const pathname = usePathname()
  const router = useRouter()
  const { chats, addChat } = useChatStore()

  const handleAddChat = () => {
    const newChat = addChat()
    router.push(`/chat/${newChat.id}`)
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Bot className="size-4" />
                </div>
                <span className="font-semibold">Console</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Principal</SidebarGroupLabel> */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/home'}>
                <Link href="/home">
                  <House />
                  Início
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          
          <SidebarMenu>
            <SidebarGroupLabel>Serviços</SidebarGroupLabel>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/services'}>
                <Link href="/services">
                  <MessageCircleCode />
                  Chats
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/tasks'}>
                <Link href="/tasks">
                  <ListChecks />
                  Tarefas
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          
          <SidebarMenu>
            <SidebarGroupLabel>Especialistas</SidebarGroupLabel>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/agents'}>
                <Link href="/agents">
                  <Bot />
                  Agentes
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/skills'}>
                <Link href="/skills">
                  <Mic />
                  Habilidades
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/tools'}>
                <Link href="/tools">
                  <Hammer />
                  Ferramentas
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/knowledges'}>
                <Link href="/knowledges">
                  <BookText />
                  Conhecimento
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarMenu>
            <SidebarGroupLabel>Workloads</SidebarGroupLabel>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/workloads'}>
                <Link href="/workloads">
                  <SquareKanban />
                  Cargas de trabalho
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/schedule'}>
                <Link href="/schedule">
                  <Timer />
                  Agendamentos
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarMenu>
            <SidebarGroupLabel>Configurações</SidebarGroupLabel>
          </SidebarMenu>

        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <MessageCircle />
                  <span>Chat</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
      </SidebarFooter>
      <SidebarFooter>
        <div className="flex flex-col items-center text-sm gap-4">
          <ThemeSwitcher />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}