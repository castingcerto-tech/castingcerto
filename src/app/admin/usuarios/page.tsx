"use client";

import { useEffect, useState } from "react";
import { Shield, Plus, Users, X } from "lucide-react";

interface UserRow {
  id: string;
  email: string;
  role: string;
  status: string;
  nome: string | null;
  criadoEm: string;
}

export default function UsuariosAdminPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState("");
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => setUsers(data.users ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create-admin", email: newEmail, password: newPassword, name: newName }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Admin criado com sucesso!");
        setNewEmail(""); setNewPassword(""); setNewName("");
        setShowCreate(false);
        fetchUsers();
      } else {
        setMsg(data.error || "Erro ao criar admin");
      }
    } catch {
      setMsg("Erro de conexão");
    } finally {
      setCreating(false);
    }
  };

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "PROMOTOR" : "ADMIN";
    setToggling(userId);
    try {
      await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set-role", targetUserId: userId, role: newRole }),
      });
      fetchUsers();
    } catch { /* ignore */ }
    finally { setToggling(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-cream">Administradores</h1>
          <p className="text-cream/40 text-sm mt-1">Gerencie quem tem acesso ao painel administrativo</p>
        </div>
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand hover:bg-brand-light text-ink font-bold text-sm rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Admin
        </button>
      </div>

      {msg && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-brand/10 border border-brand/20 text-sm text-brand">
          {msg}
        </div>
      )}

      {/* Form criar admin */}
      {showCreate && (
        <form onSubmit={handleCreate} className="mb-8 p-6 rounded-2xl border border-dark-700 bg-dark-900 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-cream">Criar novo administrador</h2>
            <button type="button" onClick={() => setShowCreate(false)} className="text-cream/30 hover:text-cream">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div>
            <label className="text-xs text-cream/50 font-semibold uppercase tracking-wider">Nome</label>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
              className="mt-1 w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-brand/50"
              placeholder="Nome do administrador" />
          </div>
          <div>
            <label className="text-xs text-cream/50 font-semibold uppercase tracking-wider">E-mail *</label>
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required
              className="mt-1 w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-brand/50"
              placeholder="email@exemplo.com" />
          </div>
          <div>
            <label className="text-xs text-cream/50 font-semibold uppercase tracking-wider">Senha *</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8}
              className="mt-1 w-full px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-brand/50"
              placeholder="Mínimo 8 caracteres" />
          </div>
          <button type="submit" disabled={creating}
            className="w-full py-3 bg-brand hover:bg-brand-light text-ink font-bold rounded-xl text-sm transition-colors disabled:opacity-50">
            {creating ? "Criando..." : "Criar Administrador"}
          </button>
        </form>
      )}

      {/* Lista de usuários */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-cream/30">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Nenhum usuário encontrado</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-dark-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-dark-800 text-cream/50 text-left">
                  <th className="px-4 py-3 font-medium">Usuário</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Role</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Status</th>
                  <th className="px-4 py-3 font-medium">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-dark-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-cream">{u.nome ?? "—"}</p>
                      <p className="text-xs text-cream/30">{u.email}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        u.role === "ADMIN" ? "bg-purple-500/15 text-purple-400" : "bg-dark-700 text-cream/40"
                      }`}>
                        {u.role === "ADMIN" && <Shield className="w-3 h-3" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-cream/50 text-xs hidden md:table-cell">{u.status}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleRole(u.id, u.role)}
                        disabled={toggling === u.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                          u.role === "ADMIN"
                            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            : "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                        }`}
                      >
                        {toggling === u.id ? "..." : u.role === "ADMIN" ? "Revogar Admin" : "Tornar Admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
