import type { MouseEvent, ReactNode } from "react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

import { Button } from "../Button/Button";

import styles from "./Modal.module.scss";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
}

const EXIT_ANIMATION_DURATION_MS = 180;

export function Modal({
  isOpen,
  title,
  children,
  footer,
  onClose,
}: ModalProps) {
  const titleId = useId();
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (isOpen) {
      rafId = requestAnimationFrame(() => {
        setIsMounted(true);
        setIsClosing(false);
      });
    } else if (isMounted) {
      rafId = requestAnimationFrame(() => {
        setIsClosing(true);
      });

      timeoutId = setTimeout(() => {
        setIsMounted(false);
        setIsClosing(false);
      }, EXIT_ANIMATION_DURATION_MS);
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, [isOpen, isMounted]);

  useEffect(() => {
    if (!isClosing) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsMounted(false);
      setIsClosing(false);
    }, EXIT_ANIMATION_DURATION_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isClosing]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isMounted, onClose]);

  if (!isMounted) {
    return null;
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const backdropClassName = isClosing
    ? `${styles.backdrop} ${styles.backdropClosing}`
    : `${styles.backdrop} ${styles.backdropOpening}`;

  const modalClassName = isClosing
    ? `${styles.modal} ${styles.modalClosing}`
    : `${styles.modal} ${styles.modalOpening}`;

  return createPortal(
    <div
      className={backdropClassName}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <section
        className={modalClassName}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>

          <Button
            type="button"
            variant="ghost"
            size="small"
            aria-label="Close modal"
            onClick={onClose}
          >
            <FiX size={20} />
          </Button>
        </header>

        <div className={styles.content}>{children}</div>

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </section>
    </div>,
    document.body,
  );
}
