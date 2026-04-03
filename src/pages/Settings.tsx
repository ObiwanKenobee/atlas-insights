import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Account and application configuration</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 space-y-6">
          <SectionHeader title="Profile" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Name</Label>
              <Input defaultValue="Sarah Chen" className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
              <Input defaultValue="s.chen@institution.com" className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Role</Label>
              <Input defaultValue="Head of Risk Analytics" className="bg-muted/50" disabled />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Institution</Label>
              <Input defaultValue="Atlas Capital Partners" className="bg-muted/50" disabled />
            </div>
          </div>

          <Separator />

          <SectionHeader title="Preferences" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Use dark theme across the application</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Alert Notifications</p>
                <p className="text-xs text-muted-foreground">Receive real-time alert notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">Simulation Auto-Run</p>
                <p className="text-xs text-muted-foreground">Automatically run simulations on new scenarios</p>
              </div>
              <Switch />
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button size="sm">Save Changes</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
