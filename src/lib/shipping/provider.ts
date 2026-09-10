export type ShipmentRequest = { orderId: string; sellerId: string; addressId: string };
export type ShipmentResult = { trackingNumber: string; status: "CREATED" | "PICKED_UP" | "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED" | "FAILED" | "RETURNED" };

export interface ShippingProvider {
  createShipment(request: ShipmentRequest): Promise<ShipmentResult>;
  trackShipment(trackingNumber: string): Promise<ShipmentResult>;
}