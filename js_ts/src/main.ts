// main.ts
import { SafeUserSchema } from "./schemas.js";

const badData = {
  name: null,
  age: "not-a-number",
  isActive: undefined,
  tags: null,
  address: { city: 123 },
};

const result = SafeUserSchema.parse(badData);
console.log(result);
