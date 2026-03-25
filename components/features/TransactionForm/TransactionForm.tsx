'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { DatePicker } from '@/components/ui/DatePicker';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TRANSACTION_TYPE, TRANSACTION_TYPE_OPTIONS } from '@/shared/constants/transaction';
import { transactionFormSchema } from './schema';
import type { TransactionFormProps, TransactionFormValues } from './ITransactionForm';

const CURRENCY = 'R$';
const DEFAULT_CURRENCY_PLACEHOLDER = '0,00';
const DEFAULT_DATE_PLACEHOLDER = 'Selecione uma data';
const DEFAULT_DESCRIPTION_PLACEHOLDER = 'Adicione uma descrição';

interface FormFieldErrorProps {
  error?: { message?: string };
}

function FormFieldError({ error }: FormFieldErrorProps) {
  if (!error?.message) return null;
  return <p className="body-small text-error mt-xs">{error.message}</p>;
}

function roundAmount(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function TransactionForm({
  onSubmit,
  onCancel,
  initialValues,
  isSubmitting = false,
}: TransactionFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: initialValues?.type || TRANSACTION_TYPE.DEPOSIT,
      amount: initialValues?.amount || 0,
      date: initialValues?.date || '',
      description: initialValues?.description || '',
    },
  });

  const handleFormSubmit = (data: TransactionFormValues) => {
    onSubmit({
      ...data,
      amount: roundAmount(data.amount),
    });
  };

  const getSubmitButtonLabel = () => {
    if (initialValues) {
      return isSubmitting ? 'Atualizando...' : 'Atualizar transação';
    }
    return isSubmitting ? 'Concluindo...' : 'Concluir transação';
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-lg">
      <div>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Selecione o tipo de transação"
              options={TRANSACTION_TYPE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <FormFieldError error={errors.type} />
      </div>

      <div>
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <CurrencyInput
              label="Valor"
              value={field.value}
              onValueChange={field.onChange}
              currency={CURRENCY}
              placeholder={DEFAULT_CURRENCY_PLACEHOLDER}
              disabled={isSubmitting}
            />
          )}
        />
        <FormFieldError error={errors.amount} />
      </div>

      <div>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              label="Data"
              placeholder={DEFAULT_DATE_PLACEHOLDER}
              disabled={isSubmitting}
              onChange={field.onChange}
            />
          )}
        />
        <FormFieldError error={errors.date} />
      </div>

      <div>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Descrição (opcional)"
              placeholder={DEFAULT_DESCRIPTION_PLACEHOLDER}
              disabled={isSubmitting}
            />
          )}
        />
        <FormFieldError error={errors.description} />
      </div>

      <div className="flex justify-end gap-sm mt-lg">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || !isDirty} loading={isSubmitting}>
          {getSubmitButtonLabel()}
        </Button>
      </div>
    </form>
  );
}
