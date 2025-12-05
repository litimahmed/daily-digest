import { Bell, Menu, Search, HelpCircle, Settings, LogOut, User, Shield, Loader2, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLogout } from "@/hooks/admin/useLogout";

export function DashboardHeader() {
  const { logout, isLoading: isLoggingOut } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="h-16 bg-[hsl(var(--header-background))] border-b border-[hsl(var(--header-border))] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-50 shadow-[var(--shadow-header)] backdrop-blur-xl">
      <div className="flex items-center gap-4">
        {/* Sidebar Trigger */}
        <SidebarTrigger className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent rounded-lg transition-all duration-200">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
        
        {/* Search Bar */}
        <div className="relative hidden md:flex items-center">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search..."
              className="w-64 lg:w-80 pl-9 pr-12 h-9 bg-muted/40 border-transparent rounded-lg text-sm placeholder:text-muted-foreground/50 focus:bg-background focus:border-primary/20 focus:ring-1 focus:ring-primary/10 transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 text-xs text-muted-foreground/50">
              <kbd className="px-1.5 py-0.5 bg-muted/60 rounded text-[10px] font-medium">⌘K</kbd>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Help Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
        >
          <HelpCircle className="h-[18px] w-[18px]" />
        </Button>

        {/* Notifications Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 relative"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full ring-2 ring-[hsl(var(--header-background))]" />
        </Button>

        {/* Divider */}
        <div className="w-px h-6 bg-border/60 mx-2 hidden sm:block" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2.5 h-9 px-2 rounded-lg hover:bg-muted/50 transition-all duration-200 group"
            >
              <div className="relative">
                <Avatar className="h-7 w-7 ring-1 ring-border/50 group-hover:ring-primary/30 transition-all">
                  <AvatarImage src="" alt="Admin" />
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium text-xs">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[hsl(var(--header-background))] rounded-full" />
              </div>
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-sm font-medium text-foreground leading-tight">Admin</span>
                <span className="text-[11px] text-muted-foreground leading-tight">Super Admin</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 p-1" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-1 ring-primary/20">
                  <AvatarImage src="" alt="Admin" />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium leading-none">Admin User</p>
                  <p className="text-xs leading-none text-muted-foreground">admin@toorrii.com</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem className="py-2 px-3 cursor-pointer rounded-md">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2 px-3 cursor-pointer rounded-md">
              <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem 
              onClick={handleLogout} 
              disabled={isLoggingOut} 
              className="py-2 px-3 cursor-pointer rounded-md text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              {isLoggingOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
