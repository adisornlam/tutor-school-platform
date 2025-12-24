export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer', // โอนเงิน (default)
  ONLINE = 'online' // ชำระออนไลน์
}

export interface Payment {
  id: number
  user_id: number
  enrollment_id?: number
  amount: number
  discount_amount: number
  final_amount: number
  currency: string
  status: PaymentStatus
  payment_method: PaymentMethod
  transaction_id?: string
  invoice_number: string
  paid_at?: Date
  created_at: Date
  updated_at: Date
}

export interface PaymentItem {
  id: number
  payment_id: number
  item_type: 'course' | 'enrollment'
  item_id: number
  description: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface CreatePaymentData {
  enrollment_id?: number
  payment_method: PaymentMethod
  promotion_code?: string
}

