import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getGetOdooStatusQueryKey, useGetOdooStatus } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw, CheckCircle2, XCircle, Database, AlertCircle, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState, type FormEvent } from "react";

export default function AdminIntegrations() {
  const queryClient = useQueryClient();
  const { data: odooStatus, isLoading, error } = useGetOdooStatus();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [odooConfig, setOdooConfig] = useState({ url: "", database: "", username: "", password: "" });
  const [saveState, setSaveState] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((response) => response.json() as Promise<{ role?: string }>)
      .then((body) => setIsSuperAdmin(body.role === "super_admin"))
      .catch(() => setIsSuperAdmin(false));
  }, []);

  async function saveOdooConfig(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaveState(null);
    try {
      const response = await fetch("/api/admin/integrations/odoo/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(odooConfig),
      });
      const body = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(body.error ?? "Could not save Odoo configuration.");
      setOdooConfig((current) => ({ ...current, password: "" }));
      setSaveState({ kind: "success", text: body.message ?? "Odoo configuration saved securely." });
      await queryClient.invalidateQueries({ queryKey: getGetOdooStatusQueryKey() });
    } catch (saveError) {
      setSaveState({
        kind: "error",
        text: saveError instanceof Error ? saveError.message : "Could not save Odoo configuration.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary mb-1">Integrations</h1>
        <p className="text-gray-500 text-sm">Manage third-party connections and sync settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Odoo Integration Card */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#714B67] rounded-lg flex items-center justify-center text-white">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Odoo ERP</CardTitle>
                  <CardDescription>Accounting & CRM Sync</CardDescription>
                </div>
              </div>
              
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
              ) : error ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : odooStatus?.connected ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                  <XCircle className="w-3.5 h-3.5" /> Disconnected
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="py-8 text-center text-gray-500">Checking status...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">Failed to load Odoo integration status.</div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border border-gray-100">
                  <p className="mb-2"><strong>Status Message:</strong> {odooStatus?.message}</p>
                  {odooStatus?.lastSyncAt && (
                    <p><strong>Last Global Sync:</strong> {format(new Date(odooStatus.lastSyncAt), 'MMM d, yyyy HH:mm')}</p>
                  )}
                  {!odooStatus?.connected && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded text-red-700 text-xs">
                      The Odoo connection is currently disabled or authorization was dismissed. Reconnect to resume client synchronization.
                    </div>
                  )}
                </div>

                {isSuperAdmin && (
                  <div className="space-y-4 rounded-lg border border-[#714B67]/20 bg-[#714B67]/5 p-4">
                    <div>
                      <h3 className="font-semibold text-secondary">Super Admin configuration</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Odoo credentials are encrypted before being stored and are never returned to the browser.
                      </p>
                    </div>
                    <form onSubmit={saveOdooConfig} className="space-y-3">
                      <div>
                        <Label htmlFor="odoo-url">Odoo URL</Label>
                        <Input id="odoo-url" type="url" placeholder="https://odoo.example.com" value={odooConfig.url} onChange={(event) => setOdooConfig({ ...odooConfig, url: event.target.value })} required />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="odoo-database">Database</Label>
                          <Input id="odoo-database" value={odooConfig.database} onChange={(event) => setOdooConfig({ ...odooConfig, database: event.target.value })} required />
                        </div>
                        <div>
                          <Label htmlFor="odoo-username">Username</Label>
                          <Input id="odoo-username" type="email" value={odooConfig.username} onChange={(event) => setOdooConfig({ ...odooConfig, username: event.target.value })} required />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="odoo-password">Password</Label>
                        <Input id="odoo-password" type="password" autoComplete="new-password" value={odooConfig.password} onChange={(event) => setOdooConfig({ ...odooConfig, password: event.target.value })} required />
                      </div>
                      {saveState && (
                        <p className={`text-sm ${saveState.kind === "success" ? "text-green-700" : "text-red-700"}`}>
                          {saveState.text}
                        </p>
                      )}
                      <Button type="submit" disabled={saving} className="bg-[#714B67] text-white hover:bg-[#5b3c53]">
                        {saving ? "Saving securely…" : "Save Odoo configuration"}
                      </Button>
                    </form>
                  </div>
                )}
                {!isSuperAdmin && (
                  <div className="text-xs text-gray-500 text-center">
                    Only Super Admins can manage integrations.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Placeholder for future integrations */}
        <Card className="shadow-sm border-gray-200 border-dashed bg-gray-50/50">
          <CardContent className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
            <ExternalLink className="w-8 h-8 mb-3 opacity-50" />
            <h3 className="font-medium text-gray-600 mb-1">More Integrations</h3>
            <p className="text-sm">Additional third-party connections will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}