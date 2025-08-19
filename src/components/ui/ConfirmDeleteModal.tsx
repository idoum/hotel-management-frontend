'use client';

import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface Props {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

export default function ConfirmDeleteModal({
  show,
  onHide,
  onConfirm,
  title,
  message,
  isLoading = false,
  confirmText = 'Supprimer',
  cancelText = 'Annuler',
  variant = 'danger',
}: Props) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <p>{message}</p>
        <div className="text-muted small">
          <i className="bi bi-exclamation-triangle me-1"></i>
          Cette action est irréversible.
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={onConfirm} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Suppression...
            </>
          ) : (
            confirmText
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
