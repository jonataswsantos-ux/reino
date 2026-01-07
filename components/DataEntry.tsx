
import React, { useState } from 'react';
import { MeetingRecord } from '../types';

interface DataEntryProps {
  branchId: string;
  onSave: (record: MeetingRecord) => void;
}

const DataEntry: React.FC<DataEntryProps> = ({ branchId, onSave }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    totalPeople: '',
    decisions: '',
    visitors: '',
    kidsVisitors: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: MeetingRecord = {
      id: crypto.randomUUID(),
      date: formData.date,
      time: formData.time,
      totalPeople: Number(formData.totalPeople),
      decisions: Number(formData.decisions),
      visitors: Number(formData.visitors),
      kidsVisitors: Number(formData.kidsVisitors),
      branchId: branchId,
      timestamp: new Date(`${formData.date}T${formData.time}`).getTime()
    };
    onSave(newRecord);
    setFormData({
      ...formData,
      totalPeople: '',
      decisions: '',
      visitors: '',
      kidsVisitors: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-[#D7CCC8]/30">
        <h3 className="text-xl font-black text-[#3E2723] mb-8 uppercase tracking-tighter">Novo Lançamento</h3>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-[#A1887F] uppercase tracking-widest mb-3">Data</label>
              <input
                required
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-[#FDFBF7] border border-[#D7CCC8] rounded-2xl focus:ring-2 focus:ring-[#8D6E63] outline-none text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-[#A1887F] uppercase tracking-widest mb-3">Hora</label>
              <input
                required
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-[#FDFBF7] border border-[#D7CCC8] rounded-2xl focus:ring-2 focus:ring-[#8D6E63] outline-none text-sm font-bold"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-[#A1887F] uppercase tracking-widest mb-3">Total Presente</label>
              <input
                required
                type="number"
                name="totalPeople"
                placeholder="0"
                value={formData.totalPeople}
                onChange={handleChange}
                className="w-full px-6 py-5 bg-[#FDFBF7] border border-[#D7CCC8] rounded-2xl focus:ring-2 focus:ring-[#8D6E63] outline-none text-xl font-black"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">Decisões p/ Jesus</label>
                <input
                  required
                  type="number"
                  name="decisions"
                  placeholder="0"
                  value={formData.decisions}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3">Visitantes</label>
                  <input
                    required
                    type="number"
                    name="visitors"
                    placeholder="0"
                    value={formData.visitors}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-amber-50/30 border border-amber-100 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#8D6E63] uppercase tracking-widest mb-3">Kids</label>
                  <input
                    required
                    type="number"
                    name="kidsVisitors"
                    placeholder="0"
                    value={formData.kidsVisitors}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-[#EFEBE9]/30 border border-[#D7CCC8]/30 rounded-2xl focus:ring-2 focus:ring-[#8D6E63] outline-none font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#5D4037] hover:bg-[#3E2723] text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-[0.98] uppercase text-xs tracking-[0.2em]"
          >
            Finalizar Lançamento
          </button>
        </form>
      </div>
    </div>
  );
};

export default DataEntry;
