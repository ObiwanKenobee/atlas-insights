import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { KeyRound, LogOut, Mail, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [alertNotifications, setAlertNotifications] = useState(true);
  const [autoRunSimulations, setAutoRunSimulations] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        toast({
          title: "Could not load profile",
          description: error.message,
          variant: "destructive",
        });
      } else if (data) {
        setDisplayName(data.display_name ?? "");
        setAvatarUrl(data.avatar_url ?? "");
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Profile updated" });
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/login`,
    });
    setResetting(false);
    if (error) {
      toast({
        title: "Could not send reset email",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Reset email sent",
        description: `Check ${user.email} for instructions.`,
      });
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Account, security, and application preferences.
          </p>
        </div>

        {/* Profile */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-6">
          <SectionHeader title="Profile" subtitle="Visible across the platform" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Display name
              </Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="bg-muted/50"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </Label>
              <Input value={user?.email ?? ""} className="bg-muted/50" disabled />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Avatar URL
              </Label>
              <Input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://…"
                className="bg-muted/50"
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={handleSave} disabled={saving || loading}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <SectionHeader title="Security" subtitle="Account protection" />

          <div className="flex items-start justify-between gap-4 rounded-md border border-border bg-muted/20 p-3">
            <div className="flex items-start gap-2">
              <KeyRound className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-foreground">Reset password</p>
                <p className="text-xs text-muted-foreground">
                  We'll email you a secure link to set a new password.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePasswordReset}
              disabled={resetting || !user?.email}
              className="gap-1.5 shrink-0"
            >
              <Mail className="h-3.5 w-3.5" />
              {resetting ? "Sending…" : "Send reset email"}
            </Button>
          </div>

          <div className="flex items-start justify-between gap-4 rounded-md border border-border bg-muted/20 p-3">
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-foreground">Active session</p>
                <p className="text-xs text-muted-foreground">
                  Sign out on this device to end your current session.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="gap-1.5 shrink-0"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </Button>
          </div>
        </div>

        {/* Preferences */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <SectionHeader title="Preferences" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Alert notifications</p>
              <p className="text-xs text-muted-foreground">
                Receive in-app alerts when new critical risks are detected.
              </p>
            </div>
            <Switch
              checked={alertNotifications}
              onCheckedChange={setAlertNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Auto-run simulations</p>
              <p className="text-xs text-muted-foreground">
                Automatically run a simulation when a new scenario is activated.
              </p>
            </div>
            <Switch
              checked={autoRunSimulations}
              onCheckedChange={setAutoRunSimulations}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
