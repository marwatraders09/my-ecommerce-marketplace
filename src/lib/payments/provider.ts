export type PaymentRequest = { orderId: string; amount: number; currency: string };
export type PaymentResult = { providerReference: string; status: "PENDING" | "PROCESSING" | "PAID" | "FAILED" };

export interface PaymentProvider {
  createPayment(request: PaymentRequest): Promise<PaymentResult>;
  verifyPayment(providerReference: string): Promise<PaymentResult>;
  refund(providerReference: string, amount: number): Promise<PaymentResult>;
}