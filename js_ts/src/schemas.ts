// schemas.ts
import { z } from "zod";
import { withDefault } from "./schemaUtils.js";

const addressSchema = z.object({
  city: z.string(),
  zip: z.number(),
});

const userSchema = z.object({
  name: z.string(),
  age: z.number(),
  isActive: z.boolean(),
  tags: z.array(z.string()),
  address: addressSchema,
});

// 包装：自动添加默认值
export const SafeUserSchema = withDefault(userSchema);
