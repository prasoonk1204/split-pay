import { useState, useEffect } from 'react';
import { Users, Plus, Trash2, ArrowRight } from 'lucide-react';

export default function SavedGroups({ onLoadGroup }) {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [addresses, setAddresses] = useState(['']);

  useEffect(() => {
    const cached = localStorage.getItem('splitpay_contact_groups');
    if (cached) {
      try {
        setGroups(JSON.parse(cached));
      } catch {
        setGroups([]);
      }
    } else {
      // Pre-populate with a demo group for a fuller UI experience
      const demoGroups = [
        {
          id: 'demo-1',
          name: 'Flatmates split',
          payees: [
            'GBZOOB75QVA2S2FWMJDWIYDQPXF6TKL5OJKMEIR3MVNQ5RFKLKJBCSFN',
            'GCRZFG2VFVFRP5454SMUETCNXHWI2DIMVTPF7YAHCCKQTVV64VXLEAIO'
          ]
        }
      ];
      setGroups(demoGroups);
      localStorage.setItem('splitpay_contact_groups', JSON.stringify(demoGroups));
    }
  }, []);

  const saveGroups = (newGroups) => {
    setGroups(newGroups);
    localStorage.setItem('splitpay_contact_groups', JSON.stringify(newGroups));
  };

  const handleAddAddress = () => {
    setAddresses([...addresses, '']);
  };

  const handleAddressChange = (idx, val) => {
    const updated = [...addresses];
    updated[idx] = val;
    setAddresses(updated);
  };

  const handleRemoveAddressField = (idx) => {
    if (addresses.length <= 1) return;
    setAddresses(addresses.filter((_, i) => i !== idx));
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    const cleanPayees = addresses.map(a => a.trim()).filter(Boolean);
    if (!groupName.trim() || cleanPayees.length === 0) return;

    const newGroup = {
      id: Date.now().toString(),
      name: groupName.trim(),
      payees: cleanPayees
    };

    saveGroups([...groups, newGroup]);
    setGroupName('');
    setAddresses(['']);
  };

  const handleDeleteGroup = (id) => {
    saveGroups(groups.filter(g => g.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Create Group Panel */}
      <div className="lg:col-span-1 rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-5 h-fit">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-zinc-900">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-800">
            <Plus className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">
            Create Split Group
          </h3>
        </div>

        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Roommates"
              required
              className="w-full px-3.5 py-2.5 rounded-xl text-xs placeholder-zinc-700 outline-none transition-all font-semibold bg-zinc-950 border border-zinc-800 text-white focus:border-cyan-500/50"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Payee Addresses
            </label>
            {addresses.map((addr, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={addr}
                  onChange={(e) => handleAddressChange(idx, e.target.value)}
                  placeholder="G... (Stellar Public Key)"
                  required
                  className="flex-1 px-3 py-2 rounded-lg text-[11px] font-mono placeholder-zinc-700 outline-none transition-all bg-zinc-950 border border-zinc-800 text-white focus:border-cyan-500/50"
                />
                {addresses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAddressField(idx)}
                    className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-950/15 rounded-lg border border-transparent hover:border-red-900/30 transition-all text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddAddress}
              className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 hover:text-white transition-colors flex items-center gap-1 pt-1"
            >
              + Add Payee Field
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 text-black hover:scale-[1.01]"
            style={{
              background: '#00f2ff',
              boxShadow: '0 0 15px rgba(0,242,255,0.2)',
            }}
          >
            Save Group Template
          </button>
        </form>
      </div>

      {/* Saved Groups List */}
      <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-[#0c0c0e] p-5 min-h-[350px]">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-zinc-900">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-800">
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">
            Your Split Groups
          </h3>
        </div>

        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
            <p className="text-2xl">👥</p>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No Saved Groups</p>
            <p className="text-[10px] text-zinc-600 max-w-[200px] leading-relaxed">
              Create a group template on the left to save frequently used split lists.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-4 hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold text-white truncate uppercase tracking-wider">{group.name}</h4>
                    <button
                      onClick={() => handleDeleteGroup(group.id)}
                      className="text-zinc-600 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-950/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    {group.payees.length} {group.payees.length === 1 ? 'payee' : 'payees'} registered
                  </p>

                  <div className="mt-3.5 space-y-1.5 max-h-24 overflow-y-auto pr-1">
                    {group.payees.map((payee, i) => (
                      <div key={i} className="text-[9px] font-mono text-zinc-400 truncate bg-zinc-900/60 p-1.5 rounded border border-zinc-900/40">
                        {payee}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onLoadGroup(group)}
                  className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-black bg-[#00f2ff] hover:bg-[#00d4ff] transition-all"
                  style={{ boxShadow: '0 0 10px rgba(0,242,255,0.1)' }}
                >
                  <span>Load Into Splitter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
