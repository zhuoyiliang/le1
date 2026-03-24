// schemaUtils.ts
import { z } from "zod";

// 默认值映射函数
function getDefault<T>(schema: z.ZodType<T>): T {
  if (schema instanceof z.ZodString) {
    return "" as T;
  }
  if (schema instanceof z.ZodNumber) {
    return 0 as T;
  }
  if (schema instanceof z.ZodBoolean) {
    return false as T;
  }
  if (schema instanceof z.ZodArray) {
    return [] as T;
  }
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape as any;
    const defaultObj: any = {};
    for (const key in shape) {
      defaultObj[key] = getDefault(shape[key]);
    }
    return defaultObj as T;
  }
  // 兜底
  return undefined as T;
}

// 递归地为 schema 添加默认值
export function withDefault<T>(schema: z.ZodType<T>): z.ZodType<T> {
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    const inner = (schema as any)._def.innerType;
    const defaultVal = getDefault(inner);
    return schema.default(defaultVal) as z.ZodType<T>;
  }

  if (
    schema instanceof z.ZodString ||
    schema instanceof z.ZodNumber ||
    schema instanceof z.ZodBoolean
  ) {
    const defaultVal = getDefault(schema);
    return schema.default(defaultVal) as z.ZodType<T>;
  }

  if (schema instanceof z.ZodArray) {
    const element = (schema as any)._def.type;
    const defaultElement = getDefault(element);
    // 这里我们不能直接 default，但可以 transform 处理无效值
    return schema
      .nullish()
      .transform(() => [] as any)
      .or(schema.default([] as any))
      .catch([] as any) as z.ZodType<T>;
  }

  if (schema instanceof z.ZodObject) {
    const newShape: any = {};
    for (const key in schema.shape) {
      newShape[key] = withDefault(schema.shape[key]);
    }
    return z.object(newShape).catch(() => getDefault(schema)) as z.ZodType<T>;
  }

  return schema.catch(() => getDefault(schema));
}
