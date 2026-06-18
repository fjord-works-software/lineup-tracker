export default function ConfirmModal({ message, onConfirm, onCancel, confirmLabel = 'OK' }) {
  return (
    <div className="fixed inset-0 bg-black/70 grid place-items-center z-50 px-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-sm">
        <p className="text-slate-900 text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
