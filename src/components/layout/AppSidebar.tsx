import { Shield, Eye, BookOpen, Lock, Unlock, Image } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Cryptography", url: "/cryptography", icon: Shield },
  { title: "Steganography", url: "/steganography", icon: Eye },
  { title: "Learn", url: "/learn", icon: BookOpen },
];

const cryptoItems = [
  { title: "Caesar Cipher", url: "/cryptography/caesar", icon: Lock },
  { title: "Vigenère Cipher", url: "/cryptography/vigenere", icon: Unlock },
];

const stegoItems = [
  { title: "Text in Image", url: "/steganography/text-image", icon: Image },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isCollapsed = state === "collapsed";
  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/");
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-bold text-lg mb-4">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                CryptoLab
              </div>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Cryptography Tools */}
        {!isCollapsed && currentPath.startsWith('/cryptography') && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground">
              Crypto Tools
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {cryptoItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => getNavCls({ isActive })}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Steganography Tools */}
        {!isCollapsed && currentPath.startsWith('/steganography') && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground">
              Stego Tools
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {stegoItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => getNavCls({ isActive })}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}