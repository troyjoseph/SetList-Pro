import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Filter } from 'lucide-react';
import { MODAL } from '../../styles/modals';
import { COMMON } from '../../styles/common';

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilter: string;
  onApply: (filterString: string) => void;
}

const FIELDS = [
  { id: 'title', label: 'Song Title' },
  { id: 'artist', label: 'Artist' },
  { id: 'key', label: 'Key' },
  { id: 'rating', label: 'Rating' },
  { id: 'slow', label: 'Slow' },
  { id: 'duet', label: 'Duet' },
];

const OPERATORS: Record<string, { label: string; value: string }[]> = {
  title: [{ label: 'contains', value: '>' }, { label: 'starts with', value: '=' }],
  artist: [{ label: 'contains', value: '>' }, { label: 'is', value: '=' }],
  key: [{ label: 'is', value: '=' }],
  rating: [
    { label: '=', value: '=' },
    { label: '>', value: '>' },
    { label: '<', value: '<' },
    { label: '>=', value: '>=' },
    { label: '<=', value: '<=' },
  ],
  slow: [{ label: 'is', value: '=' }],
  duet: [{ label: 'is', value: '=' }],
};

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, currentFilter, onApply }) => {
  const [rules, setRules] = useState<FilterRule[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Try to parse current filter string into rules
      const parsedRules: FilterRule[] = [];
      const parts = currentFilter.split(/\s+AND\s+/i);
      
      parts.forEach((part, index) => {
        const match = part.trim().match(/^(\w+)\s*(=|>|<|>=|<=)\s*(.+)$/i);
        if (match) {
          const [, key, op, val] = match;
          parsedRules.push({
            id: index.toString(),
            field: key.toLowerCase(),
            operator: op,
            value: val.trim(),
          });
        }
      });

      setRules(parsedRules.length > 0 ? parsedRules : [{ id: '0', field: 'title', operator: '>', value: '' }]);
    }
  }, [isOpen, currentFilter]);

  if (!isOpen) return null;

  const addRule = () => {
    setRules([...rules, { id: Date.now().toString(), field: 'title', operator: '>', value: '' }]);
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const updateRule = (id: string, updates: Partial<FilterRule>) => {
    setRules(rules.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, ...updates };
      // Reset operator if field changes
      if (updates.field) {
        updated.operator = OPERATORS[updates.field][0].value;
        if (updates.field === 'slow' || updates.field === 'duet') {
            updated.value = 'true';
        }
      }
      return updated;
    }));
  };

  const handleApply = () => {
    const filterString = rules
      .filter(r => r.value.trim() !== '')
      .map(r => `${r.field} ${r.operator} ${r.value}`)
      .join(' AND ');
    onApply(filterString);
    onClose();
  };

  const handleClear = () => {
    onApply('');
    onClose();
  };

  return (
    <div className={MODAL.OVERLAY} onClick={onClose}>
      <div className={`${MODAL.CONTAINER} max-w-lg`} onClick={e => e.stopPropagation()}>
        <div className={MODAL.HEADER}>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-indigo-600" />
            <h2 className={MODAL.TITLE}>Filter Songs</h2>
          </div>
          <COMMON.BUTTON.ICON onClick={onClose}><X size={20} /></COMMON.BUTTON.ICON>
        </div>

        <div className={MODAL.BODY}>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <select
                    className={MODAL.SELECT_INPUT}
                    value={rule.field}
                    onChange={e => updateRule(rule.id, { field: e.target.value })}
                  >
                    {FIELDS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                  </select>

                  <select
                    className={MODAL.SELECT_INPUT}
                    value={rule.operator}
                    onChange={e => updateRule(rule.id, { operator: e.target.value })}
                  >
                    {OPERATORS[rule.field]?.map(op => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </select>

                  {rule.field === 'slow' || rule.field === 'duet' ? (
                    <select
                      className={MODAL.SELECT_INPUT}
                      value={rule.value}
                      onChange={e => updateRule(rule.id, { value: e.target.value })}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  ) : rule.field === 'rating' ? (
                    <select
                      className={MODAL.SELECT_INPUT}
                      value={rule.value}
                      onChange={e => updateRule(rule.id, { value: e.target.value })}
                    >
                      {[0, 1, 2, 3].map(n => <option key={n} value={n.toString()}>{n} Stars</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className={MODAL.SELECT_INPUT}
                      placeholder="Value..."
                      value={rule.value}
                      onChange={e => updateRule(rule.id, { value: e.target.value })}
                    />
                  )}
                </div>
                <button 
                  onClick={() => removeRule(rule.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <button
              onClick={addRule}
              className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium py-2 px-1"
            >
              <Plus size={16} />
              Add Filter Condition
            </button>
          </div>
        </div>

        <div className={MODAL.FOOTER}>
          <button onClick={handleClear} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
            Clear All
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleApply} className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium shadow-sm">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
