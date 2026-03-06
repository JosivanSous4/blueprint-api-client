import React, { useState, useEffect } from "react";
import { FaTrash, FaEye, FaDownload, FaSearch } from "react-icons/fa";
import { format } from "date-fns";
import CodeEditor from "./CodeEditor";
import "./ResponseHistory.css";

const ResponseHistory = ({
  savedResponses,
  onLoadSavedResponse,
  onDeleteSavedResponse,
  onRefresh,
  currentRequest,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const filteredResponses =
    savedResponses?.saved_responses?.filter((response) => {
      if (currentRequest && currentRequest.url && currentRequest.method) {
        const matchesRequest =
          response.request_info?.url === currentRequest.url &&
          response.request_info?.method === currentRequest.method;

        if (!matchesRequest) {
          return false;
        }
      }

      return (
        response.savedName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.request_info?.url
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        response.request_info?.method
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }) || [];

  const handleViewResponse = (response) => {
    setSelectedResponse(response);
    setViewModalOpen(true);
  };

  const handleLoadResponse = (response) => {
    if (onLoadSavedResponse) {
      onLoadSavedResponse(response);
    }
  };

  const handleDeleteResponse = (responseId) => {
    if (
      window.confirm("Are you sure you want to delete this saved response?")
    ) {
      if (onDeleteSavedResponse) {
        onDeleteSavedResponse(responseId);
      }
    }
  };

  const downloadResponse = (response) => {
    const dataStr = formatResponseData(response);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `response-${response.savedName}-${Date.now()}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const formatResponseData = (response) => {
    if (!response) return "";

    let responseData;
    if (response.response?.data) {
      responseData = response.response.data;
    } else if (response.data) {
      responseData = response.data;
    } else {
      return "";
    }

    if (typeof responseData === "object") {
      return JSON.stringify(responseData, null, 2);
    }
    return responseData;
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return "success";
    if (status >= 300 && status < 400) return "info";
    if (status >= 400 && status < 500) return "warning";
    if (status >= 500) return "error";
    return "default";
  };

  return (
    <div className="response-history">
      <div className="history-header">
        <h3>Saved Responses</h3>
        <div className="history-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search responses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={onRefresh} className="refresh-btn" title="Refresh">
            🔄
          </button>
        </div>
      </div>

      {filteredResponses.length === 0 ? (
        <div className="empty-history">
          <p>No saved responses found</p>
          <small>Save a response to see it here</small>
        </div>
      ) : (
        <div className="responses-list">
          {filteredResponses.map((response) => (
            <div key={response.id} className="response-item">
              <div className="response-main">
                <div className="response-info">
                  <h4 className="response-name">{response.savedName}</h4>
                  <div className="response-meta">
                    <span
                      className={`status-badge ${getStatusColor(response.response?.status)}`}
                    >
                      {response.response?.status}{" "}
                      {response.response?.statusText}
                    </span>
                    <span className="method-badge">
                      {response.request_info?.method}
                    </span>
                    <span className="url">{response.request_info?.url}</span>
                  </div>
                  <div className="response-details">
                    <span className="save-time">
                      {response.savedAt
                        ? format(
                            new Date(response.savedAt),
                            "MMM dd, yyyy HH:mm",
                          )
                        : "Unknown"}
                    </span>
                    {response.response?.duration && (
                      <span className="duration">
                        {response.response.duration}ms
                      </span>
                    )}
                  </div>
                  <div className="response-preview">
                    <small>
                      {formatResponseData(response).substring(0, 100)}...
                    </small>
                  </div>
                </div>
                <div className="response-actions">
                  <button
                    onClick={() => handleViewResponse(response)}
                    className="action-btn view-btn"
                    title="View Response"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleLoadResponse(response)}
                    className="action-btn load-btn"
                    title="Load as Current Response"
                  >
                    📋
                  </button>
                  <button
                    onClick={() => downloadResponse(response)}
                    className="action-btn download-btn"
                    title="Download Response"
                  >
                    <FaDownload />
                  </button>
                  <button
                    onClick={() => handleDeleteResponse(response.id)}
                    className="action-btn delete-btn"
                    title="Delete Response"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewModalOpen && selectedResponse && (
        <div className="modal-overlay" onClick={() => setViewModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedResponse.savedName}</h3>
              <button
                onClick={() => setViewModalOpen(false)}
                className="close-btn"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="response-details-grid">
                <div className="detail-item">
                  <label>Request URL:</label>
                  <span>{selectedResponse.request_info?.url}</span>
                </div>
                <div className="detail-item">
                  <label>Method:</label>
                  <span className="method-badge">
                    {selectedResponse.request_info?.method}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Status:</label>
                  <span
                    className={`status-badge ${getStatusColor(selectedResponse.response?.status)}`}
                  >
                    {selectedResponse.response?.status}{" "}
                    {selectedResponse.response?.statusText}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Saved At:</label>
                  <span>
                    {selectedResponse.savedAt
                      ? format(new Date(selectedResponse.savedAt), "PPPpp")
                      : "Unknown"}
                  </span>
                </div>
              </div>
              <div className="response-body">
                <h4>Response Body</h4>
                <CodeEditor
                  value={formatResponseData(selectedResponse)}
                  readOnly={true}
                  language="json"
                  height="400px"
                  theme="vs-dark"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseHistory;
