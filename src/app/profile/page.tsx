"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BadgeCheck,
  Calendar,
  ShieldCheck,
  Lock,
  KeyRound,
  Monitor,
  ChevronRight,
  MapPin,
  CreditCard,
  Download,
  Trash2,
  Plus,
  Pencil,
  Camera,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Address } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { AccountLayout } from "@/components/AccountLayout";

const tabs = ["Personal Information", "Company Information", "Address Book", "Security", "Preferences"];

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, updateProfile, hydrated } = useAppStore();
  const [tab, setTab] = useState(searchParams.get("tab") === "addresses" ? "Address Book" : "Personal Information");

  const [personal, setPersonal] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    designation: user?.designation || "",
    department: user?.department || "",
  });
  const [company, setCompany] = useState({
    company: user?.company || "",
    companyType: user?.companyType || "",
    businessType: user?.businessType || "",
    gstin: user?.gstin || "",
    yearEstablished: user?.yearEstablished || "",
    employeeRange: user?.employeeRange || "",
  });

  const [notif, setNotif] = useState({
    orderUpdates: true,
    quoteUpdates: true,
    promotions: false,
    marketAlerts: true,
  });

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return <div className="mx-auto max-w-lg px-5 py-24 text-center text-sm text-muted">Loading...</div>;
  }

  const savePersonal = () => {
    updateProfile(personal);
  };
  const saveCompany = () => {
    updateProfile(company);
  };

  const initials = user.company.split(" ").map((w) => w[0]).slice(0, 2).join("");

  return (
    <AccountLayout>
      <h1 className="mb-1 font-serif text-2xl sm:text-3xl">Profile Settings</h1>
      <p className="mb-6 text-sm text-muted">Manage your personal information and account preferences.</p>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          {/* Profile header card */}
          <div className="mb-6 rounded-2xl border border-line bg-white p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-terracotta/20 text-xl font-semibold text-terracotta-dark">
                    {initials}
                  </div>
                  <button className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-white">
                    <Camera size={12} />
                  </button>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-serif text-lg">{personal.name}</div>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-800">
                      <BadgeCheck size={12} /> Verified
                    </span>
                  </div>
                  <div className="text-xs text-muted capitalize">
                    {user.role} at {user.company}
                  </div>
                  <div className="mt-0.5 text-xs text-muted">{personal.email} · {personal.phone}</div>
                </div>
              </div>
              <div className="flex gap-6 text-sm sm:border-l sm:border-line sm:pl-6">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted"><Calendar size={12} /> Member Since</div>
                  <div className="font-medium">{user.memberSince}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted"><ShieldCheck size={12} /> Account Status</div>
                  <div className="font-medium text-emerald-700">Active</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-6 overflow-x-auto border-b border-line scrollbar-none">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "shrink-0 whitespace-nowrap border-b-2 py-3 text-sm font-medium",
                  tab === t ? "border-terracotta-dark text-ink" : "border-transparent text-muted"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Personal Information" && (
            <div className="rounded-2xl border border-line bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">Personal Information</h2>
                  <p className="text-xs text-muted">Update your personal details and how we can contact you.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" value={personal.name} onChange={(v) => setPersonal({ ...personal, name: v })} />
                <Field label="Email Address" value={personal.email} onChange={(v) => setPersonal({ ...personal, email: v })} />
                <Field label="Phone Number" value={personal.phone} onChange={(v) => setPersonal({ ...personal, phone: v })} />
                <Field label="Designation" value={personal.designation} onChange={(v) => setPersonal({ ...personal, designation: v })} />
                <Field label="Department" value={personal.department} onChange={(v) => setPersonal({ ...personal, department: v })} />
              </div>
              <button onClick={savePersonal} className="mt-5 rounded-xl bg-ink px-6 py-2.5 text-sm font-semibold text-white">
                Save Changes
              </button>
            </div>
          )}

          {tab === "Company Information" && (
            <div className="rounded-2xl border border-line bg-white p-6">
              <div className="mb-4">
                <h2 className="font-semibold">Company Information</h2>
                <p className="text-xs text-muted">Your company details as shown on your account.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Company Name" value={company.company} onChange={(v) => setCompany({ ...company, company: v })} />
                <Field label="Company Type" value={company.companyType} onChange={(v) => setCompany({ ...company, companyType: v })} />
                <Field label="Business Type" value={company.businessType} onChange={(v) => setCompany({ ...company, businessType: v })} />
                <Field label="GSTIN" value={company.gstin} onChange={(v) => setCompany({ ...company, gstin: v })} />
                <Field label="Year Established" value={company.yearEstablished} onChange={(v) => setCompany({ ...company, yearEstablished: v })} />
                <Field label="Employee Range" value={company.employeeRange} onChange={(v) => setCompany({ ...company, employeeRange: v })} />
              </div>
              <button onClick={saveCompany} className="mt-5 rounded-xl bg-ink px-6 py-2.5 text-sm font-semibold text-white">
                Save Changes
              </button>
            </div>
          )}

          {tab === "Address Book" && <AddressBook />}

          {tab === "Security" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-line bg-white p-6">
                <h2 className="mb-4 font-semibold">Login &amp; Password</h2>
                <div className="divide-y divide-line">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Lock size={16} className="text-terracotta-dark" />
                      <div>
                        <div className="text-sm font-medium">Password</div>
                        <div className="text-xs text-muted">Last changed 45 days ago</div>
                      </div>
                    </div>
                    <button className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold">Change</button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <KeyRound size={16} className="text-terracotta-dark" />
                      <div>
                        <div className="text-sm font-medium">Two-Factor Authentication</div>
                        <div className="text-xs text-emerald-700">Enabled</div>
                      </div>
                    </div>
                    <button className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold">Manage</button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Monitor size={16} className="text-terracotta-dark" />
                      <div>
                        <div className="text-sm font-medium">Login Sessions</div>
                        <div className="text-xs text-muted">3 active sessions</div>
                      </div>
                    </div>
                    <button className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold">View</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "Preferences" && (
            <div className="rounded-2xl border border-line bg-white p-6">
              <h2 className="mb-4 font-semibold">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { key: "orderUpdates", title: "Order Updates", desc: "Get notified about order status" },
                  { key: "quoteUpdates", title: "Quote Updates", desc: "Receive updates on quotes" },
                  { key: "promotions", title: "Promotions & Offers", desc: "New offers and promotions" },
                  { key: "marketAlerts", title: "Market Alerts", desc: "Trends and price alerts" },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-muted">{n.desc}</div>
                    </div>
                    <button
                      onClick={() => setNotif((s) => ({ ...s, [n.key]: !s[n.key as keyof typeof s] }))}
                      className={cn(
                        "h-6 w-11 shrink-0 rounded-full transition",
                        notif[n.key as keyof typeof notif] ? "bg-emerald-600" : "bg-cream-2"
                      )}
                    >
                      <span
                        className={cn(
                          "block h-5 w-5 translate-x-0.5 rounded-full bg-white transition",
                          notif[n.key as keyof typeof notif] && "translate-x-[22px]"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-1 font-semibold">Account Security</div>
            <p className="mb-3 text-xs text-muted">Keep your account safe and secure.</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">Password</span>
                <span className="text-xs">45 days ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Two-Factor Auth</span>
                <span className="text-xs text-emerald-700">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Login Sessions</span>
                <span className="text-xs">3 active</span>
              </div>
            </div>
            <button onClick={() => setTab("Security")} className="mt-3 flex items-center gap-1 text-xs font-medium text-terracotta-dark">
              Review recent activity <ChevronRight size={12} />
            </button>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-1 font-semibold">Notification Preferences</div>
            <p className="mb-3 text-xs text-muted">Choose what updates you want to receive.</p>
            <button onClick={() => setTab("Preferences")} className="flex items-center gap-1 text-xs font-medium text-terracotta-dark">
              Manage all notifications <ChevronRight size={12} />
            </button>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="mb-3 font-semibold">Quick Actions</div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setTab("Address Book")}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-line py-3 text-xs font-medium"
              >
                <MapPin size={16} className="text-terracotta-dark" /> Manage Addresses
              </button>
              <button className="flex flex-col items-center gap-1.5 rounded-xl border border-line py-3 text-xs font-medium">
                <CreditCard size={16} className="text-terracotta-dark" /> Payment Methods
              </button>
              <button className="flex flex-col items-center gap-1.5 rounded-xl border border-line py-3 text-xs font-medium">
                <Download size={16} className="text-terracotta-dark" /> Download Invoice
              </button>
              <button className="flex flex-col items-center gap-1.5 rounded-xl border border-red-200 py-3 text-xs font-medium text-red-600">
                <Trash2 size={16} /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
      />
    </div>
  );
}

