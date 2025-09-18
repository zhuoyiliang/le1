import { H3, serve } from "h3";
import { $fetch } from "ofetch";
import { readJsonFile } from "./utils.mjs";

const app = new H3();

// mock 路由
app.use("/api/qualityControlTaskForms/formName", (event) => readJsonFile("../server2Files/qualityControlTaskForms_formName.json", event));

// 兜底代理
app.use("/api/**", async (event) => {
  const req = event.runtime.node.req;
  const url = req.url || "";
  const target = "https://hqs-sgw-test.mindimed.com" + url;

  // 组装 fetch options
  const opts = {
    method: req.method,
    headers: req.headers,
  };

  // 非 GET/HEAD 请求才读取 body
  if (req.method !== "GET" && req.method !== "HEAD") {
    opts.body = req;
  }

  console.log("兜底代理: ", target, "method:", req.method);
  return await $fetch(target, opts);
});

serve(app, { port: 3001 });
