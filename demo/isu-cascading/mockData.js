import {cascadingData, cascadingData2, shanghaiData, hubeiData} from "./data.js";

MockDataPool.when("POST", "/init.do")
  .withExpectedHeader("content-type", "application/json;charset=utf-8")
  .withExpectedHeader("Cache-Control", "no-cache")
  .responseWith({
    status: 200,
    body: JSON.stringify(cascadingData)
  });

MockDataPool.when("GET", "/init2.do")
  .withExpectedHeader("Cache-Control", "no-cache")
  .responseWith({
    status: 200,
    body: JSON.stringify(cascadingData)
  });

MockDataPool.when("POST", "/init2.do?keyword=beijing")
  .withExpectedHeader("content-type", "application/json;charset=utf-8")
  .withExpectedHeader("Cache-Control", "no-cache")
  .responseWith({
    status: 200,
    body: JSON.stringify(cascadingData2)
  });

MockDataPool.when("POST", "/init2.do?keyword=shanghai")
  .withExpectedHeader("content-type", "application/json;charset=utf-8")
  .withExpectedHeader("Cache-Control", "no-cache")
  .responseWith({
    status: 200,
    body: JSON.stringify(shanghaiData)
  });

MockDataPool.when("POST", "/init2.do?keyword=hubei")
  .withExpectedHeader("content-type", "application/json;charset=utf-8")
  .withExpectedHeader("Cache-Control", "no-cache")
  .responseWith({
    status: 200,
    body: JSON.stringify(hubeiData)
  });