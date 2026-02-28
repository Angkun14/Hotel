import { z } from "zod";

export const BookingCreateSchema = z.object({
  hotelId: z.string().min(1),
  roomId: z.string().min(1),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.number().int().min(1).max(10),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  requests: z.string().optional(),
  paymentMethod: z.enum(["pay_at_hotel", "promptpay_qr", "card_stripe"]).optional(),
});

export const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const BookingStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "refunded"]),
  refundAmount: z.number().optional(),
  refundReason: z.string().optional(),
});