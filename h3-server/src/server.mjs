import { H3, serve, handleCors, defineHandler } from "h3";
import { readFileSync } from "fs";

/**
 * 通用的 JSON 文件读取函数
 * @param {string} filename - JSON 文件名
 * @param {Object} event - H3 事件对象
 * @returns {Object} - 返回读取的 JSON 数据或错误信息
 */
const readJsonFile = (filename, event) => {
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

// 个人基本信息
const zgZrg0 = (event) => readJsonFile("responseJsonFiles/zgZrg0.json", event);
// 儿童档案
const hWOMl6 = (event) => readJsonFile("responseJsonFiles/hWOMl6.json", event);
// 儿童访视
const RRbWxS = (event) => readJsonFile("responseJsonFiles/RRbWxS.json", event);
// 儿童中医药
const k37qzs = (event) => readJsonFile("responseJsonFiles/k37qzs.json", event);
// 产后访视
const epnILS = (event) => readJsonFile("responseJsonFiles/epnILS.json", event);
// 产后42天
const HQpUgY = (event) => readJsonFile("responseJsonFiles/HQpUgY.json", event);
// 统计-老年人
const yjBBmG = (event) => readJsonFile("responseJsonFiles/yjBBmG.json", event);



const app = new H3();

app.use((event) => {
  console.log(event.context.matchedRoute?.meta); // { tag: "admin" }
});

app.get(
  "/admin/**",
  defineHandler({
    meta: { tag: "admin" },
    handler: hWOMl6,
  })
);

app.get("/", () => "⚡️ Tadaa!");
app.get("/hWOMl6", hWOMl6);
app.get("/RRbWxS", RRbWxS);
app.get("/k37qzs", k37qzs);
app.get("/epnILS", epnILS);
app.get("/HQpUgY", HQpUgY);
app.get("/yjBBmG", yjBBmG);

 

 

// 启动服务
serve(app, { port: 3000 });
