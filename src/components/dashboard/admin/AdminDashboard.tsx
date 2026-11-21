"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Ban,
  Check,
  CircleDollarSign,
  CircleUserRound,
  Clock3,
  Eye,
  Filter,
  LoaderCircle,
  RefreshCw,
  Search,
  Store,
  Trash2,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ErrorState } from "@/components/shared/ErrorState";
import { Loading } from "@/components/shared/Loading";
import type { ServiceStatus, UserRole } from "@/types";
import { toast } from "sonner";

type AdminStats = {
  totalUsers: number;
  vendors: number;
  customers: number;
  totalServices: number;
  pendingServices: number;
  totalTransactions: number;
};
type AdminUser = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  image?: string;
  isBlocked?: boolean;
  createdAt?: string;
  businessName?: string;
};
type AdminService = {
  _id?: string;
  id?: string;
  serviceName: string;
  category?: string;
  location?: string;
  price?: number;
  currency?: string;
  images?: string[];
  vendorId?: string;
  vendor?: { name?: string; email?: string; businessName?: string };
  status?: ServiceStatus;
  isActive?: boolean;
  createdAt?: string;
};
type AdminTransaction = {
  _id?: string;
  id?: string;
  vendorId?: string;
  vendor?: { name?: string; email?: string; businessName?: string };
  plan?: string;
  amount?: number;
  currency?: string;
  status?: string;
  createdAt?: string;
};

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const apiBase = "/api/backend";
  const endpoint = url.replace(/^\/api(?=\/)/, "");
  const response = await fetch(`${apiBase}${endpoint}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = (await response.json().catch(() => ({}))) as T & {
    message?: string;
  };
  if (!response.ok)
    throw new Error(body.message || "The request could not be completed.");
  return body;
}

function itemId(item: { _id?: string; id?: string }) {
  return item.id ?? item._id ?? "";
}
function shortDate(value?: string) {
  if (!value || Number.isNaN(new Date(value).getTime())) return "—";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function transactionStatusClass(status: string) {
  const value = status.toLowerCase();
  if (["succeeded", "success", "paid", "complete", "completed"].includes(value)) {
    return "bg-emerald-50 text-emerald-800";
  }
  if (["failed", "canceled", "cancelled", "expired"].includes(value)) {
    return "bg-rose-50 text-rose-800";
  }
  return "bg-amber-50 text-amber-800";
}

function formatTransactionAmount(amount?: number, currency?: string) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: (currency || "USD").toUpperCase(),
    }).format(value);
  } catch {
    return value.toFixed(2) + " " + (currency || "USD");
  }
}

export function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentServices, setRecentServices] = useState<AdminService[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    Promise.all([
      requestJson<AdminStats>("/api/admin/overview"),
      requestJson<AdminService[]>("/api/admin/services?status=pending"),
    ])
      .then(([summary, services]) => {
        if (active) {
          setStats(summary);
          setRecentServices(services.slice(0, 4));
        }
      })
      .catch((cause) => {
        if (active)
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not load admin overview.",
          );
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl">
      <Header
        eyebrow="Platform at a glance"
        title="Admin overview"
        description="Keep an eye on WedPlan activity and the listings that need your review."
        action={{
          href: "/dashboard/admin/services?status=pending",
          label: "Review pending services",
        }}
      />
      {error ? (
        <ErrorState message={error} />
      ) : !stats ? (
        <Loading label="Loading platform overview…" />
      ) : (
        <>
          <section
            aria-label="Platform statistics"
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
          >
            {" "}
            <Metric
              label="Registered users"
              value={stats.totalUsers}
              note="All platform accounts"
              icon={Users}
              tone="rose"
              href="/dashboard/admin/users"
            />
            <Metric
              label="Vendors"
              value={stats.vendors}
              note="Service providers"
              icon={Store}
              tone="violet"
              href="/dashboard/admin/users?role=vendor"
            />
            <Metric
              label="Customers"
              value={stats.customers}
              note="People planning celebrations"
              icon={CircleUserRound}
              tone="amber"
              href="/dashboard/admin/users?role=customer"
            />
            <Metric
              label="Services"
              value={stats.totalServices}
              note="All submitted listings"
              icon={Activity}
              tone="blue"
              href="/dashboard/admin/services"
            />
            <Metric
              label="Pending services"
              value={stats.pendingServices}
              note="Waiting for moderation"
              icon={Clock3}
              tone="amber"
              href="/dashboard/admin/services?status=pending"
            />
            <Metric
              label="Transactions"
              value={stats.totalTransactions}
              note="Recorded payment events"
              icon={CircleDollarSign}
              tone="green"
              href="/dashboard/admin/transactions"
            />
          </section>
          <section className="mt-7 overflow-hidden rounded-[1.6rem] border border-[#eee3dc] bg-white shadow-[0_16px_42px_-35px_rgba(82,43,44,.36)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0e8e2] bg-[linear-gradient(110deg,#fffdfa,#fbf6f1)] px-5 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-800">
                  Review queue
                </p>
                <h2 className="mt-1 text-lg font-semibold text-stone-900">
                  Services awaiting approval
                </h2>
              </div>
              <Link
                href="/dashboard/admin/services?status=pending"
                className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-50"
              >
                View queue
                <ArrowRight size={14} />
              </Link>
            </div>
            {recentServices.length ? (
              <div className="divide-y divide-[#f0e8e2]">
                {recentServices.map((service) => (
                  <div
                    key={itemId(service)}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-stone-800">
                        {service.serviceName}
                      </p>
                      <p className="mt-1 text-xs text-stone-500">
                        {service.category || "Uncategorized"} ·{" "}
                        {service.vendor?.businessName ||
                          service.vendor?.name ||
                          "Vendor"}{" "}
                        · {shortDate(service.createdAt)}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-semibold text-amber-800">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <BadgeCheck size={23} className="mx-auto text-emerald-700" />
                <p className="mt-2 text-sm font-semibold text-stone-800">
                  The review queue is clear
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  New pending service submissions will appear here.
                </p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState(() => {
    if (typeof window === "undefined") return "all";
    const requestedRole = new URLSearchParams(window.location.search).get(
      "role",
    );
    return ["admin", "vendor", "customer"].includes(requestedRole || "")
      ? requestedRole || "all"
      : "all";
  });
  const [expanded, setExpanded] = useState("");
  const [busyId, setBusyId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const query = useMemo(
    () => new URLSearchParams({ search, role, page: String(page) }).toString(),
    [search, role, page],
  );
  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      requestJson<{ users: AdminUser[]; total: number }>(
        `/api/admin/users?${query}`,
      )
        .then((result) => {
          if (active) {
            setUsers(result.users);
            setTotal(result.total);
            setError("");
          }
        })
        .catch((cause) => {
          if (active)
            setError(
              cause instanceof Error ? cause.message : "Could not load users.",
            );
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 180);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  async function setBlocked(user: AdminUser, blocked: boolean) {
    const id = itemId(user);
    if (!id || user.role === "admin") return;
    setBusyId(id);
    setError("");
    setNotice("");
    try {
      await requestJson(`/api/admin/users/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ isBlocked: blocked }),
      });
      setUsers((current) =>
        current.map((item) =>
          itemId(item) === id ? { ...item, isBlocked: blocked } : item,
        ),
      );
      setNotice(
        `${user.name || user.email || "User"} ${blocked ? "has been blocked" : "has been unblocked"}.`,
      );
      toast.success(blocked ? "User blocked." : "User unblocked.");
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "Could not update user access.";
      setError(message);
      toast.error("Could not update user access", { description: message });
    } finally {
      setBusyId("");
    }
  }

  async function deleteUser(user: AdminUser) {
    const id = itemId(user);
    if (!id || user.role === "admin") return;
    setBusyId(id);
    setError("");
    setNotice("");
    try {
      await requestJson(`/api/admin/users/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      setUsers((current) => current.filter((item) => itemId(item) !== id));
      setTotal((current) => Math.max(0, current - 1));
      if (users.length === 1 && page > 1)
        setPage((current) => Math.max(1, current - 1));
      setNotice(
        `${user.name || user.email || "User"} has been permanently deleted.`,
      );
      setDeleteTarget(null);
      toast.success("User deleted.");
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Could not delete this user.";
      setError(message);
      toast.error("Could not delete user", { description: message });
    } finally {
      setBusyId("");
    }
  }

  const pages = Math.max(1, Math.ceil(total / 20));
  return (
    <div className="mx-auto max-w-7xl">
      <Header
        eyebrow="Account access"
        title="Manage users"
        description="Find an account, review its details, or block access to protected WedPlan features."
      />
      <div className="mb-4 grid gap-3 rounded-[1.4rem] border border-[#eee3dc] bg-white p-4 sm:grid-cols-[1fr_220px] sm:p-5">
        <label className="relative">
          <span className="sr-only">Search users by name or email</span>
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search name or email"
            className="h-11 w-full rounded-xl border border-[#e9ded6] bg-[#fffdfa] pl-10 pr-3 text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100/70"
          />
        </label>
        <label className="relative">
          <span className="sr-only">Filter by role</span>
          <Filter
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <select
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
              setPage(1);
            }}
            className="h-11 w-full appearance-none rounded-xl border border-[#e9ded6] bg-[#fffdfa] pl-10 pr-9 text-sm text-stone-700 outline-none focus:border-rose-400"
          >
            <option value="all">All roles</option>
            <option value="vendor">Vendors</option>
            <option value="customer">Customers</option>
            <option value="admin">Admins</option>
          </select>
        </label>
      </div>
      {notice && (
        <p
          role="status"
          className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-900"
        >
          {notice}
        </p>
      )}
      {error && (
        <div className="mb-4">
          <ErrorState message={error} />
        </div>
      )}
      {loading ? (
        <Loading label="Loading registered users…" />
      ) : users.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-[#eadfd5] bg-white p-10 text-center">
          <Users size={24} className="mx-auto text-rose-700" />
          <h2 className="mt-3 text-sm font-semibold text-stone-800">
            No users match this search
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Try a different name, email, or role filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.5rem] border border-[#eee3dc] bg-white shadow-sm">
          <div className="hidden grid-cols-[minmax(220px,1.5fr)_1fr_130px_150px] gap-4 border-b border-[#f0e8e2] bg-[#fbf8f5] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-stone-500 md:grid">
            <span>Account</span>
            <span>Role</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-[#f0e8e2]">
            {users.map((user, index) => {
              const id = itemId(user) || `${user.email}-${index}`;
              const blocked = user.isBlocked === true;
              return (
                <article key={id} className="px-4 py-4 sm:px-5">
                  <div className="grid items-center gap-3 md:grid-cols-[minmax(220px,1.5fr)_1fr_130px_150px] md:gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar user={user} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-stone-900">
                          {user.name || "Unnamed account"}
                        </p>
                        <p className="truncate text-xs text-stone-500">
                          {user.email || "No email"}
                        </p>
                      </div>
                    </div>
                    <span className="w-fit rounded-full bg-[#f6eee8] px-3 py-1.5 text-[10px] font-semibold capitalize text-stone-700">
                      {user.role || "unknown"}
                    </span>
                    <span
                      className={`w-fit rounded-full px-3 py-1.5 text-[10px] font-semibold ${blocked ? "bg-rose-50 text-rose-800" : "bg-emerald-50 text-emerald-800"}`}
                    >
                      {blocked ? "Blocked" : "Active"}
                    </span>
                    <div className="flex flex-col items-start gap-2 md:items-start">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setExpanded((current) => (current === id ? "" : id))
                          }
                          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#eadfd5] px-3 text-[10px] font-semibold text-stone-700 hover:bg-[#fbf8f5]"
                        >
                          <Eye size={13} />
                          Details
                        </button>
                        {user.role !== "admin" && (
                          <button
                            type="button"
                            onClick={() => setBlocked(user, !blocked)}
                            disabled={busyId === id}
                            className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[10px] font-semibold disabled:opacity-50 ${blocked ? "border border-emerald-200 text-emerald-800 hover:bg-emerald-50" : "border border-rose-200 text-rose-800 hover:bg-rose-50"}`}
                          >
                            {busyId === id ? (
                              <Clock3 size={13} className="animate-spin" />
                            ) : blocked ? (
                              <Check size={13} />
                            ) : (
                              <Ban size={13} />
                            )}
                            {blocked ? "Unblock" : "Block"}
                          </button>
                        )}
                      </div>
                      {user.role !== "admin" && (
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(user)}
                          disabled={busyId === id}
                          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-rose-200 px-3 text-[10px] font-semibold text-rose-800 transition hover:bg-rose-50 disabled:opacity-50"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  {expanded === id && (
                    <div className="mt-4 grid gap-3 rounded-xl bg-[#fbf8f5] p-4 text-xs sm:grid-cols-3">
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-stone-500">
                          Account ID
                        </p>
                        <p className="mt-1 break-all font-mono text-[10px] text-stone-700">
                          {id}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-stone-500">
                          Joined
                        </p>
                        <p className="mt-1 text-stone-700">
                          {shortDate(user.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-stone-500">
                          Business
                        </p>
                        <p className="mt-1 text-stone-700">
                          {user.businessName || "—"}
                        </p>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t border-[#f0e8e2] px-4 py-3 sm:px-5">
            <p className="text-[10px] text-stone-500">
              {total} registered {total === 1 ? "user" : "users"}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((value) => value - 1)}
                className="rounded-full border border-[#eadfd5] px-3 py-1.5 text-[10px] font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-[10px] text-stone-600">
                {page} / {pages}
              </span>
              <button
                type="button"
                disabled={page >= pages}
                onClick={() => setPage((value) => value + 1)}
                className="rounded-full border border-[#eadfd5] px-3 py-1.5 text-[10px] font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteTarget && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              busyId !== itemId(deleteTarget)
            )
              setDeleteTarget(null);
          }}
          className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/40 p-4 backdrop-blur-sm"
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
            aria-describedby="delete-user-description"
            className="w-full max-w-md rounded-[1.6rem] border border-rose-100 bg-white p-6 shadow-2xl sm:p-7"
          >
            <span className="flex size-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-800">
              <Trash2 size={19} />
            </span>
            <h2
              id="delete-user-title"
              className="mt-4 text-lg font-semibold text-stone-900"
            >
              Delete this user?
            </h2>
            <p
              id="delete-user-description"
              className="mt-2 text-sm leading-6 text-stone-600"
            >
              This permanently removes{" "}
              <strong className="font-semibold text-stone-800">
                {deleteTarget.name || deleteTarget.email || "this account"}
              </strong>{" "}
              and signs out their account. This action cannot be undone.
            </p>
            {deleteTarget.role === "vendor" && (
              <p className="mt-3 rounded-xl bg-amber-50 px-3.5 py-3 text-xs leading-5 text-amber-900">
                Their submitted services will be withdrawn from public listings.
              </p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={busyId === itemId(deleteTarget)}
                className="rounded-full border border-[#eadfd5] px-4 py-2.5 text-xs font-semibold text-stone-700 transition hover:bg-[#fbf8f5] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteUser(deleteTarget)}
                disabled={busyId === itemId(deleteTarget)}
                className="inline-flex items-center gap-2 rounded-full bg-rose-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-rose-900 disabled:cursor-wait disabled:opacity-60"
              >
                {busyId === itemId(deleteTarget) ? (
                  <Clock3 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                {busyId === itemId(deleteTarget) ? "Deleting…" : "Delete user"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export function AdminServices() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(() => {
    if (typeof window === "undefined") return "all";
    const requestedStatus = new URLSearchParams(window.location.search).get(
      "status",
    );
    return ["pending", "approved", "rejected"].includes(requestedStatus || "")
      ? requestedStatus || "all"
      : "all";
  });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const query = useMemo(
    () => new URLSearchParams({ search, status }).toString(),
    [search, status],
  );
  useEffect(() => {
    let active = true;
    requestJson<AdminService[]>(`/api/admin/services?${query}`)
      .then((items) => {
        if (active) {
          setServices(items);
          setError("");
        }
      })
      .catch((cause) => {
        if (active)
          setError(
            cause instanceof Error ? cause.message : "Could not load services.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [query]);

  async function moderate(service: AdminService, nextStatus: ServiceStatus) {
    const id = itemId(service);
    if (!id) return;
    setBusyId(id);
    setError("");
    setNotice("");
    try {
      const updated = await requestJson<AdminService>(
        `/api/admin/services/${encodeURIComponent(id)}`,
        { method: "PATCH", body: JSON.stringify({ status: nextStatus }) },
      );
      setServices((current) =>
        current.map((item) =>
          itemId(item) === id ? { ...item, ...updated } : item,
        ),
      );
      setNotice(`${service.serviceName} is now ${nextStatus}.`);
      toast.success(`Service ${nextStatus}.`);
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : "Could not update service status.";
      setError(message);
      toast.error("Could not update service", { description: message });
    } finally {
      setBusyId("");
    }
  }

  async function remove(service: AdminService) {
    const id = itemId(service);
    if (!id) return;
    setBusyId(id);
    setError("");
    try {
      await requestJson(`/api/admin/services/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      setServices((current) => current.filter((item) => itemId(item) !== id));
      setDeleteId("");
      setNotice(`${service.serviceName} was deleted.`);
      toast.success("Service deleted.");
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Could not delete service.";
      setError(message);
      toast.error("Could not delete service", { description: message });
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Header
        eyebrow="Listing moderation"
        title="Manage services"
        description="Review every submission and control which listings remain published."
      />
      <div className="mb-4 grid gap-3 rounded-[1.4rem] border border-[#eee3dc] bg-white p-4 sm:grid-cols-[1fr_220px] sm:p-5">
        <label className="relative">
          <span className="sr-only">Search services</span>
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, category, or location"
            className="h-11 w-full rounded-xl border border-[#e9ded6] bg-[#fffdfa] pl-10 pr-3 text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100/70"
          />
        </label>
        <label className="relative">
          <span className="sr-only">Filter service status</span>
          <Filter
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-[#e9ded6] bg-[#fffdfa] pl-10 pr-9 text-sm text-stone-700 outline-none"
          >
            <option value="all">All services</option>
            <option value="pending">Pending review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>
      </div>
      {notice && (
        <p
          role="status"
          className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-900"
        >
          {notice}
        </p>
      )}
      {error && (
        <div className="mb-4">
          <ErrorState message={error} />
        </div>
      )}
      {loading ? (
        <Loading label="Loading submitted services…" />
      ) : services.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-[#eadfd5] bg-white p-10 text-center">
          <Store size={24} className="mx-auto text-rose-700" />
          <h2 className="mt-3 text-sm font-semibold text-stone-800">
            No services in this view
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Try a different status filter or search term.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {services.map((service, index) => {
            const id = itemId(service) || `${service.serviceName}-${index}`;
            const image = service.images?.[0];
            return (
              <article
                key={id}
                className="overflow-hidden rounded-[1.5rem] border border-[#eee3dc] bg-white shadow-[0_15px_40px_-34px_rgba(82,43,44,.38)]"
              >
                <div className="flex gap-4 p-4 sm:p-5">
                  <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-rose-100 to-amber-100 text-rose-800">
                    {image ? (
                      <span
                        role="img"
                        aria-label={`${service.serviceName} photo`}
                        className="size-full bg-cover bg-center"
                        style={{ backgroundImage: `url("${image}")` }}
                      />
                    ) : (
                      <Store size={24} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h2 className="text-sm font-semibold text-stone-900">
                          {service.serviceName}
                        </h2>
                        <p className="mt-1 text-xs text-stone-500">
                          {service.category || "Uncategorized"} ·{" "}
                          {service.location || "Location not set"}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1.5 text-[10px] font-semibold capitalize ${service.status === "approved" ? "bg-emerald-50 text-emerald-800" : service.status === "rejected" ? "bg-rose-50 text-rose-800" : "bg-amber-50 text-amber-800"}`}
                      >
                        {service.status || "pending"}
                      </span>
                    </div>
                    <p className="mt-3 text-xs font-semibold text-stone-800">
                      {service.vendor?.businessName ||
                        service.vendor?.name ||
                        "Vendor"}
                      <span className="ml-2 font-normal text-stone-500">
                        {service.vendor?.email || ""}
                      </span>
                    </p>
                    <p className="mt-1 text-[10px] text-stone-500">
                      {typeof service.price === "number"
                        ? new Intl.NumberFormat("en", {
                            style: "currency",
                            currency: service.currency || "USD",
                            maximumFractionDigits: 0,
                          }).format(service.price)
                        : "Price not set"}{" "}
                      · Submitted {shortDate(service.createdAt)} ·{" "}
                      {service.isActive ? "Available" : "Unavailable"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#f0e8e2] bg-[#fffdfa] px-4 py-3 sm:px-5">
                  {service.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={busyId === id}
                        onClick={() => moderate(service, "approved")}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-emerald-700 px-3.5 text-[10px] font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                      >
                        <Check size={13} />
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={busyId === id}
                        onClick={() => moderate(service, "rejected")}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-rose-200 px-3.5 text-[10px] font-semibold text-rose-800 hover:bg-rose-50 disabled:opacity-50"
                      >
                        <X size={13} />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 text-[10px] font-semibold text-stone-600">
                      Change status
                      <select
                        value={service.status || "pending"}
                        disabled={busyId === id}
                        onChange={(event) =>
                          moderate(service, event.target.value as ServiceStatus)
                        }
                        className="h-9 rounded-full border border-[#eadfd5] bg-white px-3 text-[10px] capitalize text-stone-700 disabled:opacity-50"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </label>
                  )}
                  {deleteId === id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-rose-800">
                        Delete permanently?
                      </span>
                      <button
                        type="button"
                        onClick={() => setDeleteId("")}
                        className="rounded-full px-2 py-1.5 text-[10px] font-semibold text-stone-600"
                      >
                        Keep
                      </button>
                      <button
                        type="button"
                        disabled={busyId === id}
                        onClick={() => remove(service)}
                        className="rounded-full bg-rose-800 px-3 py-1.5 text-[10px] font-semibold text-white disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteId(id)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[10px] font-semibold text-rose-800 hover:bg-rose-50"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AdminTransactions() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    requestJson<AdminTransaction[]>("/api/admin/transactions")
      .then((items) => {
        if (active) setTransactions(items);
      })
      .catch((cause) => {
        if (active)
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not load transactions.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadCount]);

  async function syncPendingTransactions() {
    setSyncing(true);
    try {
      const result = await requestJson<{
        checked: number;
        confirmed: number;
        expired: number;
        stillPending: number;
        unverified: number;
      }>("/api/admin/transactions/reconcile", {
        method: "POST",
        body: "{}",
      });
      toast.success("Stripe status check complete", {
        description: `${result.confirmed} payment(s) confirmed, ${result.expired} expired, ${result.stillPending} still pending, ${result.unverified} could not be verified.`,
      });
      setReloadCount((count) => count + 1);
    } catch (cause) {
      const message = cause instanceof Error
        ? cause.message
        : "Could not verify pending Stripe transactions.";
      toast.error("Stripe status check failed", { description: message });
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Header
        eyebrow="Payment records"
        title="Transactions"
        description="Review subscription payments recorded by the payment provider. These records are read-only here."
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#eee3dc] bg-white px-4 py-3 shadow-sm">
        <p className="text-xs leading-5 text-stone-600">
          Recheck pending records against Stripe. Only Stripe-confirmed payments can become successful.
        </p>
        <button
          type="button"
          onClick={syncPendingTransactions}
          disabled={syncing}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-rose-800 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-900 disabled:cursor-wait disabled:opacity-60"
        >
          {syncing ? <LoaderCircle size={15} className="animate-spin" /> : <RefreshCw size={15} />}
          {syncing ? "Checking Stripe…" : "Sync with Stripe"}
        </button>
      </div>
      {error ? (
        <div className="space-y-3">
          <ErrorState message={error} />
          <button
            type="button"
            onClick={() => setReloadCount((count) => count + 1)}
            className="rounded-full border border-[#eadfd5] bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-[#fbf8f5]"
          >
            Try again
          </button>
        </div>
      ) : loading ? (
        <Loading label="Loading transactions…" />
      ) : transactions.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-[#eadfd5] bg-white p-10 text-center">
          <CircleDollarSign size={25} className="mx-auto text-rose-700" />
          <h2 className="mt-3 text-sm font-semibold text-stone-800">
            No transactions recorded
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Payment records will appear here once the payment provider confirms
            them.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.5rem] border border-[#eee3dc] bg-white shadow-sm">
          <div className="hidden grid-cols-[1.3fr_1fr_130px_130px_130px] gap-4 border-b border-[#f0e8e2] bg-[#fbf8f5] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-stone-500 md:grid">
            <span>Vendor</span>
            <span>Plan</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Date</span>
          </div>
          <div className="divide-y divide-[#f0e8e2]">
            {transactions.map((transaction, index) => {
              const id =
                itemId(transaction) || `${transaction.vendorId}-${index}`;
              const rawAmount = transaction.amount ?? 0;
              const status = transaction.status || "unknown";
              return (
                <article
                  key={id}
                  className="grid gap-2 px-4 py-4 md:grid-cols-[1.3fr_1fr_130px_130px_130px] md:items-center md:gap-4 md:px-5"
                >
                  <div>
                    <p className="text-xs font-semibold text-stone-800">
                      {transaction.vendor?.businessName ||
                        transaction.vendor?.name ||
                        "Vendor"}
                    </p>
                    <p className="mt-1 text-[10px] text-stone-500">
                      {transaction.vendor?.email ||
                        "Vendor details unavailable"}
                    </p>
                  </div>
                  <p className="text-xs text-stone-700">
                    {transaction.plan === "premium_plus" ? "Premium Plus" : transaction.plan === "premium_pro" ? "Premium Pro" : transaction.plan === "premium" ? "Premium" : transaction.plan || "Subscription"}
                  </p>
                  <p className="text-xs font-semibold text-stone-800">
                    {formatTransactionAmount(rawAmount, transaction.currency)}
                  </p>
                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-[10px] font-semibold capitalize ${transactionStatusClass(status)}`}
                  >
                    {status}
                  </span>
                  <p className="text-[10px] text-stone-500">
                    {shortDate(transaction.createdAt)}
                  </p>
                </article>
              );
            })}
          </div>
          <div className="border-t border-[#f0e8e2] bg-[#fbf8f5] px-5 py-3 text-[10px] text-stone-500">
            Payment status is supplied by the payment provider. This screen does
            not include manual payment-status controls.
          </div>
        </div>
      )}
    </div>
  );
}

function Header({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: { href: string; label: string };
}) {
  return (
    <header className="relative mb-7 overflow-hidden rounded-[1.7rem] border border-[#e9d9cf] bg-[linear-gradient(120deg,#fffaf6,#f7eee8_58%,#f0e3dc)] px-5 py-6 shadow-[0_24px_65px_-52px_rgba(82,43,44,.42)] sm:px-8 sm:py-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-24 size-64 rounded-full border border-rose-900/[.07]"
      />
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-800">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#352321]">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            {description}
          </p>
        </div>
        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center gap-2 rounded-full bg-rose-800 px-4 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-900"
          >
            {action.label}
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </header>
  );
}

function Metric({
  label,
  value,
  note,
  icon: Icon,
  tone,
  href,
}: {
  label: string;
  value: number;
  note: string;
  icon: LucideIcon;
  tone: "rose" | "violet" | "amber" | "blue" | "green";
  href: string;
}) {
  const tones = {
    rose: "bg-rose-50 text-rose-800",
    violet: "bg-violet-50 text-violet-800",
    amber: "bg-amber-50 text-amber-800",
    blue: "bg-sky-50 text-sky-800",
    green: "bg-emerald-50 text-emerald-800",
  };
  return (
    <Link
      href={href}
      className="group rounded-[1.35rem] border border-[#eee3dc] bg-white p-4 shadow-[0_12px_30px_-25px_rgba(82,43,44,.35)] transition hover:-translate-y-0.5 hover:border-rose-200"
    >
      <span
        className={`flex size-9 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        <Icon aria-hidden="true" size={18} />
      </span>
      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
        {value}
      </p>
      <p className="mt-1 flex items-center justify-between gap-2 text-[10px] leading-4 text-stone-500">
        {note}
        <ArrowRight
          size={12}
          className="shrink-0 text-rose-700 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
        />
      </p>
    </Link>
  );
}

function Avatar({ user }: { user: AdminUser }) {
  const label = user.name || user.email || "User";
  return (
    <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-rose-100 bg-gradient-to-br from-rose-100 to-[#f2ded3] text-xs font-semibold text-rose-900">
      {user.image ? (
        <span
          role="img"
          aria-label={`${label} profile image`}
          className="size-full bg-cover bg-center"
          style={{ backgroundImage: `url("${user.image}")` }}
        />
      ) : (
        (user.name || user.email || "U").slice(0, 1).toUpperCase()
      )}
    </span>
  );
}
