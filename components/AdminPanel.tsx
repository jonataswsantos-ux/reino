
import React, { useState, useEffect } from 'react';
import { User, UserRole, Branch, UserStatus } from '../types';
import { storage } from '../services/storage';

interface AdminPanelProps {
  currentBranch: Branch;
  currentUser: User;
  branches: Branch[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ currentBranch, currentUser, branches }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPassword, setEditingPassword] = useState<{id: string, name: string} | null>(null);
  const [newPassInput, setNewPassInput] = useState('');
  const [lastCode, setLastCode] = useState<string | null>(null);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.VIEWER,
    branchId: currentBranch.id
  });

  useEffect(() => {
    const allUsers = storage.getUsers();
    if (currentUser.isMaster) {
      setUsers(allUsers);
    } else {
      setUsers(allUsers.filter(u => u.branchId === currentBranch.id));
    }
  }, [currentBranch.id, currentUser]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const user: User = {
      id: crypto.randomUUID(),
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      branchId: newUser.branchId,
      status: UserStatus.PENDING,
      verificationCode
    };
    const allUsers = storage.getUsers();
    const updated = [...allUsers, user];
    storage.saveUsers(updated);
    refreshUsers(updated);
    setLastCode(verificationCode);
    setShowForm(false);
    setNewUser({ ...newUser, name: '', email: '', password: '' });
  };

  const refreshUsers = (allUsers: User[]) => {
    if (currentUser.isMaster) {
      setUsers(allUsers);
    } else {
      setUsers(allUsers.filter(u => u.branchId === currentBranch.id));
    }
  };

  const removeUser = (id: string) => {
    if (id === currentUser.id) return;
    if (!window.confirm('Deseja realmente remover este acesso?')) return;
    const allUsers = storage.getUsers();
    const updated = allUsers.filter(u => u.id !== id);
    storage.saveUsers(updated);
    refreshUsers(updated);
  };

  const handleResetPassword = () => {
    if (!editingPassword || !newPassInput) return;
    const allUsers = storage.getUsers();
    const updated = allUsers.map(u => u.id === editingPassword.id ? { ...u, password: newPassInput } : u);
    storage.saveUsers(updated);
    refreshUsers(updated);
    setEditingPassword(null);
    setNewPassInput('');
    alert('Senha atualizada com sucesso!');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-[#3E2723] uppercase tracking-tighter">
            Controle de Acessos
          </h3>
          <p className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest mt-1">
            {currentUser.isMaster ? 'Modo ADM GERAL - Gerenciando todas as filiais' : `Filial: ${currentBranch.name}`}
          </p>
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); setLastCode(null); }}
          className="bg-[#8D6E63] text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#5D4037] transition-all shadow-lg active:scale-95"
        >
          {showForm ? 'Cancelar' : '+ Novo Usuário'}
        </button>
      </div>

      {lastCode && (
        <div className="bg-[#EFEBE9] border-2 border-[#D7CCC8] p-6 rounded-[2rem] text-[#3E2723] animate-in zoom-in duration-300 shadow-sm">
          <p className="font-black text-xs uppercase tracking-wider mb-2">Acesso criado!</p>
          <div className="flex items-center gap-4">
            <p className="text-[10px] font-bold text-[#8D6E63] uppercase">Código de Ativação:</p>
            <span className="bg-white px-4 py-2 rounded-xl font-mono text-2xl font-black text-[#3E2723] tracking-[0.2em] border border-[#D7CCC8] shadow-inner">
              {lastCode}
            </span>
          </div>
          <p className="text-[9px] text-[#A1887F] mt-3 font-bold uppercase">Envie este código para o usuário realizar o primeiro login.</p>
        </div>
      )}

      {showForm && (
        <div className="bg-white p-10 rounded-[3rem] border border-[#D7CCC8]/30 shadow-xl animate-in fade-in slide-in-from-top-6">
          <form onSubmit={handleAddUser} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-black text-[#A1887F] uppercase tracking-widest mb-3">Nome Completo</label>
                <input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full px-5 py-4 bg-[#FDFBF7] border border-[#D7CCC8] rounded-2xl outline-none font-bold text-sm" placeholder="Ex: João Silva" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#A1887F] uppercase tracking-widest mb-3">E-mail (Login)</label>
                <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full px-5 py-4 bg-[#FDFBF7] border border-[#D7CCC8] rounded-2xl outline-none font-bold text-sm" placeholder="email@exemplo.com" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#A1887F] uppercase tracking-widest mb-3">Senha Inicial</label>
                <input required type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full px-5 py-4 bg-[#FDFBF7] border border-[#D7CCC8] rounded-2xl outline-none font-bold text-sm" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#A1887F] uppercase tracking-widest mb-3">Filial</label>
                <select 
                  disabled={!currentUser.isMaster}
                  value={newUser.branchId} 
                  onChange={e => setNewUser({...newUser, branchId: e.target.value})} 
                  className="w-full px-5 py-4 bg-[#FDFBF7] border border-[#D7CCC8] rounded-2xl outline-none font-bold text-sm"
                >
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#A1887F] uppercase tracking-widest mb-3">Nível de Acesso</label>
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})} className="w-full px-5 py-4 bg-[#FDFBF7] border border-[#D7CCC8] rounded-2xl outline-none font-bold text-sm">
                  <option value={UserRole.ADMIN}>Gestor (Lança e vê Relatórios)</option>
                  <option value={UserRole.VIEWER}>Consultor (Apenas Relatórios)</option>
                </select>
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full bg-[#5D4037] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-md hover:bg-[#3E2723] transition-all">
                  Cadastrar Usuário
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {editingPassword && (
        <div className="fixed inset-0 bg-[#3E2723]/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl animate-in zoom-in duration-300 border border-[#D7CCC8]/50">
            <h4 className="text-2xl font-black text-[#3E2723] mb-2 uppercase tracking-tighter">Redefinir Senha</h4>
            <p className="text-xs text-[#8D6E63] mb-8 font-bold uppercase tracking-wide">Alterando acesso de: <b className="text-[#3E2723]">{editingPassword.name}</b></p>
            <input 
              autoFocus
              type="password"
              placeholder="Digite a nova senha"
              value={newPassInput}
              onChange={e => setNewPassInput(e.target.value)}
              className="w-full px-6 py-5 bg-[#FDFBF7] border-2 border-[#D7CCC8] rounded-[2rem] outline-none mb-8 font-black text-center text-lg placeholder:font-bold"
            />
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setEditingPassword(null)} className="py-4 text-[#A1887F] font-black text-xs uppercase tracking-widest bg-[#F5F5F5] rounded-2xl">Cancelar</button>
              <button onClick={handleResetPassword} className="bg-[#8D6E63] text-white py-4 px-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[3rem] border border-[#D7CCC8]/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EFEBE9]/40 text-[#8D6E63] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-6">Membro</th>
                <th className="px-8 py-6">Filial</th>
                <th className="px-8 py-6">Nível</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7CCC8]/20">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-[#FDFBF7] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#D7CCC8] flex items-center justify-center font-black text-[#3E2723] overflow-hidden border-2 border-white shadow-sm">
                        {u.profileImage ? <img src={u.profileImage} className="w-full h-full object-cover" /> : u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-[#3E2723] text-sm">{u.name}</p>
                        <p className="text-[10px] font-bold text-[#A1887F] lowercase">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black text-[#8D6E63] uppercase bg-[#EFEBE9]/50 px-3 py-1 rounded-lg">
                      {branches.find(b => b.id === u.branchId)?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${u.isMaster ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                      {u.isMaster ? 'ADM GERAL' : u.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${u.status === UserStatus.ACTIVE ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`}></span>
                      <span className="font-black text-[9px] uppercase tracking-widest">
                        {u.status === UserStatus.ACTIVE ? 'Ativo' : 'Pendente'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingPassword({id: u.id, name: u.name})} className="text-[#8D6E63] hover:text-[#3E2723] font-black uppercase text-[10px] border border-[#D7CCC8] px-3 py-1.5 rounded-xl bg-white transition-all">
                        Reset Senha
                      </button>
                      {!u.isMaster && (
                        <button onClick={() => removeUser(u.id)} className="text-red-400 hover:text-red-600 font-black uppercase text-[10px] border border-red-100 px-3 py-1.5 rounded-xl bg-red-50/30 transition-all">
                          Remover
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
