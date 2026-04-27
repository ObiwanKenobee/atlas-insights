import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

export function TopBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  const initials = (user?.email ?? "?").slice(0, 2).toUpperCase();

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search scenarios, portfolios, signals..."
            className="pl-8 w-80 h-8 text-sm bg-muted/50 border-transparent focus:border-border"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-2 px-2 text-muted-foreground hover:text-foreground">
              <div className="w-6 h-6 rounded-full bg-primary/15 text-primary text-[10px] font-semibold flex items-center justify-center">
                {initials}
              </div>
              <span className="hidden sm:inline text-xs font-medium">{user?.email ?? "Account"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs">
              <div className="flex flex-col">
                <span className="font-medium text-foreground">Signed in</span>
                <span className="text-muted-foreground truncate">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")} className="text-xs">
              <User className="h-3.5 w-3.5 mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut} className="text-xs text-destructive focus:text-destructive">
              <LogOut className="h-3.5 w-3.5 mr-2" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
