import React from 'react';

export const STATUS_COLORS = {
  PENDING: 'bg-amber-100 text-amber-800',
  PAID: 'bg-blue-100 text-blue-700',
  FAILED: 'bg-green-100 text-green-800',
};

export const ROLE_COLORS = {
  ADMIN: 'bg-purple-100 text-purple-800',
  DOCTOR: 'bg-blue-100 text-blue-700',
  PATIENT: 'bg-gray-100 text-gray-700',
};

export const Badge = ({ label, colorMap }) => {
  const cls = colorMap[label] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
};

export const StatCard = ({ label, value, icon, accent }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">{label}</p>
      </div>
    </div>
  );
};

export const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <p className="text-gray-800 font-medium mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// ── NEW: Reusable Modal Wrapper for Forms ──────────────────────────────────────
export const ModalWrapper = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};