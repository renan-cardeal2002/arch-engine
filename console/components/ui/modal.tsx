'use client';

import { Button } from "./button";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function Modal({ open, onClose, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-900 rounded-2xl p-6 min-w-[300px] max-w-full shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {children}
        <div className="mt-6 flex gap-2 justify-end">
          {footer ? (
            footer
          ) : (
            <Button
              className="px-4 py-2 rounded bg-neutral-800 text-white hover:bg-neutral-700 dark:bg-neutral-200 dark:text-black dark:hover:bg-neutral-300 transition"
              onClick={onClose}
            >
              Fechar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}