import React from "react";
import SettingsClient from "@/components/blocks/admin/SettingsClient";
import { getAdminProfileAction, getPlatformPreferencesAction } from "@/actions/admin";

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const [profileRes, prefsRes] = await Promise.all([
    getAdminProfileAction(),
    getPlatformPreferencesAction()
  ]);

  const initialProfile = profileRes.success && profileRes.admin ? profileRes.admin : null;
  const initialPreferences = prefsRes.success && prefsRes.preferences ? prefsRes.preferences : null;

  return (
    <SettingsClient 
      initialProfile={initialProfile}
      initialPreferences={initialPreferences}
    />
  );
}
