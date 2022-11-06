export interface Reserve {
  id: string;
  status: TimeStatus,
  isContract: boolean,
  dateFrom: string,
  dateTo: string,
  customerName: string,
  description: string,
  submitDate: Date
}

export enum TimeStatus {
  RESERVED = 'reserved',
  DISABLED = 'disabled',
  READY_TO_PAY = 'ready_to_pay',
  EMPTY = 'empty'
}
