import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-lg">AS</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Atlas Sanctum</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">
            Institutional Decision Engine
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 rounded-lg border border-border bg-card p-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="analyst@institution.com"
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-muted/50"
            />
          </div>
          <Button type="submit" className="w-full gap-2">
            <Lock className="h-3.5 w-3.5" />
            Authenticate
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          <p className="text-[10px] text-center text-muted-foreground">
            Secured by institutional-grade encryption. All sessions are monitored.
          </p>
        </form>
      </div>
    </div>
  );
}
