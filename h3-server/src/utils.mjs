import { H3, serve, handleCors, defineHandler } from "h3";
import { readFileSync } from "fs";

/**
 * 通用的 JSON 文件读取函数
 * @param {string} filename - JSON 文件名
 * @param {Object} event - H3 事件对象
 * @returns {Object} - 返回读取的 JSON 数据或错误信息
 */
export const readJsonFile = (filename, event) => {
  // 处理 CORS
  const corsRes = handleCors(event, {
    origin: "*",
    preflight: {
      statusCode: 204,
    },
    methods: "*",
  });
  if (corsRes) {
    return corsRes;
  }

  try {
    const jsonData = readFileSync(filename, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    return {
      code: 500,
      message: "读取文件失败",
      error: error.message,
    };
  }
};
