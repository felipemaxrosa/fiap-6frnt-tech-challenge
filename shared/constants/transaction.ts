export const TRANSACTION_TYPE = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  TRANSFER: 'transfer',
} as const;

export const TRANSACTION_TYPE_OPTIONS = [
  { label: 'Depósito', value: TRANSACTION_TYPE.DEPOSIT },
  { label: 'Saque', value: TRANSACTION_TYPE.WITHDRAWAL },
  { label: 'Transferência', value: TRANSACTION_TYPE.TRANSFER },
] as const;
