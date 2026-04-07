import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Generic dialog container with backdrop, keyboard escape handling, close button, and optional title.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Modal>;

const openButton = (onClick: () => void) => (
  <button
    onClick={onClick}
    className="rounded-default bg-brand-primary px-md py-sm body-semibold text-content-inverse"
  >
    Abrir modal
  </button>
);

const confirmContent = (onClose: () => void) => (
  <>
    <p className="body-default text-content-secondary">
      Tem certeza que deseja continuar? Esta ação não pode ser desfeita.
    </p>
    <div className="flex justify-end gap-sm mt-lg">
      <button
        onClick={onClose}
        className="rounded-default border border-border px-md py-sm label-default text-content-primary hover:bg-background transition-colors"
      >
        Cancelar
      </button>
      <button
        onClick={onClose}
        className="rounded-default bg-brand-primary px-md py-sm label-default text-content-inverse hover:opacity-90 transition-opacity"
      >
        Confirmar
      </button>
    </div>
  </>
);

export const WithTitle: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        {openButton(() => setOpen(true))}
        <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirmar ação">
          {confirmContent(() => setOpen(false))}
        </Modal>
      </>
    );
  },
};

export const WithoutTitle: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        {openButton(() => setOpen(true))}
        <Modal isOpen={open} onClose={() => setOpen(false)}>
          {confirmContent(() => setOpen(false))}
        </Modal>
      </>
    );
  },
};

export const WithoutCloseButton: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        {openButton(() => setOpen(true))}
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Confirmar ação"
          showCloseButton={false}
        >
          {confirmContent(() => setOpen(false))}
        </Modal>
      </>
    );
  },
};
