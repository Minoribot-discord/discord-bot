import { z } from "deps";

export const webhookIdAndTokenSchema = z.object({
  id: z.bigint(), //.or(z.string()),
  token: z.string().optional(),
});
export type WebhookIdAndToken = z.infer<typeof webhookIdAndTokenSchema>;
