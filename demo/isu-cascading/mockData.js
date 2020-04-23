import {cascadingData, cascadingData2} from "./data.js";

MockDataPool.when("POST", "/init.do")
  .withExpectedHeader("content-type", "application/json;charset=utf-8")
  .withExpectedHeader("Cache-Control", "no-cache")
  .responseWith({
    status: 200,
    body: JSON.stringify(cascadingData)
  });

MockDataPool.when("POST", "/init2.do")
  .withExpectedHeader("content-type", "application/json;charset=utf-8")
  .withExpectedHeader("Cache-Control", "no-cache")
  .responseWith({
    status: 200,
    body: JSON.stringify(cascadingData2)
  });