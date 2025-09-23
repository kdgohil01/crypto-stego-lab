import { Shield, Eye, BookOpen, Lock, Unlock, Image, Volume2, MousePointer, Database, Link, FileText, Hash, QrCode, Binary, Home, ShieldCheck, Key, Video } from "lucide-react";
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
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Cryptography", url: "/cryptography", icon: Shield },
  { title: "Steganography", url: "/steganography", icon: Eye },
  { title: "Multilayered Security", url: "/multilayered-security", icon: ShieldCheck },
  { title: "Data Processing Tools", url: "/data-processing", icon: Database },
  { title: "Learn", url: "/learn", icon: BookOpen },
];

const cryptoItems = [
  { title: "Caesar Cipher", url: "/cryptography/caesar", icon: Lock },
  { title: "Vigenère Cipher", url: "/cryptography/vigenere", icon: Unlock },
  { title: "AES-256", url: "/cryptography/aes", icon: Shield },
  { title: "RSA-2048", url: "/cryptography/rsa", icon: Key },
];

const stegoItems = [
  { title: "Text in Image", url: "/steganography/text-image", icon: Image },
  { title: "Click Sequential Authentication", url: "/steganography/click-sequence", icon: MousePointer },
  { title: "Text in Audio", url: "/steganography/audio", icon: Volume2 },
  { title: "Audio Steganography", url: "/steganography/audio-steganography", icon: Volume2 },
  { title: "Text in Video", url: "/steganography/video", icon: Video },
  { title: "Video Steganography", url: "/steganography/video-steganography", icon: Video },
];

const dataProcessingItems = [
  { title: "URL Processor", url: "/data-processing/url-processor", icon: Link },
  { title: "JSON Formatter", url: "/data-processing/json-formatter", icon: FileText },
  { title: "Hash Generator", url: "/data-processing/hash-generator", icon: Hash },
  { title: "QR Code Generator", url: "/data-processing/qr-generator", icon: QrCode },
  { title: "Binary Converter", url: "/data-processing/binary-converter", icon: Binary },
];

const multilayeredSecurityItems = {
  title: "Multilayered Security",
  icon: ShieldCheck,
  url: "#",
  items: [
    {
      title: "Overview",
      url: "/multilayered-security",
    },
    {
      title: "Guardian Layer",
      url: "/multilayered-security/guardian-layer",
    },
  ],
};

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

        {/* Multilayered Security Tools */}
        {!isCollapsed && currentPath.startsWith('/multilayered-security') && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground">
              Military-Grade Security
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {multilayeredSecurityItems.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => getNavCls({ isActive })}
                      >
                        <multilayeredSecurityItems.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Data Processing Tools */}
        {!isCollapsed && currentPath.startsWith('/data-processing') && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground">
              Processing Tools
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {dataProcessingItems.map((item) => (
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