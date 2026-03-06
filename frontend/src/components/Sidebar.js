import React, { useState } from "react";
import {
  FaFolder,
  FaFolderOpen,
  FaChevronRight,
  FaChevronDown,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaDownload,
  FaUpload,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({
  collections,
  onLoadRequest,
  activeCollectionId,
  setActiveCollectionId,
  onDeleteCollection,
  onDeleteRequest,
  onSave,
  onCreateCollection,
  onUpdateCollection,
  onUpdateRequest,
  savedResponses,
  currentRequest,
}) => {
  const [expandedCollections, setExpandedCollections] = useState({});
  const [contextMenu, setContextMenu] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);
  const [editingCollectionName, setEditingCollectionName] = useState("");

  const toggleCollection = (collectionId) => {
    setExpandedCollections((prev) => ({
      ...prev,
      [collectionId]: !prev[collectionId],
    }));
  };

  const handleCollectionClick = (collectionId) => {
    setActiveCollectionId(collectionId);
    if (!expandedCollections[collectionId]) {
      toggleCollection(collectionId);
    }
  };

  const showContextMenu = (event, type, data) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      type,
      data,
    });
  };

  const hideContextMenu = () => {
    setContextMenu(null);
  };

  const startEditingCollection = (collection) => {
    setEditingCollection(collection.id);
    setEditingCollectionName(collection.name);
    hideContextMenu();
  };

  const saveCollectionName = () => {
    if (editingCollection && editingCollectionName.trim()) {
      const event = new CustomEvent("updateCollection", {
        detail: {
          id: editingCollection,
          name: editingCollectionName.trim(),
        },
      });
      window.dispatchEvent(event);
    }
    setEditingCollection(null);
    setEditingCollectionName("");
  };

  const cancelEditing = () => {
    setEditingCollection(null);
    setEditingCollectionName("");
  };

  const exportCollections = () => {
    const dataStr = JSON.stringify(collections, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `api-collections-${Date.now()}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const exportToPostman = () => {
    const postmanCollection = {
      info: {
        name: "Blueprint Export",
        description: "Collection exported from Blueprint API Client",
        version: {
          major: 1,
          minor: 0,
          patch: 0,
        },
        schema:
          "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      },
      item: collections.collections.map((collection) => ({
        name: collection.name,
        description:
          collection.description ||
          `Collection with ${collection.requests?.length || 0} requests`,
        item:
          collection.requests?.map((request) => {
            const postmanRequest = {
              name: request.name,
              request: {
                method: request.method,
                header: Object.entries(request.headers || {}).map(
                  ([key, value]) => ({
                    key,
                    value,
                    disabled: false,
                  }),
                ),
                url: {
                  raw: request.url,
                  protocol: request.url?.split("://")[0] || "https",
                  host: [request.url?.split("://")[1]?.split("/")[0] || ""],
                  path: request.url?.split("://")[1]?.split("/").slice(1) || [],
                },
              },
            };

            if (request.body && request.bodyType !== "none") {
              if (request.bodyType === "raw") {
                postmanRequest.request.body = {
                  mode: "raw",
                  raw: request.body,
                  options: {
                    raw: {
                      language: "json",
                    },
                  },
                };
              } else if (request.bodyType === "formdata") {
                try {
                  const formData = JSON.parse(request.body);
                  postmanRequest.request.body = {
                    mode: "formdata",
                    formdata: formData.map((item) => ({
                      key: item.key,
                      value: item.value,
                      type: "text",
                      disabled: false,
                    })),
                  };
                } catch (e) {
                  postmanRequest.request.body = {
                    mode: "raw",
                    raw: request.body,
                  };
                }
              } else if (request.bodyType === "urlencoded") {
                try {
                  const urlEncoded = JSON.parse(request.body);
                  postmanRequest.request.body = {
                    mode: "urlencoded",
                    urlencoded: urlEncoded.map((item) => ({
                      key: item.key,
                      value: item.value,
                      disabled: false,
                    })),
                  };
                } catch (e) {
                  postmanRequest.request.body = {
                    mode: "raw",
                    raw: request.body,
                  };
                }
              }
            }

            return postmanRequest;
          }) || [],
      })),
    };

    const dataStr = JSON.stringify(postmanCollection, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `blueprint-collection-${Date.now()}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const exportCollectionToPostman = (collection) => {
    const collectionSavedResponses =
      savedResponses?.saved_responses?.filter((savedResponse) => {
        return collection.requests?.some(
          (request) =>
            request.url === savedResponse.request_info?.url &&
            request.method === savedResponse.request_info?.method,
        );
      }) || [];

    console.log("Exporting collection:", collection.name);
    console.log("Found saved responses:", collectionSavedResponses.length);

    const postmanCollection = {
      info: {
        name: collection.name,
        description:
          collection.description ||
          `Collection with ${collection.requests?.length || 0} requests`,
        version: {
          major: 1,
          minor: 0,
          patch: 0,
        },
        schema:
          "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      },
      item:
        collection.requests?.map((request) => {
          const postmanRequest = {
            name: request.name,
            request: {
              method: request.method,
              header: Object.entries(request.headers || {}).map(
                ([key, value]) => ({
                  key,
                  value,
                  disabled: false,
                }),
              ),
              url: {
                raw: request.url,
                protocol: request.url?.split("://")[0] || "https",
                host: [request.url?.split("://")[1]?.split("/")[0] || ""],
                path: request.url?.split("://")[1]?.split("/").slice(1) || [],
              },
            },
          };

          if (request.body && request.bodyType !== "none") {
            if (request.bodyType === "raw") {
              postmanRequest.request.body = {
                mode: "raw",
                raw: request.body,
                options: {
                  raw: {
                    language: "json",
                  },
                },
              };
            } else if (request.bodyType === "formdata") {
              try {
                const formData = JSON.parse(request.body);
                postmanRequest.request.body = {
                  mode: "formdata",
                  formdata: formData.map((item) => ({
                    key: item.key,
                    value: item.value,
                    type: "text",
                    disabled: false,
                  })),
                };
              } catch (e) {
                postmanRequest.request.body = {
                  mode: "raw",
                  raw: request.body,
                };
              }
            } else if (request.bodyType === "urlencoded") {
              try {
                const urlEncoded = JSON.parse(request.body);
                postmanRequest.request.body = {
                  mode: "urlencoded",
                  urlencoded: urlEncoded.map((item) => ({
                    key: item.key,
                    value: item.value,
                    disabled: false,
                  })),
                };
              } catch (e) {
                postmanRequest.request.body = {
                  mode: "raw",
                  raw: request.body,
                };
              }
            }
          }

          const requestSavedResponses = collectionSavedResponses.filter(
            (savedResponse) =>
              request.url === savedResponse.request_info?.url &&
              request.method === savedResponse.request_info?.method,
          );

          console.log(
            `Request ${request.name} has ${requestSavedResponses.length} saved responses`,
          );

          if (requestSavedResponses.length > 0) {
            postmanRequest.response = requestSavedResponses.map(
              (savedResponse) => {
                let responseData;
                if (savedResponse.response?.data) {
                  responseData = savedResponse.response.data;
                } else if (savedResponse.data) {
                  responseData = savedResponse.data;
                } else {
                  responseData = "";
                }

                const formattedBody =
                  typeof responseData === "object"
                    ? JSON.stringify(responseData, null, 2)
                    : responseData;

                return {
                  name:
                    savedResponse.savedName ||
                    `Response ${savedResponse.savedAt}`,
                  originalRequest: {
                    method:
                      savedResponse.request_info?.method || request.method,
                    header: Object.entries(
                      savedResponse.request_info?.headers || {},
                    ).map(([key, value]) => ({
                      key,
                      value,
                      disabled: false,
                    })),
                    url: {
                      raw: savedResponse.request_info?.url || request.url,
                      protocol:
                        (savedResponse.request_info?.url || request.url)?.split(
                          "://",
                        )[0] || "https",
                      host:
                        (savedResponse.request_info?.url || request.url)
                          ?.split("://")[1]
                          ?.split("/") || [],
                      path:
                        (savedResponse.request_info?.url || request.url)
                          ?.split("://")[1]
                          ?.split("/")
                          .slice(1) || [],
                    },
                    body: savedResponse.request_info?.body
                      ? {
                          mode: "raw",
                          raw: savedResponse.request_info.body,
                        }
                      : undefined,
                  },
                  status: savedResponse.response?.statusText || "OK",
                  code: savedResponse.response?.status || 200,
                  header: Object.entries(
                    savedResponse.response?.headers || {},
                  ).map(([key, value]) => ({
                    key,
                    value,
                    disabled: false,
                  })),
                  body: formattedBody,
                  cookie: [],
                };
              },
            );
          }

          return postmanRequest;
        }) || [],
    };

    console.log(
      "Final Postman collection JSON:",
      JSON.stringify(postmanCollection, null, 2),
    );

    const dataStr = JSON.stringify(postmanCollection, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${collection.name.replace(/[^a-zA-Z0-9]/g, "_")}-${Date.now()}.postman_collection.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importCollections = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          onSave(imported);
        } catch (error) {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  const createNewRequest = (collectionId) => {
    // Gerar ID único usando timestamp + random
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newRequest = {
      id: uniqueId,
      name: "New Request",
      method: "GET",
      url: "",
      headers: {},
      body: "",
      bodyType: "none",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newCollections = { ...collections };
    const collectionIndex = newCollections.collections.findIndex(
      (col) => col.id === collectionId,
    );

    if (collectionIndex >= 0) {
      newCollections.collections[collectionIndex].requests.push(newRequest);
      newCollections.collections[collectionIndex].updated_at =
        new Date().toISOString();
      onSave(newCollections);

      onLoadRequest(newRequest);
    }
  };

  React.useEffect(() => {
    const handleUpdateCollection = (event) => {};

    window.addEventListener("updateCollection", handleUpdateCollection);
    return () =>
      window.removeEventListener("updateCollection", handleUpdateCollection);
  }, []);

  React.useEffect(() => {
    const handleClick = () => hideContextMenu();
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Collections</h3>
        <div className="sidebar-actions">
          <button
            onClick={() => {
              const name = prompt("Enter collection name:");
              if (name) {
                onCreateCollection(name);
              }
            }}
            className="add-collection-btn"
            title="New Collection"
          >
            <FaPlus />
          </button>
          <div className="collection-menu">
            <button className="menu-btn" title="Collection Menu">
              <FaEllipsisV />
            </button>
            <div className="menu-dropdown">
              <button onClick={exportCollections} className="menu-item">
                <FaDownload /> Export (JSON)
              </button>
              <label className="menu-item">
                <FaUpload /> Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importCollections}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="collections-list">
        {collections.collections.length === 0 ? (
          <div className="empty-collections">
            <p>No collections yet</p>
            <button
              onClick={() => {
                const name = prompt("Enter collection name:");
                if (name) {
                  onCreateCollection(name);
                }
              }}
              className="create-first-collection"
            >
              Create your first collection
            </button>
          </div>
        ) : (
          collections.collections.map((collection) => (
            <div
              key={collection.id}
              className={`collection-item ${
                activeCollectionId === collection.id ? "active" : ""
              }`}
            >
              <div
                className="collection-header"
                onClick={() => {
                  setActiveCollectionId(collection.id);
                  toggleCollection(collection.id);
                }}
              >
                <span className="expand-icon">
                  {expandedCollections[collection.id] ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                </span>
                {editingCollection === collection.id ? (
                  <input
                    type="text"
                    value={editingCollectionName}
                    onChange={(e) => setEditingCollectionName(e.target.value)}
                    onBlur={saveCollectionName}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveCollectionName();
                      if (e.key === "Escape") cancelEditing();
                    }}
                    className="collection-name-input"
                    autoFocus
                  />
                ) : (
                  <span className="collection-name">{collection.name}</span>
                )}
                <span className="request-count">
                  {collection.requests?.length || 0}
                </span>
                <button
                  className="collection-menu-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    showContextMenu(e, "collection", collection);
                  }}
                >
                  <FaEllipsisV />
                </button>
              </div>

              {expandedCollections[collection.id] && (
                <div className="requests-list">
                  {collection.requests?.length === 0 ? (
                    <div className="empty-requests">
                      <p>No requests in this collection</p>
                      <button
                        onClick={() => createNewRequest(collection.id)}
                        className="add-request-btn"
                      >
                        <FaPlus /> Add Request
                      </button>
                    </div>
                  ) : (
                    <>
                      {collection.requests.map((request) => {
                        const isActiveRequest =
                          currentRequest &&
                          currentRequest.id === request.id &&
                          currentRequest.method === request.method &&
                          currentRequest.url === request.url;

                        return (
                          <div
                            key={request.id}
                            className={`request-item ${isActiveRequest ? "active" : ""}`}
                            onClick={() =>
                              onLoadRequest(request, collection.id)
                            }
                          >
                            <span
                              className={`method-badge ${request.method.toLowerCase()}`}
                            >
                              {request.method}
                            </span>
                            <span className="request-name">{request.name}</span>
                            <button
                              className="delete-request-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteRequest(collection.id, request.id);
                              }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        );
                      })}
                      <button
                        onClick={() => createNewRequest(collection.id)}
                        className="add-request-btn"
                      >
                        <FaPlus /> Add Request
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {contextMenu && (
        <div
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {contextMenu.type === "collection" && (
            <>
              <button
                onClick={() => {
                  startEditingCollection(contextMenu.data);
                }}
                className="context-menu-item"
              >
                <FaEdit /> Rename
              </button>
              <button
                onClick={() => {
                  exportCollectionToPostman(contextMenu.data);
                  hideContextMenu();
                }}
                className="context-menu-item"
              >
                <FaDownload /> Export (Postman Format)
              </button>
              <button
                onClick={() => {
                  onDeleteCollection(contextMenu.data.id);
                }}
                className="context-menu-item danger"
              >
                <FaTrash /> Delete
              </button>
            </>
          )}
          {contextMenu.type === "request" && (
            <button
              onClick={() => {
                onDeleteRequest(
                  contextMenu.data.collectionId,
                  contextMenu.data.id,
                );
              }}
              className="context-menu-item danger"
            >
              <FaTrash /> Delete Request
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
