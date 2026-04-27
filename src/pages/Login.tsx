import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  const redirectTo = (location.state as { from?: string } | null)?.from || "/dashboard";

  useEffect(() => {
    if (!loading && user) navigate(redirectTo, { replace: true });
  }, [loading, user, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;
        toast({
          title: "Account provisioned",
          description: "You may now sign in with your credentials.",
        });
        setMode("signin");
      }
    } catch (err: any) {
      toast({
        title: "Authentication failed",
        description: err.message ?? "Please verify your credentials.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
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

        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {mode === "signin" ? "Sign In" : "Provision Account"}
            </span>
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-[10px] uppercase tracking-wider text-primary hover:underline"
            >
              {mode === "signin" ? "Create Account" : "Have an account?"}
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
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
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-muted/50"
            />
          </div>
          <Button type="submit" className="w-full gap-2" disabled={submitting}>
            <Lock className="h-3.5 w-3.5" />
            {submitting ? "Authenticating..." : mode === "signin" ? "Authenticate" : "Provision"}
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
