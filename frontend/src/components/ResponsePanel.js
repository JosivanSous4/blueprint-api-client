import React, { useState, useRef, useEffect } from "react";
import { FaSave, FaDownload, FaCopy } from "react-icons/fa";
import CodeEditor from "./CodeEditor";
import "./ResponsePanel.css";

const ResponsePanel = ({ response, loading, onSaveResponse }) => {
  const [activeTab, setActiveTab] = useState("body");
  const [responseName, setResponseName] = useState("");
  const [isResizing, setIsResizing] = useState(false);
  const [editorHeight, setEditorHeight] = useState(() => {
    const saved = localStorage.getItem("responsePanelHeight");
    return saved ? parseInt(saved, 10) : 400;
  });
  const resizeRef = useRef(null);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const handleMouseDown = (e) => {
    setIsResizing(true);
    startY.current = e.clientY;
    startHeight.current = editorHeight;
    e.preventDefault();
    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        const deltaY = startY.current - e.clientY;
        const newHeight = Math.max(
          200,
          Math.min(800, startHeight.current - deltaY),
        );
        setEditorHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      if (isResizing) {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };
  }, [isResizing]);

  useEffect(() => {
    localStorage.setItem("responsePanelHeight", editorHeight.toString());
  }, [editorHeight]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "ArrowUp") {
        e.preventDefault();
        setEditorHeight((prev) => Math.min(800, prev + 50));
      } else if (e.ctrlKey && e.shiftKey && e.key === "ArrowDown") {
        e.preventDefault();
        setEditorHeight((prev) => Math.max(200, prev - 50));
      } else if (e.ctrlKey && e.key === "r") {
        e.preventDefault();
        setEditorHeight(400);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const formatJson = (data) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return String(data);
    }
  };

  const detectContentType = (headers) => {
    if (!headers) return "text";
    const contentType =
      headers["content-type"] || headers["Content-Type"] || "";
    if (contentType.includes("json")) return "json";
    if (contentType.includes("xml")) return "xml";
    if (contentType.includes("html")) return "html";
    if (contentType.includes("javascript")) return "javascript";
    return "text";
  };

  const formatResponseData = () => {
    if (!response || !response.data) return "";
    if (typeof response.data === "object") {
      return formatJson(response.data);
    }
    return response.data;
  };

  const formatHeaders = () => {
    if (!response || !response.headers) return "";
    return formatJson(response.headers);
  };

  const handleSaveResponse = () => {
    const name = responseName || `Response ${new Date().toLocaleString()}`;
    if (onSaveResponse) {
      onSaveResponse({
        ...response,
        savedName: name,
        savedAt: new Date().toISOString(),
      });
      setResponseName("");
    }
  };

  const downloadResponse = () => {
    const dataStr = formatResponseData();
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `response-${Date.now()}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatResponseData());
  };

  if (loading) {
    return (
      <div className="response-panel loading">
        <div className="spinner"></div>
        <p>Sending request...</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="response-panel empty">
        <p>No response yet. Send a request to see the response.</p>
      </div>
    );
  }

  if (response.error) {
    return (
      <div className="response-panel error">
        <h3>Error</h3>
        <p>{response.message}</p>
        <small>{response.time}</small>
      </div>
    );
  }

  return (
    <div className="response-panel">
      <div className="response-header">
        <div className="status-info">
          <span
            className={`status-code ${response.status >= 200 && response.status < 300 ? "success" : "error"}`}
          >
            {response.status} {response.statusText}
          </span>
          <span className="response-time">{response.time}</span>
          {response.duration && (
            <span className="response-duration">{response.duration}ms</span>
          )}
        </div>
        <div className="response-actions">
          <input
            type="text"
            placeholder="Response name..."
            value={responseName}
            onChange={(e) => setResponseName(e.target.value)}
            className="response-name-input"
          />
          <button
            onClick={handleSaveResponse}
            className="save-response-btn"
            title="Save Response"
          >
            <FaSave /> Save
          </button>
          <button
            onClick={downloadResponse}
            className="download-btn"
            title="Download Response"
          >
            <FaDownload /> Download
          </button>
          <button
            onClick={copyToClipboard}
            className="copy-btn"
            title="Copy to Clipboard"
          >
            <FaCopy /> Copy
          </button>
        </div>
      </div>

      <div className="response-tabs">
        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === "body" ? "active" : ""}`}
            onClick={() => setActiveTab("body")}
          >
            Body
          </button>
          <button
            className={`tab-btn ${activeTab === "headers" ? "active" : ""}`}
            onClick={() => setActiveTab("headers")}
          >
            Headers
          </button>
          <button
            className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Info
          </button>
        </div>

        <div
          className={`tab-content ${isResizing ? "resizing" : ""}`}
          ref={resizeRef}
          style={{ height: editorHeight }}
        >
          <div className="resize-handle" onMouseDown={handleMouseDown}>
            <div className="resize-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="resize-tooltip">{editorHeight}px</span>
          </div>
          {activeTab === "body" && (
            <CodeEditor
              value={formatResponseData()}
              readOnly={true}
              language={detectContentType(response.headers)}
              height="100%"
              theme="vs-dark"
            />
          )}

          {activeTab === "headers" && (
            <CodeEditor
              value={formatHeaders()}
              readOnly={true}
              language="json"
              height="100%"
              theme="vs-dark"
            />
          )}

          {activeTab === "info" && (
            <div className="response-info">
              <div className="info-grid">
                <div className="info-item">
                  <label>Status:</label>
                  <span>
                    {response.status} {response.statusText}
                  </span>
                </div>
                <div className="info-item">
                  <label>Time:</label>
                  <span>{response.time}</span>
                </div>
                {response.duration && (
                  <div className="info-item">
                    <label>Duration:</label>
                    <span>{response.duration}ms</span>
                  </div>
                )}
                <div className="info-item">
                  <label>Size:</label>
                  <span>{JSON.stringify(response.data).length} bytes</span>
                </div>
                <div className="info-item">
                  <label>Content-Length:</label>
                  <span>
                    {response.headers?.["content-length"] ||
                      response.headers?.["Content-Length"] ||
                      "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponsePanel;
