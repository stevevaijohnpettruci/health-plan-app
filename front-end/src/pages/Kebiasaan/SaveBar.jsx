export const SaveBar = ({ onSave, status, errorMsg, label = 'Save changes' }) => {
  const isLoading = status === 'saving';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: '#FFFFFF', border: '1px solid #F0F0F0', borderRadius: 10,
      padding: '10px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      <div style={{ fontSize: 12, color: isError ? '#DC2626' : isSuccess ? '#16A34A' : '#9CA3AF' }}>
        {isError ? `❌ ${errorMsg || 'Failed to save.'}` : isSuccess ? '✅ Saved!' : isLoading ? '⏳ Saving…' : ''}
      </div>
      <button
        onClick={onSave}
        disabled={isLoading}
        style={{
          padding: '8px 20px', borderRadius: 8,
          background: isSuccess ? '#16A34A' : isLoading ? '#FED7AA' : '#F97316',
          border: 'none', color: '#FFFFFF', fontSize: 13, fontWeight: 600,
          cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.8 : 1,
        }}
      >
        {isLoading ? 'Saving...' : isSuccess ? 'Saved!' : label}
      </button>
    </div>
  );
};
