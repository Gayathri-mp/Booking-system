export default function Toast({ message, type = 'success' }) {
  return (
    <div className={`toast toast--${type}`} role="alert" aria-live="polite">
      <i className={`fas ${type === 'error' ? 'fa-times-circle' : 'fa-check-circle'}`}></i>
      <span>{message}</span>
    </div>
  );
}
