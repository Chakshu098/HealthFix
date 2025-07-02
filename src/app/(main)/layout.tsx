'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Home, Stethoscope, Camera, MessageSquare, FileText, Settings, MapPin, Video, Tags } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmergencySos } from '@/components/features/emergency-sos';
import { ReportsProvider } from '@/context/reports-context';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/symptom-diagnosis', label: 'Symptom Diagnosis', icon: Stethoscope },
  { href: '/image-diagnosis', label: 'Image Diagnosis', icon: Camera },
  { href: '/nearby-centers', label: 'Nearby Centers', icon: MapPin },
  { href: '/chatbot', label: 'AI Chatbot', icon: MessageSquare },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/video-consultation', label: 'Video Consultation', icon: Video },
  { href: '/pricing', label: 'Pricing', icon: Tags },
];

function MainSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r-0 sm:border-r"
    >
      <SidebarHeader className="h-16 flex items-center justify-between p-4">
        <Logo />
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label }}
                className="justify-start"
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <div className="p-4 border-t">
         <div className="flex items-center gap-3">
            <Avatar>
                <AvatarImage src="https://placehold.co/100x100.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className={`overflow-hidden transition-all duration-300 ${state === 'collapsed' ? 'w-0' : 'w-full'}`}>
                <p className="font-semibold text-sm">Guest User</p>
                <p className="text-xs text-muted-foreground">guest@healthfix.com</p>
            </div>
         </div>
      </div>
    </Sidebar>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReportsProvider>
      <SidebarProvider defaultOpen>
        <div className="flex min-h-screen">
          <MainSidebar />
          <SidebarInset className="flex-1 bg-background relative">
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:justify-end">
              <div className="md:hidden">
                  <Logo />
              </div>
              <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon"><Settings/></Button>
                   <div className="hidden md:block">
                     <SidebarTrigger />
                  </div>
              </div>
            </header>
            <main className="flex-1 p-4 sm:p-6 md:p-8">
              {children}
              <EmergencySos />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ReportsProvider>
  );
}
