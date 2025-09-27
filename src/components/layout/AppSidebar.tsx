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
  { 
    title: "Transport Cipher", 
    url: "/cryptography/transport", 
    icon: () => (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ) 
  },
  { title: "AES-256", url: "/cryptography/aes", icon: Shield },
  { title: "RSA-2048", url: "/cryptography/rsa", icon: Key },
];

const stegoItems = [
  { 
    title: "Text in Image", 
    url: "/steganography/text-image", 
    icon: Image,
    comingSoon: false
  },
  { 
    title: "Click Sequential Authentication", 
    url: "/steganography/click-sequence", 
    icon: MousePointer,
    comingSoon: false
  },
  { 
    title: "Text in Audio", 
    url: "/steganography/audio", 
    icon: Volume2,
    comingSoon: false
  },
  { 
    title: "Text in Video", 
    url: "/steganography/video", 
    icon: Video,
    comingSoon: false
  },
  { 
    title: "Audio Steganography", 
    url: "/steganography/audio-steganography", 
    icon: Volume2,
    comingSoon: true
  },
  { 
    title: "Video Steganography", 
    url: "/steganography/video-steganography", 
    icon: Video,
    comingSoon: true
  },
];

const availableStegoItems = stegoItems.filter(item => !item.comingSoon);
const comingSoonStegoItems = stegoItems.filter(item => item.comingSoon);

const dataProcessingItems = [
  { 
    title: "URL Processor", 
    url: "/data-processing/url-processor", 
    icon: Link,
  },
  { 
    title: "Binary Converter", 
    url: "/data-processing/binary-converter", 
    icon: Binary,
  }
];

const comingSoonItems = [
  { 
    title: "JSON Formatter", 
    icon: FileText,
  },
  { 
    title: "Hash Generator", 
    icon: Hash,
  },
  { 
    title: "QR Code Generator", 
    icon: QrCode,
  },
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
                {availableStegoItems.map((item) => (
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
                
                <div className="mt-4 mb-2 px-3">
                  <p className="text-xs font-medium text-muted-foreground">COMING SOON</p>
                </div>
                
                {comingSoonStegoItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className="opacity-60 text-muted-foreground hover:text-muted-foreground"
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
                
                <div className="mt-4 mb-2 px-3">
                  <p className="text-xs font-medium text-muted-foreground">COMING SOON</p>
                </div>
                
                {comingSoonItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton className="opacity-60 cursor-not-allowed">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{item.title}</span>
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