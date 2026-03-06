import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import RequestPanel from "./components/RequestPanel";
import ResponsePanel from "./components/ResponsePanel";
import ResponseHistory from "./components/ResponseHistory";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import "./App.css";
import "./App-light.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const urlInputRef = useRef(null);
  const [collections, setCollections] = useState({ collections: [] });
  const [savedResponses, setSavedResponses] = useState({ saved_responses: [] });
  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const [currentRequest, setCurrentRequest] = useState({
    id: null,
    name: "New Request",
    method: "GET",
    url: "",
    headers: {},
    body: "",
    bodyType: "none",
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("request");
  const [activeResponseTab, setActiveResponseTab] = useState("current");

  useEffect(() => {
    loadCollections();
    loadSavedResponses();
  }, []);

  const loadCollections = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/collections`);
      setCollections(response.data);
    } catch (error) {
      console.error("Error loading collections:", error);
    }
  };

  const loadSavedResponses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/saved-responses`);
      setSavedResponses(response.data);
    } catch (error) {
      console.error("Error loading saved responses:", error);
    }
  };

  const saveCollections = async (newCollections) => {
    try {
      await axios.post(`${API_BASE_URL}/collections`, newCollections);
      setCollections(newCollections);
    } catch (error) {
      console.error("Error saving collections:", error);
    }
  };

  const saveSavedResponses = async (newSavedResponses) => {
    try {
      await axios.post(`${API_BASE_URL}/saved-responses`, newSavedResponses);
      setSavedResponses(newSavedResponses);
    } catch (error) {
      console.error("Error saving saved responses:", error);
    }
  };

  const deleteSavedResponse = async (responseId) => {
    try {
      await axios.delete(`${API_BASE_URL}/saved-responses/${responseId}`);
      await loadSavedResponses();
    } catch (error) {
      console.error("Error deleting saved response:", error);
    }
  };

  const sendRequest = async () => {
    setLoading(true);
    const startTime = Date.now();

    // Preparar headers garantindo Content-Type para JSON quando necessário
    let headers = { ...currentRequest.headers };
    let bodyToSend =
      currentRequest.bodyType !== "none" ? currentRequest.body : undefined;

    // Se o body type é raw e há corpo, verificar se é JSON e converter
    if (currentRequest.bodyType === "raw" && currentRequest.body) {
      try {
        // Tentar fazer parse do corpo para enviar como objeto
        const parsedBody = JSON.parse(currentRequest.body);
        bodyToSend = parsedBody;
        headers = {
          ...headers,
          "Content-Type": "application/json",
        };
        console.log("Body parsed as JSON object:", parsedBody);
      } catch (e) {
        // Se não for JSON, manter como string
        console.log("Body is not valid JSON, sending as string");
      }
    }

    // Debug log
    console.log("Sending request:", {
      method: currentRequest.method,
      url: currentRequest.url,
      headers: headers,
      body: bodyToSend,
      bodyType: currentRequest.bodyType,
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/api/request`, {
        method: currentRequest.method,
        url: currentRequest.url,
        headers: headers,
        body: bodyToSend,
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      setResponse({
        status: response.data.status,
        statusText: response.data.statusText,
        headers: response.data.headers,
        data: response.data.data,
        time: new Date().toLocaleTimeString(),
        duration: duration,
      });
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      setResponse({
        error: true,
        message: error.message,
        time: new Date().toLocaleTimeString(),
        duration: duration,
      });
    }
    setLoading(false);
    setActiveTab("response");
  };

  const saveToCollection = () => {
    if (!currentRequest.name || !currentRequest.url) {
      alert("Please provide a name and URL for request");
      return;
    }

    const newCollections = { ...collections };

    let targetCollectionId = activeCollectionId;
    if (!targetCollectionId) {
      if (newCollections.collections.length === 0) {
        newCollections.collections.push({
          id: Date.now(),
          name: "My Collection",
          requests: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        targetCollectionId = newCollections.collections[0].id;
        setActiveCollectionId(targetCollectionId);
      } else {
        targetCollectionId = newCollections.collections[0].id;
        setActiveCollectionId(targetCollectionId);
      }
    }

    const requestToSave = {
      id: currentRequest.id || Date.now(),
      name: currentRequest.name,
      method: currentRequest.method,
      url: currentRequest.url,
      headers: currentRequest.headers,
      body: currentRequest.body,
      bodyType: currentRequest.bodyType,
      created_at: currentRequest.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const collectionIndex = newCollections.collections.findIndex(
      (col) => col.id === targetCollectionId,
    );

    if (collectionIndex >= 0) {
      const existingIndex = newCollections.collections[
        collectionIndex
      ].requests.findIndex((req) => req.id === requestToSave.id);

      if (existingIndex >= 0) {
        newCollections.collections[collectionIndex].requests[existingIndex] =
          requestToSave;
      } else {
        newCollections.collections[collectionIndex].requests.push(
          requestToSave,
        );
      }

      newCollections.collections[collectionIndex].updated_at =
        new Date().toISOString();
    }

    saveCollections(newCollections);

    // Atualizar o currentRequest com o collectionId correto
    const updatedRequest = {
      ...requestToSave,
      collectionId: targetCollectionId,
    };
    setCurrentRequest(updatedRequest);

    alert("Request saved successfully!");
  };

  const createCollection = (collectionName) => {
    // Gerar ID único usando timestamp + random
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newCollection = {
      id: uniqueId,
      name: collectionName,
      requests: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newCollections = {
      ...collections,
      collections: [...collections.collections, newCollection],
    };

    saveCollections(newCollections);
    setActiveCollectionId(newCollection.id);
    return newCollection;
  };

  const updateCollection = (collectionId, updates) => {
    const newCollections = { ...collections };
    const collectionIndex = newCollections.collections.findIndex(
      (col) => col.id === collectionId,
    );

    if (collectionIndex >= 0) {
      newCollections.collections[collectionIndex] = {
        ...newCollections.collections[collectionIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      saveCollections(newCollections);
    }
  };

  const deleteCollection = (collectionId) => {
    if (window.confirm("Are you sure you want to delete this collection?")) {
      const newCollections = {
        ...collections,
        collections: collections.collections.filter(
          (col) => col.id !== collectionId,
        ),
      };
      saveCollections(newCollections);

      if (activeCollectionId === collectionId) {
        setActiveCollectionId(null);
      }
    }
  };

  const updateRequest = (collectionId, requestId, updates) => {
    const newCollections = { ...collections };
    const collectionIndex = newCollections.collections.findIndex(
      (col) => col.id === collectionId,
    );

    if (collectionIndex >= 0) {
      const requestIndex = newCollections.collections[
        collectionIndex
      ].requests.findIndex((req) => req.id === requestId);

      if (requestIndex >= 0) {
        newCollections.collections[collectionIndex].requests[requestIndex] = {
          ...newCollections.collections[collectionIndex].requests[requestIndex],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        newCollections.collections[collectionIndex].updated_at =
          new Date().toISOString();
        saveCollections(newCollections);

        if (currentRequest.id === requestId) {
          setCurrentRequest(
            newCollections.collections[collectionIndex].requests[requestIndex],
          );
        }
      }
    }
  };

  const deleteRequest = (collectionId, requestId) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      const newCollections = { ...collections };
      const collectionIndex = newCollections.collections.findIndex(
        (col) => col.id === collectionId,
      );

      if (collectionIndex >= 0) {
        newCollections.collections[collectionIndex].requests =
          newCollections.collections[collectionIndex].requests.filter(
            (req) => req.id !== requestId,
          );
        newCollections.collections[collectionIndex].updated_at =
          new Date().toISOString();
        saveCollections(newCollections);
      }
    }
  };

  const handleSaveResponse = (savedResponse) => {
    const newSavedResponse = {
      id: Date.now(),
      ...savedResponse,
      request_info: {
        method: currentRequest.method,
        url: currentRequest.url,
        headers: currentRequest.headers,
      },
    };

    const updatedSavedResponses = {
      saved_responses: [...savedResponses.saved_responses, newSavedResponse],
    };

    saveSavedResponses(updatedSavedResponses);
    alert("Response saved successfully!");
  };

  const getCurrentRequestResponses = () => {
    if (!currentRequest || !currentRequest.url || !currentRequest.method) {
      return savedResponses.saved_responses || [];
    }

    return (
      savedResponses.saved_responses?.filter(
        (response) =>
          response.request_info?.url === currentRequest.url &&
          response.request_info?.method === currentRequest.method,
      ) || []
    );
  };

  const handleLoadSavedResponse = (savedResponse) => {
    setResponse(savedResponse.response);
    setActiveTab("response");
  };

  const loadRequest = (request, collectionId) => {
    const requestWithCollection = {
      ...request,
      collectionId: collectionId || null,
    };
    setCurrentRequest(requestWithCollection);
    setActiveCollectionId(collectionId);
  };

  useKeyboardShortcuts({
    sendRequest: () => {
      if (currentRequest.url && !loading) {
        sendRequest();
      }
    },
    saveToCollection,
    saveResponse: () => {
      if (response && !response.error) {
        handleSaveResponse({
          ...response,
          savedName: `Response ${new Date().toLocaleString()}`,
        });
      }
    },
    focusUrlInput: () => {
      if (urlInputRef.current) {
        urlInputRef.current.focus();
      }
    },
    toggleTheme,
  });

  return (
    <div className="app">
      <div className="header">
        <h1>Blueprint</h1>
        <div className="header-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button onClick={saveToCollection} className="save-btn">
            💾 Save to Collection
          </button>
        </div>
      </div>

      <div className="main-container">
        <Sidebar
          collections={collections}
          onLoadRequest={loadRequest}
          activeCollectionId={activeCollectionId}
          setActiveCollectionId={setActiveCollectionId}
          onDeleteCollection={deleteCollection}
          onDeleteRequest={deleteRequest}
          onSave={saveCollections}
          onCreateCollection={createCollection}
          onUpdateCollection={updateCollection}
          onUpdateRequest={updateRequest}
          savedResponses={savedResponses}
          currentRequest={currentRequest}
        />

        <div className="content">
          <RequestPanel
            currentRequest={currentRequest}
            setCurrentRequest={setCurrentRequest}
            onSendRequest={sendRequest}
            loading={loading}
            urlInputRef={urlInputRef}
            activeCollectionId={activeCollectionId}
            onUpdateRequest={updateRequest}
            collections={collections}
          />

          <div className="response-section">
            <div className="response-tabs">
              <button
                className={`tab-btn ${activeResponseTab === "current" ? "active" : ""}`}
                onClick={() => setActiveResponseTab("current")}
              >
                Current Response
              </button>
              <button
                className={`tab-btn ${activeResponseTab === "saved" ? "active" : ""}`}
                onClick={() => setActiveResponseTab("saved")}
              >
                Saved Responses ({getCurrentRequestResponses().length})
              </button>
            </div>

            {activeResponseTab === "current" && (
              <ResponsePanel
                response={response}
                loading={loading}
                onSaveResponse={handleSaveResponse}
              />
            )}

            {activeResponseTab === "saved" && (
              <ResponseHistory
                savedResponses={savedResponses}
                onLoadSavedResponse={handleLoadSavedResponse}
                onDeleteSavedResponse={deleteSavedResponse}
                onRefresh={loadSavedResponses}
                currentRequest={currentRequest}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
