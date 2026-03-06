const express = require("express");
const axios = require("axios");
const router = express.Router();

router.all("/request", async (req, res) => {
  const { method, url, headers, body } = req.body;

  console.log(`Proxying ${method} request to: ${url}`);
  console.log("Headers received:", headers);
  console.log("Body received:", body);
  console.log("Body type:", typeof body);

  try {
    const response = await axios({
      method: method.toLowerCase(),
      url: url,
      headers: headers || {},
      data: body,
      validateStatus: false,
      timeout: 30000,
    });

    res.json({
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
    });
  } catch (error) {
    console.error("Proxy error:", error.message);

    if (error.response) {
      res.json({
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: error.response.data,
      });
    } else if (error.request) {
      res.status(500).json({
        error: "No response received from server",
        details: error.message,
      });
    } else {
      res.status(500).json({
        error: "Error setting up request",
        details: error.message,
      });
    }
  }
});

router.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

module.exports = router;
