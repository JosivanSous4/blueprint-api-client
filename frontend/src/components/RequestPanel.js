import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPlus, FaTrash } from "react-icons/fa";
import CodeEditor from "./CodeEditor";
import "./RequestPanel.css";

const RequestPanel = ({
  currentRequest,
  setCurrentRequest,
  onSendRequest,
  loading,
  urlInputRef,
  activeCollectionId,
  onUpdateRequest,
  collections,
}) => {
  const [openRequests, setOpenRequests] = useState([
    {
      id: "new",
      name: "New Request",
      isActive: true,
      method: "GET",
      url: "",
      headers: {},
      body: "",
      bodyType: "none",
      collectionId: null, // null para requests isolados
      isSaved: false, // false para requests não salvos
    },
  ]);

  const [isolatedRequests, setIsolatedRequests] = useState([]); // requests que não pertencem a nenhuma collection
  const [editingTabId, setEditingTabId] = useState(null); // controle de edição de tab

  useEffect(() => {
    if (currentRequest && currentRequest.id) {
      const existingTab = openRequests.find(
        (req) => req.id === currentRequest.id,
      );

      if (!existingTab) {
        // Criar nova tab para a request se não existir
        console.log(
          "Creating new tab for request:",
          currentRequest.id,
          currentRequest.name,
        );
        const belongsToCollection =
          currentRequest.collectionId || activeCollectionId;

        const newTab = {
          ...currentRequest,
          isActive: true,
          collectionId: belongsToCollection || null,
          isSaved: !!belongsToCollection,
        };

        setOpenRequests((prev) => [
          ...prev.map((req) => ({ ...req, isActive: false })),
          newTab,
        ]);
      } else {
        // Se a tab já existe, apenas ativá-la
        setOpenRequests((prev) =>
          prev.map((req) => ({
            ...req,
            isActive: req.id === currentRequest.id,
            collectionId:
              currentRequest.collectionId || activeCollectionId || null,
            isSaved: !!(currentRequest.collectionId || activeCollectionId),
          })),
        );
      }
    }
  }, [currentRequest, activeCollectionId]);

  const handleCreateNewTab = () => {
    // Gerar ID único usando timestamp + random
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newRequest = {
      id: uniqueId,
      name: "New Request",
      isActive: false,
      method: "GET",
      url: "",
      headers: {},
      body: "",
      bodyType: "none",
      collectionId: null, // requests novos são isolados por padrão
      isSaved: false,
    };

    setOpenRequests((prev) => [
      ...prev.map((req) => ({ ...req, isActive: false })),
      newRequest,
    ]);

    setCurrentRequest(newRequest);

    // Adicionar à lista de requests isolados
    setIsolatedRequests((prev) => [...prev, newRequest.id]);
  };

  const handleTabClick = (requestId) => {
    const request = openRequests.find((req) => req.id === requestId);
    if (request) {
      // Cancelar edição se estiver editando outra tab
      if (editingTabId && editingTabId !== requestId) {
        setEditingTabId(null);
      }

      // Atualizar estado das tabs
      setOpenRequests((prev) =>
        prev.map((req) => ({ ...req, isActive: req.id === requestId })),
      );

      setCurrentRequest(request);
    }
  };

  const handleTabDoubleClick = (requestId) => {
    setEditingTabId(requestId);
  };

  const handleTabNameEdit = (requestId, newName) => {
    handleTabNameChange(requestId, newName);
  };

  const handleTabNameEditComplete = () => {
    setEditingTabId(null);
  };

  const handleTabNameEditKeyDown = (e, requestId) => {
    if (e.key === "Enter") {
      handleTabNameEditComplete();
    } else if (e.key === "Escape") {
      setEditingTabId(null);
    }
  };

  const handleTabClose = (requestId) => {
    const requestToClose = openRequests.find((req) => req.id === requestId);

    // Remover da lista de requests isolados se aplicável
    if (requestToClose && !requestToClose.collectionId) {
      setIsolatedRequests((prev) => prev.filter((id) => id !== requestId));
    }

    const updatedRequests = openRequests.filter((req) => req.id !== requestId);

    if (updatedRequests.length === 0) {
      const newRequest = {
        id: "new",
        name: "New Request",
        isActive: true,
        method: "GET",
        url: "",
        headers: {},
        body: "",
        bodyType: "none",
        collectionId: null,
        isSaved: false,
      };
      setOpenRequests([newRequest]);
      setCurrentRequest(newRequest);
    } else {
      const firstTab = updatedRequests[0];
      setOpenRequests(
        updatedRequests.map((req) => ({
          ...req,
          isActive: req.id === firstTab.id,
        })),
      );
      setCurrentRequest(firstTab);
    }
  };

  const handleTabNameChange = (requestId, newName) => {
    setOpenRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, name: newName } : req,
      ),
    );

    if (currentRequest && currentRequest.id === requestId) {
      setCurrentRequest((prev) => ({ ...prev, name: newName }));
    }
  };

  const handleRequestChange = (field, value) => {
    const updatedRequest = { ...currentRequest, [field]: value };
    setCurrentRequest(updatedRequest);

    setOpenRequests((prev) =>
      prev.map((req) =>
        req.id === currentRequest.id ? { ...req, [field]: value } : req,
      ),
    );

    // Só atualiza na collection se o request pertencer a uma collection
    if (
      currentRequest.id !== "new" &&
      currentRequest.collectionId &&
      onUpdateRequest
    ) {
      onUpdateRequest(currentRequest.collectionId, currentRequest.id, {
        [field]: value,
      });
    }
  };
  const methods = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"];
  const bodyTypes = [
    { value: "none", label: "None" },
    { value: "form-data", label: "Form Data" },
    { value: "x-www-form-urlencoded", label: "x-www-form-urlencoded" },
    { value: "raw", label: "Raw" },
    { value: "binary", label: "Binary" },
  ];

  const rawTypes = [
    { value: "json", label: "JSON" },
    { value: "xml", label: "XML" },
    { value: "html", label: "HTML" },
    { value: "javascript", label: "JavaScript" },
    { value: "text", label: "Text" },
  ];

  const handleRequestNameChange = (name) => {
    setCurrentRequest({ ...currentRequest, name });

    // Só atualiza na collection se o request pertencer a uma collection
    if (currentRequest.id && currentRequest.collectionId) {
      onUpdateRequest(currentRequest.collectionId, currentRequest.id, { name });
    }
  };

  const [activeRequestTab, setActiveRequestTab] = useState("headers");
  const [bodyRawType, setBodyRawType] = useState("json");
  const [isResizing, setIsResizing] = useState(false);
  const [editorHeight, setEditorHeight] = useState(200);
  const resizeRef = useRef(null);

  const handleAddHeader = () => {
    const newHeader = { key: "", value: "" };
    setCurrentRequest({
      ...currentRequest,
      headers: {
        ...currentRequest.headers,
        [`header_${Date.now()}`]: newHeader,
      },
    });
  };

  const handleHeaderChange = (headerId, field, value) => {
    const newHeaders = { ...currentRequest.headers };
    if (field === "key") {
      newHeaders[headerId] = { ...newHeaders[headerId], key: value };
    } else {
      newHeaders[headerId] = { ...newHeaders[headerId], value: value };
    }
    setCurrentRequest({ ...currentRequest, headers: newHeaders });
  };

  const handleRemoveHeader = (headerId) => {
    const newHeaders = { ...currentRequest.headers };
    delete newHeaders[headerId];
    setCurrentRequest({ ...currentRequest, headers: newHeaders });
  };

  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing && resizeRef.current) {
        const newHeight = Math.max(
          100,
          e.clientY - resizeRef.current.getBoundingClientRect().top,
        );
        console.log("Resizing to height:", newHeight);
        setEditorHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      console.log("Resize ended");
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="request-panel">
      <div className="request-tabs-container">
        {openRequests.map((request) => (
          <div
            key={request.id}
            className={`request-tab ${request.isActive ? "active" : ""} ${request.collectionId ? "in-collection" : "isolated"}`}
            onClick={() => handleTabClick(request.id)}
            title={
              request.collectionId
                ? `Request in collection`
                : `Isolated request - not saved to any collection`
            }
          >
            <span className="request-status">
              {request.collectionId ? "📁" : "📄"}
            </span>
            <input
              type="text"
              value={request.name}
              onChange={(e) => handleTabNameEdit(request.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleTabDoubleClick(request.id);
              }}
              onKeyDown={(e) => handleTabNameEditKeyDown(e, request.id)}
              onBlur={handleTabNameEditComplete}
              readOnly={editingTabId !== request.id}
              placeholder="Request name..."
              className={editingTabId === request.id ? "editing" : ""}
            />
            <button
              className="request-tab-close"
              onClick={(e) => {
                e.stopPropagation();
                handleTabClose(request.id);
              }}
              title="Close tab"
            >
              ×
            </button>
          </div>
        ))}
        <button
          className="add-tab-btn"
          onClick={handleCreateNewTab}
          title="Add new request"
        >
          +
        </button>
      </div>

      <div className="request-line">
        <select
          value={currentRequest.method}
          onChange={(e) => handleRequestChange("method", e.target.value)}
          className="method-select"
        >
          {methods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Enter request URL"
          value={currentRequest.url}
          onChange={(e) =>
            setCurrentRequest({ ...currentRequest, url: e.target.value })
          }
          className="url-input"
          ref={urlInputRef}
        />

        <button
          onClick={onSendRequest}
          disabled={loading || !currentRequest.url}
          className="send-btn"
        >
          <FaPlay /> {loading ? "Sending..." : "Send"}
        </button>
      </div>

      <div className="request-content">
        <div className="request-tabs">
          <button
            className={`tab-btn ${activeRequestTab === "headers" ? "active" : ""}`}
            onClick={() => setActiveRequestTab("headers")}
          >
            Headers
          </button>
          <button
            className={`tab-btn ${activeRequestTab === "body" ? "active" : ""}`}
            onClick={() => setActiveRequestTab("body")}
          >
            Body
          </button>
        </div>

        <div className="request-tab-content">
          {activeRequestTab === "headers" && (
            <div className="headers-section">
              <div className="headers-list">
                {Object.entries(currentRequest.headers).map(
                  ([headerId, header]) => (
                    <div key={headerId} className="header-row">
                      <input
                        type="text"
                        placeholder="Header key"
                        value={header.key}
                        onChange={(e) =>
                          handleHeaderChange(headerId, "key", e.target.value)
                        }
                        className="header-key"
                      />
                      <input
                        type="text"
                        placeholder="Header value"
                        value={header.value}
                        onChange={(e) =>
                          handleHeaderChange(headerId, "value", e.target.value)
                        }
                        className="header-value"
                      />
                      <button
                        onClick={() => handleRemoveHeader(headerId)}
                        className="remove-header-btn"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ),
                )}
              </div>
              <button onClick={handleAddHeader} className="add-header-btn">
                <FaPlus /> Add Header
              </button>
            </div>
          )}

          {activeRequestTab === "body" && (
            <div className="body-section">
              <div className="body-type-selector">
                <select
                  value={currentRequest.bodyType}
                  onChange={(e) =>
                    setCurrentRequest({
                      ...currentRequest,
                      bodyType: e.target.value,
                    })
                  }
                  className="body-type-select"
                >
                  {bodyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                {currentRequest.bodyType === "raw" && (
                  <select
                    value={bodyRawType}
                    onChange={(e) => setBodyRawType(e.target.value)}
                    className="raw-type-select"
                  >
                    {rawTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div
                className="body-content"
                ref={resizeRef}
                style={{ height: editorHeight }}
              >
                {currentRequest.bodyType === "none" && (
                  <div className="no-body">This request has no body</div>
                )}

                {currentRequest.bodyType === "raw" && (
                  <CodeEditor
                    value={currentRequest.body}
                    onChange={(value) =>
                      setCurrentRequest({ ...currentRequest, body: value })
                    }
                    language={bodyRawType}
                    height="100%"
                    theme="vs-dark"
                  />
                )}

                {currentRequest.bodyType === "form-data" && (
                  <div className="coming-soon">
                    <p>Form Data support coming soon...</p>
                  </div>
                )}

                {currentRequest.bodyType === "x-www-form-urlencoded" && (
                  <div className="coming-soon">
                    <p>x-www-form-urlencoded support coming soon...</p>
                  </div>
                )}

                {currentRequest.bodyType === "binary" && (
                  <div className="binary-upload">
                    <input
                      type="file"
                      className="file-input"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setCurrentRequest({
                            ...currentRequest,
                            body: file.name,
                            fileName: file.name,
                          });
                        }
                      }}
                    />
                    <p>Select a file to upload</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resize handle fora da condição para sempre aparecer quando body estiver ativo */}
          {activeRequestTab === "body" && (
            <div
              className="resize-handle"
              onMouseDown={handleMouseDown}
              style={{ cursor: isResizing ? "ns-resize" : "ns-resize" }}
            >
              ⋮⋮
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestPanel;
