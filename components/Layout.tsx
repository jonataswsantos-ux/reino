import React from 'react';
import { User, UserRole, Branch } from '../types';

interface LayoutProps {
  user: User;
  branches: Branch[];
  activeBranch: Branch | null;
  onLogout: () => void;
  onBranchChange: (branchId: string) => void;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onProfileImageUpdate: (img: string) => void;
}

const GLOBAL_BRANCH_ID = 'master_global';

const Layout: React.FC<LayoutProps> = ({ 
  user, 
  branches, 
  activeBranch, 
  onLogout, 
  onBranchChange,
  children, 
  activeTab, 
  setActiveTab,
  onProfileImageUpdate
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onProfileImageUpdate(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen bg-[#FDFBF7] overflow-hidden text-[#5D4037]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#EFEBE9] border-r border-[#D7CCC8]/50 flex flex-col shadow-xl z-20">
        <div className="p-10">
          <h1 className="text-3xl font-black tracking-tighter text-[#3E2723] leading-[0.8]">GLOBAL<br/>REINO</h1>
          <div className="w-8 h-1.5 bg-[#8D6E63] mt-3 rounded-full"></div>
        </div>
        
        <nav className="flex-1 px-6 py-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-5 py-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${
              activeTab === 'dashboard' ? 'bg-white text-[#3E2723] font-black shadow-lg translate-x-1' : 'hover:bg-white/40 text-[#8D6E63] font-bold'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <span className="text-xs uppercase tracking-widest">Dashboards</span>
          </button>
          
          {(user.role === UserRole.ADMIN || user.isMaster) && (
            <button
              onClick={() => setActiveTab('records')}
              className={`w-full text-left px-5 py-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${
                activeTab === 'records' ? 'bg-white text-[#3E2723] font-black shadow-lg translate-x-1' : 'hover:bg-white/40 text-[#8D6E63] font-bold'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
              <span className="text-xs uppercase tracking-widest">Lançamentos</span>
            </button>
          )}

          {(user.role === UserRole.ADMIN || user.isMaster) && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full text-left px-5 py-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${
                activeTab === 'admin' ? 'bg-white text-[#3E2723] font-black shadow-lg translate-x-1' : 'hover:bg-white/40 text-[#8D6E63] font-bold'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span className="text-xs uppercase tracking-widest">Equipe</span>
            </button>
          )}
        </nav>
        
        <div className="p-6 border-t border-[#D7CCC8]/30">
          <div className="bg-white/50 p-6 rounded-[2rem] border border-white/80 shadow-inner mb-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-[#D7CCC8] flex items-center justify-center text-[#5D4037] font-black text-2xl overflow-hidden border-4 border-white shadow-xl">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Perfil" className="w-full h-full object-cover" />
                  ) : user.name.charAt(0)}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-[#8D6E63] text-white rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform active:scale-95">
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </label>
              </div>
              <div>
                <p className="text-sm font-black text-[#3E2723] uppercase tracking-tighter leading-tight">{user.name}</p>
                <div className="mt-2 inline-block px-3 py-1 rounded-full bg-[#8D6E63] text-white text-[9px] font-black uppercase tracking-widest">
                  {user.isMaster ? 'ADM GERAL' : (user.role === UserRole.ADMIN ? 'Gestor' : 'Consultor')}
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 text-[10px] font-black text-[#8D6E63] hover:text-[#3E2723] bg-white rounded-2xl border border-[#D7CCC8]/30 shadow-sm transition-all active:scale-95 uppercase tracking-widest"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-[#D7CCC8]/20 flex items-center justify-between px-10 shrink-0 z-10">
          <div className="flex items-center gap-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8D6E63]">
              {activeTab === 'dashboard' ? 'Métricas e Performance' : 
               activeTab === 'records' ? 'Entrada de Inteligência' : 
               'Controle Organizacional'}
            </h2>
            
            <div className="flex items-center gap-3 bg-[#F5F5F5] px-5 py-2 rounded-full border border-[#D7CCC8]/30">
              <span className="text-[9px] font-black text-[#A1887F] uppercase tracking-widest">Unidade:</span>
              {user.isMaster ? (
                <select 
                  value={activeBranch?.id || ''}
                  onChange={(e) => onBranchChange(e.target.value)}
                  className="bg-transparent text-[11px] font-black text-[#3E2723] outline-none appearance-none pr-4 uppercase cursor-pointer"
                >
                  <option value={GLOBAL_BRANCH_ID}>ADM GERAL</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              ) : (
                <span className="text-[11px] font-black text-[#3E2723] uppercase">
                  {activeBranch?.name}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-[#A1887F] uppercase tracking-widest">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
             </span>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-12 bg-gradient-to-br from-[#FDFBF7] to-[#F5F5F5]">
          <div className="max-w-6xl mx-auto pb-20">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;