import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Modal>;

export const WithTitle: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="rounded-default bg-brand-primary px-md py-sm body-semibold text-content-inverse"
        >
          Abrir modal
        </button>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirmar ação">
          <p className="body-default text-content-secondary">
            Tem certeza que deseja continuar? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-sm mt-lg">
            {/* TODO - Replace it to the <Button /> component once it's done */}
            <button
              onClick={() => setOpen(false)}
              className="rounded-default border border-border px-md py-sm label-default text-content-primary hover:bg-background transition-colors"
            >
              Cancelar
            </button>
            {/* TODO - Replace it to the <Button /> component once it's done */}
            <button
              onClick={() => setOpen(false)}
              className="rounded-default bg-brand-primary px-md py-sm label-default text-content-inverse hover:opacity-90 transition-opacity"
            >
              Confirmar
            </button>
          </div>
        </Modal>
      </>
    );
  },
};
