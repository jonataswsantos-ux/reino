import React, { useState, useEffect } from 'react';
import { AuthState, User, Branch, MeetingRecord, UserRole, UserStatus } from './types';
import { storage } from './services/storage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DataEntry from './components/DataEntry';
import AdminPanel from './components/AdminPanel';

const GLOBAL_BRANCH_ID = 'master_global';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({ user: null, activeBranchId: null });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [records, setRecords] = useState<MeetingRecord[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isRegisteringAdmin, setIsRegisteringAdmin] = useState(false);
  const [showCodeVerification, setShowCodeVerification] = useState<{user: User} | null>(null);
  const [isForgotPass, setIsForgotPass] = useState(false);
  
  const [loginData, setLoginData] = useState({ email: '', password: '', branchId: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [verificationInput, setVerificationInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedBranches = storage.getBranches();
    setBranches(storedBranches);
    
    const users = storage.getUsers();
    // Se não houver usuários, forçamos o registro do ADM GERAL
    if (users.length === 0) {
      setIsRegisteringAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (auth.user && auth.activeBranchId) {
      const allRecords = storage.getRecords();
      if (auth.activeBranchId === GLOBAL_BRANCH_ID) {
        // Visão de todas as filiais
        setRecords(allRecords);
      } else {
        // Visão de uma filial específica
        setRecords(allRecords.filter(r => r.branchId === auth.activeBranchId));
      }
    }
  }, [auth.user, auth.activeBranchId]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = storage.getUsers();
    const user = users.find(u => 
      u.email.toLowerCase() === loginData.email.toLowerCase() && 
      u.password === loginData.password
    );

    if (user) {
      // Se for usuário comum e tentar entrar em "ADM GERAL" ou em outra filial
      if (!user.isMaster && (loginData.branchId === GLOBAL_BRANCH_ID || user.branchId !== loginData.branchId)) {
        setError('Você não tem acesso a esta unidade.');
        return;
      }

      if (user.status === UserStatus.PENDING) {
        setShowCodeVerification({ user });
        setError(null);
      } else {
        setAuth({ 
          user, 
          activeBranchId: loginData.branchId || user.branchId 
        });
        setError(null);
      }
    } else {
      setError('Credenciais inválidas. Verifique e-mail, senha e unidade.');
    }
  };

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (showCodeVerification && verificationInput === showCodeVerification.user.verificationCode) {
      const allUsers = storage.getUsers();
      const updatedUsers = allUsers.map(u => 
        u.id === showCodeVerification.user.id ? { ...u, status: UserStatus.ACTIVE, verificationCode: undefined } : u
      );
      storage.saveUsers(updatedUsers);
      
      const user = updatedUsers.find(u => u.id === showCodeVerification.user.id)!;
      setAuth({ 
        user, 
        activeBranchId: user.branchId 
      });
      setShowCodeVerification(null);
      setVerificationInput('');
    } else {
      setError('Código incorreto.');
    }
  };

  const handleAdminRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: crypto.randomUUID(),
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      role: UserRole.ADMIN,
      branchId: branches[0].id,
      isMaster: true,
      status: UserStatus.ACTIVE
    };

    storage.saveUsers([newUser]);
    setAuth({ user: newUser, activeBranchId: GLOBAL_BRANCH_ID });
    setIsRegisteringAdmin(false);
    setError(null);
  };

  const handleSaveRecord = (record: MeetingRecord) => {
    storage.addRecord(record);
    const allRecords = storage.getRecords();
    if (auth.activeBranchId === GLOBAL_BRANCH_ID) {
      setRecords(allRecords);
    } else {
      setRecords(allRecords.filter(r => r.branchId === auth.activeBranchId));
    }
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setAuth({ user: null, activeBranchId: null });
    setActiveTab('dashboard');
    setShowCodeVerification(null);
    setLoginData({ email: '', password: '', branchId: '' });
    setError(null);
  };

  const handleBranchChange = (branchId: string) => {
    if (auth.user?.isMaster) {
      setAuth(prev => ({ ...prev, activeBranchId: branchId }));
    }
  };

  const handleProfileImageUpdate = (img: string) => {
    if (auth.user) {
      const allUsers = storage.getUsers();
      const updated = allUsers.map(u => u.id === auth.user?.id ? { ...u, profileImage: img } : u);
      storage.saveUsers(updated);
      setAuth(prev => ({ ...prev, user: { ...prev.user!, profileImage: img } }));
    }
  };

  const activeBranch = branches.find(b => b.id === auth.activeBranchId) || 
                       (auth.activeBranchId === GLOBAL_BRANCH_ID ? { id: GLOBAL_BRANCH_ID, name: 'ADM GERAL', city: 'Todas' } : null);

  if (isRegisteringAdmin) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-[#5D4037]">
        <div className="w-full max-w-lg animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-[#3E2723] mb-3 uppercase tracking-tighter">GLOBAL REINO</h1>
            <p className="text-[#8D6E63] font-bold text-xs uppercase tracking-[0.3em]">Setup do Sistema • ADM GERAL</p>
          </div>
          <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-[#D7CCC8]/30">
            <form onSubmit={handleAdminRegister} className="space-y-8">
              <div className="bg-[#F5F5F5] p-6 rounded-3xl text-[11px] text-[#8D6E63] font-bold uppercase leading-relaxed text-center border border-[#D7CCC8]/50 mb-4">
                Você está configurando o acesso mestre. Com este usuário, você poderá gerenciar todas as filiais e resetar senhas.
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-[#A1887F] uppercase mb-3 ml-2">Nome Completo</label>
                  <input required type="text" value={registerData.name} onChange={e => setRegisterData({...registerData, name: e.target.value})} className="w-full px-6 py-5 bg-[#FDFBF7] border border-[#D7CCC8] rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-[#8D6E63]" placeholder="Seu Nome" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#A1887F] uppercase mb-3 ml-2">E-mail Administrativo</label>
                  <input required type="email" value={registerData.email} onChange={e => setRegisterData({...registerData, email: e.target.value})} className="w-full px-6 py-5 bg-[#FDFBF7] border border-[#D7CCC8] rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-[#8D6E63]" placeholder="adm@globalreino.com" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#A1887F] uppercase mb-3 ml-2">Senha do Sistema</label>
                  <input required type="password" value={registerData.password} onChange={e => setRegisterData({...registerData, password: e.target.value})} className="w-full px-6 py-5 bg-[#FDFBF7] border border-[#D7CCC8] rounded-2xl outline-none font-black text-sm focus:ring-2 focus:ring-[#8D6E63]" placeholder="••••••••" />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#5D4037] text-white font-black py-6 rounded-3xl uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-[#3E2723] transition-all active:scale-95">
                Criar Conta ADM GERAL
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (showCodeVerification) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-[#5D4037]">
        <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl border border-[#D7CCC8]/50 text-center animate-in zoom-in duration-300">
          <h2 className="text-2xl font-black text-[#3E2723] uppercase tracking-tighter mb-4">Ativar Acesso</h2>
          <p className="text-[#8D6E63] text-xs font-bold mb-10 uppercase tracking-tight leading-relaxed px-4">
            Insira o código enviado pelo seu administrador para o seu primeiro acesso.
          </p>
          <form onSubmit={handleVerification} className="space-y-8">
            <input
              required
              autoFocus
              type="text"
              maxLength={6}
              placeholder="000000"
              value={verificationInput}
              onChange={e => setVerificationInput(e.target.value)}
              className="w-full px-5 py-8 bg-[#FDFBF7] border-2 border-[#D7CCC8] rounded-[2rem] text-center text-5xl font-mono tracking-[0.4em] outline-none text-[#3E2723] shadow-inner"
            />
            {error && <p className="text-red-400 text-[10px] font-black uppercase tracking-widest">{error}</p>}
            <div className="flex gap-4">
              <button type="button" onClick={() => setShowCodeVerification(null)} className="flex-1 py-4 text-[#A1887F] font-black text-xs uppercase tracking-widest bg-[#F5F5F5] rounded-2xl">Voltar</button>
              <button type="submit" className="flex-[2] bg-[#5D4037] text-white font-black py-4 rounded-2xl uppercase text-xs tracking-[0.2em] shadow-lg">Confirmar</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (!auth.user || !auth.activeBranchId) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 relative overflow-hidden text-[#5D4037]">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#EFEBE9] rounded-full blur-[100px] -z-10 opacity-60 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-[#D7CCC8] rounded-full blur-[120px] -z-10 opacity-30 translate-y-1/2 -translate-x-1/2"></div>

        <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black text-[#3E2723] mb-4 tracking-tighter uppercase leading-[0.8]">GLOBAL<br/>REINO</h1>
            <p className="text-[#A1887F] font-black uppercase tracking-[0.4em] text-[10px] ml-1 opacity-70">Inteligência Estratégica</p>
          </div>
          
          <div className="bg-white rounded-[4rem] p-12 shadow-2xl border border-[#D7CCC8]/30">
            {isForgotPass ? (
               <div className="space-y-8 animate-in fade-in duration-300">
                 <h2 className="text-center font-black text-[#3E2723] uppercase tracking-tighter text-xl">Recuperação</h2>
                 <p className="text-xs text-[#8D6E63] text-center font-bold uppercase leading-relaxed border-y border-[#F5F5F5] py-6">Solicite ao seu Gestor ou ao <span className="text-[#3E2723]">ADM GERAL</span> a redefinição da sua senha pelo painel de controle.</p>
                 <button onClick={() => setIsForgotPass(false)} className="w-full py-5 text-[#3E2723] font-black text-xs uppercase tracking-widest bg-[#F5F5F5] rounded-[2rem] hover:bg-[#EFEBE9] transition-all">Voltar ao Login</button>
               </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-[#A1887F] uppercase tracking-widest mb-4 ml-2">Sua Unidade</label>
                  <div className="relative group">
                    <select
                      required
                      value={loginData.branchId}
                      onChange={e => setLoginData({...loginData, branchId: e.target.value})}
                      className="w-full px-6 py-5 bg-[#FDFBF7] border-2 border-[#D7CCC8]/50 rounded-[2rem] text-[#3E2723] font-black outline-none text-sm appearance-none cursor-pointer hover:border-[#8D6E63] transition-all group-focus-within:border-[#8D6E63]"
                    >
                      <option value="">Selecione a Unidade...</option>
                      <option value={GLOBAL_BRANCH_ID}>ADM GERAL (Visão de todas)</option>
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#8D6E63]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-[#A1887F] uppercase tracking-widest mb-4 ml-2">Identificação</label>
                    <input
                      required
                      type="email"
                      placeholder="seu@email.com"
                      value={loginData.email}
                      onChange={e => setLoginData({...loginData, email: e.target.value})}
                      className="w-full px-8 py-5 bg-[#FDFBF7] border-2 border-[#D7CCC8]/50 rounded-[2rem] text-[#3E2723] font-black outline-none text-sm placeholder:font-bold placeholder:text-[#D7CCC8] focus:border-[#8D6E63] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#A1887F] uppercase tracking-widest mb-4 ml-2 flex justify-between">
                      Chave de Acesso
                      <button type="button" onClick={() => setIsForgotPass(true)} className="text-[9px] hover:text-[#3E2723] transition-colors underline-offset-4 decoration-[#D7CCC8]">Esqueceu?</button>
                    </label>
                    <input
                      required
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={e => setLoginData({...loginData, password: e.target.value})}
                      className="w-full px-8 py-5 bg-[#FDFBF7] border-2 border-[#D7CCC8]/50 rounded-[2rem] text-[#3E2723] font-black outline-none text-sm placeholder:text-[#D7CCC8] focus:border-[#8D6E63] transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase text-center border border-red-100 animate-shake">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#5D4037] hover:bg-[#3E2723] text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-[#D7CCC8]/80 transition-all active:scale-[0.97] uppercase text-xs tracking-[0.2em]"
                >
                  Entrar no Sistema
                </button>
              </form>
            )}
          </div>
          <p className="text-center text-[#A1887F] mt-16 text-[9px] font-black uppercase tracking-[0.4em] opacity-40">
            GLOBAL REINO Ecosystem &bull; 2025
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      user={auth.user} 
      branches={branches}
      activeBranch={activeBranch}
      onLogout={handleLogout} 
      onBranchChange={handleBranchChange}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onProfileImageUpdate={handleProfileImageUpdate}
    >
      {activeTab === 'dashboard' && <Dashboard records={records} />}
      {activeTab === 'records' && (
        <DataEntry 
          branchId={auth.activeBranchId === GLOBAL_BRANCH_ID ? branches[0].id : auth.activeBranchId!} 
          onSave={handleSaveRecord} 
        />
      )}
      {activeTab === 'admin' && (
        <AdminPanel 
          currentBranch={activeBranch!} 
          currentUser={auth.user} 
          branches={branches}
        />
      )}
    </Layout>
  );
};

export default App;