function AddressBook() {
  const { addresses, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAppStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Omit<Address, "id" | "isDefault">>({
    label: "",
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const startEdit = (a: Address) => {
    setEditing(a.id);
    setDraft({ label: a.label, name: a.name, phone: a.phone, street: a.street, city: a.city, state: a.state, pincode: a.pincode });
  };

  const saveEdit = () => {
    if (editing) updateAddress(editing, draft);
    setEditing(null);
  };

  const saveNew = () => {
    addAddress({ ...draft, id: `addr-${Date.now()}`, isDefault: addresses.length === 0 });
    setAdding(false);
    setDraft({ label: "", name: "", phone: "", street: "", city: "", state: "", pincode: "" });
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Address Book</h2>
          <p className="text-xs text-muted">Manage your saved shipping addresses.</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 rounded-xl bg-ink px-3.5 py-2 text-xs font-semibold text-white"
        >
          <Plus size={14} /> Add Address
        </button>
      </div>

      <div className="space-y-3">
        {addresses.map((a) =>
          editing === a.id ? (
            <div key={a.id} className="rounded-xl border border-line p-4">
              <AddressForm draft={draft} setDraft={setDraft} />
              <div className="mt-3 flex gap-2">
                <button onClick={saveEdit} className="rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-white">Save</button>
                <button onClick={() => setEditing(null)} className="rounded-lg border border-line px-4 py-2 text-xs font-semibold">Cancel</button>
              </div>
            </div>
          ) : (
            <div key={a.id} className="flex items-start justify-between rounded-xl border border-line p-4">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-terracotta-dark" />
                <div className="text-sm">
                  <div className="flex items-center gap-2 font-medium">
                    {a.label || "Address"}
                    {a.isDefault && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.6rem] font-semibold text-emerald-800">Default</span>}
                  </div>
                  <div className="text-muted">{a.name} · {a.phone}</div>
                  <div className="text-muted">{a.street}, {a.city}, {a.state} - {a.pincode}</div>
                </div>
              </div>
              <div className="flex shrink-0 gap-1.5">
                {!a.isDefault && (
                  <button onClick={() => setDefaultAddress(a.id)} className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium">
                    Set Default
                  </button>
                )}
                <button onClick={() => startEdit(a)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-line">
                  <Pencil size={13} />
                </button>
                <button onClick={() => removeAddress(a.id)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-red-500">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          )
        )}

        {adding && (
          <div className="rounded-xl border border-dashed border-line p-4">
            <AddressForm draft={draft} setDraft={setDraft} />
            <div className="mt-3 flex gap-2">
              <button onClick={saveNew} className="rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-white">Save Address</button>
              <button onClick={() => setAdding(false)} className="rounded-lg border border-line px-4 py-2 text-xs font-semibold">Cancel</button>
            </div>
          </div>
        )}

        {addresses.length === 0 && !adding && (
          <div className="rounded-xl border border-dashed border-line py-10 text-center text-sm text-muted">
            No saved addresses yet.
          </div>
        )}
      </div>
    </div>
  );
}

function AddressForm({
  draft,
  setDraft,
}: {
  draft: Omit<Address, "id" | "isDefault">;
  setDraft: (v: Omit<Address, "id" | "isDefault">) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <input placeholder="Label (e.g. Head Office)" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
      <input placeholder="Contact name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
      <input placeholder="Phone" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
      <input placeholder="Street" value={draft.street} onChange={(e) => setDraft({ ...draft, street: e.target.value })} className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-ink sm:col-span-2" />
      <input placeholder="City" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
      <input placeholder="State" value={draft.state} onChange={(e) => setDraft({ ...draft, state: e.target.value })} className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
      <input placeholder="Pincode" value={draft.pincode} onChange={(e) => setDraft({ ...draft, pincode: e.target.value })} className="rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-ink" />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-muted">Loading profile...</div>}>
      <ProfileContent />
    </Suspense>
  );
}