export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const RETURN_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
};

export const REFUND_STATUS = {
  PENDING: 'pending',
  PROCESSED: 'processed',
  FAILED: 'failed'
};

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit card',
  DEBIT_CARD: 'debit card',
  UPI: 'UPI',
  NET_BANKING: 'net banking',
  COD: 'cash on delivery',
  RAZORPAY: 'razorpay'
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.PROCESSING]: 'Processing',
  [ORDER_STATUS.SHIPPED]: 'Shipped',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled'
};

export const RETURN_STATUS_LABELS = {
  [RETURN_STATUS.PENDING]: 'Pending',
  [RETURN_STATUS.APPROVED]: 'Approved',
  [RETURN_STATUS.REJECTED]: 'Rejected',
  [RETURN_STATUS.COMPLETED]: 'Completed'
};