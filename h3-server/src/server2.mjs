import { H3, serve } from "h3";
import { $fetch } from "ofetch";
import axios from "axios";
import { readJsonFile } from "./utils.mjs";
import https from "https";

const app = new H3();
// const ultimateProxyUrl = "https://hqs-sgw-demo.mindimed.com";
const ultimateProxyUrl = "https://hqs-sgw-test.mindimed.com";
// const ultimateProxyUrl = "https://hqs-qy-test.mindimed.com";
// 

//#region  mock 路由
// app.use("/api/qualityControlTaskForms/formName", (event) =>
//   readJsonFile("../server2Files/qualityControlTaskForms_formName.json", event)
// );

// app.use("/api/qualityControlTaskForms/fields/a68ce56ddedb4a1fba7e6c1971fcab2a", (event) =>
//   readJsonFile("14608874f6ec463a8d7e7d829fa698b8.json", event)
// );

// app.use("/api/qualityControlStatistic/irregularReason/**", (event) =>
//   readJsonFile("irregularReasons.json", event)
// );

// app.use("/api/qualityControlStatistic/form/**", (event) => 
//   readJsonFile("list1.json", event)
// );

// app.use("/api/qualityControlTasks/progress", (event) =>
//   readJsonFile("lpr07v1.json", event)
// );

// app.use("/api/qualityControlStatisticDataReport/**", (event) =>
//   readJsonFile("lpr07v2.json", event)
// );

// app.use("/api/qualityControlStatisticDataReport/**", (event) =>
//   readJsonFile("lpr07v3.json", event)
// );

// app.use("/api/qualityControlTaskForms/formName/**", (event) => 
//   readJsonFile("lpr07v4.json", event)
// );

// app.use("/api/qualityControlTaskForms/**", (event) => 
//   readJsonFile("lpr07v5.json", event)
// );

// app.use("/api/qualityControlTasks/progress" , (event) =>
//   readJsonFile("progress.json", event)
// );

// app.use("/api/hypertension-record-items/show/6b63391684e2adfd8c9be0cb0f3b9a51", (event) =>
//  readJsonFile("lpr07v6.json", event)
// );

// app.use("/api/patients/info/1182816", (event) =>
//  readJsonFile("lpr07v6.json", event)
// );

// app.use("/api/qualityControlTaskForms/fields/275b8588535b493eb0ea8de0d22cb17d", (event) =>
//  readJsonFile("lpr07v7.json", event)
// );

// app.use("/api/patients/info/1450750", (event) =>
//  readJsonFile("lpr07v6.json", event)
// );

//#region

// 兜底代理
// app.use("/api/**", async (event) => {
//   const req = event.runtime.node.req;
//   const url = req.url || "";
//   const target = ultimateProxyUrl + url;
//   console.log("-->>兜底代理: ", target, "method:", req.method);

//   // 组装 fetch options
//   const opts = {
//     method: req.method,
//     headers: req.headers,
//   };

//   // 非 GET/HEAD 请求才读取 body
//   if (req.method !== "GET" && req.method !== "HEAD") {
//     opts.body = req;
//   }

//   return await $fetch(target, opts);
// });

app.use("/api/**", async (event) => {
  const req = event.runtime.node.req;
  const targetUrl = ultimateProxyUrl + (req.url || "");
  console.log("-->>兜底代理: ", targetUrl, "method:", req.method);

  // 避免自循环代理（可选）
  if (targetUrl.includes("localhost:3001")) {
    event.runtime.node.res.statusCode = 502;
    return { error: "Proxy loop detected" };
  }

  // 过滤 headers，移除 host（以及可能的 hop-by-hop headers）
  const forwardedHeaders = { ...req.headers };
  delete forwardedHeaders.host;
  delete forwardedHeaders.connection;
  // 你也可以删除 'origin' / 'referer' / 'content-length' 等视需要而定

  try {
    const resp = await axios({
      method: req.method,
      url: targetUrl,
      headers: forwardedHeaders,
      data: ["GET", "HEAD"].includes(req.method) ? undefined : req, // 直接透传流
      responseType: "arraybuffer",
      // 强制 SNI 使用目标域名（当你用 IP 连接但证书是域名时可用）
      httpsAgent: new https.Agent({
        servername: new URL(ultimateProxyUrl).hostname,
      }),
      validateStatus: () => true, // 我们自己转发状态码
    });

    // 回写上游 headers（注意过滤 hop-by-hop headers）
    for (const [k, v] of Object.entries(resp.headers)) {
      if (v != null) {
        event.runtime.node.res.setHeader(k, v);
      }
    }

    event.runtime.node.res.statusCode = resp.status;
    return resp.data;
  } catch (err) {
    event.runtime.node.res.statusCode = err.response?.status || 500;
    return err.response?.data || { error: err.message || String(err) };
  }
});

serve(app, { port: 3001 });

/**
 * Header 透传：axios 默认会带一些 header（比如 Content-Type、XSRF 之类），要在 $fetch 的 opts.headers 里透传给目标服务，
 * 否则可能丢信息。
 * 响应格式：$fetch 默认会把响应当 JSON 解析，如果目标返回的是非 JSON（比如图片、二进制），
 * 要小心用 fetch + res.arrayBuffer()/res.blob()。否则可能 axios 前端拿到的内容和预期不一致。
 */
