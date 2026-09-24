import { useEffect, useState } from 'react';
import { Trash2, Undo2 } from 'lucide-react';
import './FuseButton.css';

export default function FuseButton({
  label = 'Eliminar',
  undoLabel = 'Deshacer',
  undoWindow = 4000,
  onCommit,
  onUndo,
}) {
  const [armed, setArmed] = useState(false);

  const commit = () => {
    if (armed) return;

    setArmed(true);
    onCommit?.();
  };

  const undo = () => {
    setArmed(false);
    onUndo?.();
  };

  useEffect(() => {
    if (!armed) return undefined;

    const timer = setTimeout(() => {
      setArmed(false);
    }, undoWindow);

    return () => clearTimeout(timer);
  }, [armed, undoWindow]);

  if (armed) {
    return (
      <button
        className="fuse-button fuse-active"
        onClick={undo}
      >
        <Undo2 size={15} />

        {undoLabel}

        <span
          className="fuse-progress"
          style={{
            animationDuration: `${undoWindow}ms`,
          }}
        />
      </button>
    );
  }

  return (
    <button
      className="fuse-button"
      onClick={commit}
    >
      <Trash2 size={15} />
      {label}
    </button>
  );
}