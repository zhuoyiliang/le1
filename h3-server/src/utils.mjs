import { handleCors } from "h3";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // E:\working\codes\le1\h3-server\src
const projectRoot = join(__dirname, "../server2Files"); // E:\working\codes\le1\h3-server\server2Files

/**
 * 通用的 JSON 文件读取函数
 * @param {string} filename - JSON 文件名（相对于当前文件目录）
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
    // 构建相对于当前文件目录的绝对路径
    const filePath = join(projectRoot, filename);
    const jsonData = readFileSync(filePath, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    return {
      code: 500,
      message: "读取文件失败",
      error: error.message,
    };
  }
};
