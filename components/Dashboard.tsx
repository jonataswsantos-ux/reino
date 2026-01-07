
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { MeetingRecord } from '../types';

interface DashboardProps {
  records: MeetingRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ records }) => {
  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => a.timestamp - b.timestamp);
  }, [records]);

  const stats = useMemo(() => {
    if (records.length === 0) return { totalPeople: 0, totalDecisions: 0, totalVisitors: 0, avgAttendance: 0 };
    const totalPeople = records.reduce((acc, curr) => acc + curr.totalPeople, 0);
    const totalDecisions = records.reduce((acc, curr) => acc + curr.decisions, 0);
    const totalVisitors = records.reduce((acc, curr) => acc + curr.visitors + curr.kidsVisitors, 0);
    const avgAttendance = Math.round(totalPeople / records.length);
    
    return { totalPeople, totalDecisions, totalVisitors, avgAttendance };
  }, [records]);

  const chartData = useMemo(() => {
    return sortedRecords.slice(-10).map(r => ({
      name: r.date.split('-').reverse().slice(0, 2).join('/'),
      presenca: r.totalPeople,
      decisoes: r.decisions,
      visitantes: r.visitors + r.kidsVisitors,
    }));
  }, [sortedRecords]);

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] shadow-sm border border-[#D7CCC8]/30">
        <div className="w-24 h-24 bg-[#EFEBE9] rounded-full flex items-center justify-center text-[#D7CCC8] mb-6">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        </div>
        <h3 className="text-xl font-black text-[#3E2723] uppercase tracking-tighter">Aguardando Lançamentos</h3>
        <p className="text-[#A1887F] text-xs font-bold uppercase tracking-widest mt-2">Os dados aparecerão aqui após o registro</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#D7CCC8]/30">
          <p className="text-[10px] font-black text-[#A1887F] uppercase tracking-widest mb-2">Média Presença</p>
          <p className="text-3xl font-black text-[#3E2723] tracking-tighter">{stats.avgAttendance}</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#D7CCC8]/30">
          <p className="text-[10px] font-black text-[#A1887F] uppercase tracking-widest mb-2">Vidas Aceitas</p>
          <p className="text-3xl font-black text-emerald-600 tracking-tighter">{stats.totalDecisions}</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#D7CCC8]/30">
          <p className="text-[10px] font-black text-[#A1887F] uppercase tracking-widest mb-2">Visitantes Totais</p>
          <p className="text-3xl font-black text-amber-600 tracking-tighter">{stats.totalVisitors}</p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#D7CCC8]/30">
          <p className="text-[10px] font-black text-[#A1887F] uppercase tracking-widest mb-2">Reuniões</p>
          <p className="text-3xl font-black text-[#8D6E63] tracking-tighter">{records.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-[#D7CCC8]/30">
          <h3 className="text-sm font-black mb-8 text-[#3E2723] uppercase tracking-widest">Fluxo de Frequência</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A1887F', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#A1887F', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Line type="step" dataKey="presenca" stroke="#8D6E63" strokeWidth={4} dot={{r: 5, fill: '#8D6E63', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-[#D7CCC8]/30">
          <h3 className="text-sm font-black mb-8 text-[#3E2723] uppercase tracking-widest">Conversões & Visitantes</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A1887F', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#A1887F', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip 
                  cursor={{fill: '#FDFBF7'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                <Bar dataKey="decisoes" name="Vidas" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="visitantes" name="Novos" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-[#D7CCC8]/30 overflow-hidden">
        <div className="px-10 py-6 border-b border-[#F5F5F5]">
          <h3 className="text-sm font-black text-[#3E2723] uppercase tracking-widest">Histórico Detalhado</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-[#EFEBE9]/20 text-[#A1887F] font-black uppercase tracking-widest">
              <tr>
                <th className="px-10 py-5">Momento</th>
                <th className="px-10 py-5 text-center">Presença</th>
                <th className="px-10 py-5 text-center">Decisões</th>
                <th className="px-10 py-5 text-center">Novos</th>
                <th className="px-10 py-5 text-center">Kids</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F5]">
              {sortedRecords.slice().reverse().map(r => (
                <tr key={r.id} className="hover:bg-[#FDFBF7] transition-all">
                  <td className="px-10 py-5">
                    <span className="font-black text-[#3E2723]">{r.date.split('-').reverse().join('/')}</span>
                    <span className="ml-2 text-[#A1887F] font-bold">{r.time}</span>
                  </td>
                  <td className="px-10 py-5 text-center font-black text-[#3E2723]">{r.totalPeople}</td>
                  <td className="px-10 py-5 text-center text-emerald-600 font-black">{r.decisions}</td>
                  <td className="px-10 py-5 text-center text-[#8D6E63] font-bold">{r.visitors}</td>
                  <td className="px-10 py-5 text-center text-amber-600 font-bold">{r.kidsVisitors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
