import React, { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import "./CodeEditor.css";

const CodeEditor = ({
  value,
  onChange,
  language = "json",
  height = "300px",
  readOnly = false,
  placeholder = "",
  theme = "vs-dark",
}) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: "on",
      wordWrap: "on",
      automaticLayout: true,
      formatOnPaste: true,
      formatOnType: true,
      tabSize: 2,
      insertSpaces: true,
    });

    if (placeholder && !value) {
      editor.setValue("");
      const placeholderDecoration = editor.createDecorationsCollection([
        {
          range: new monaco.Range(1, 1, 1, 1),
          options: {
            className: "editor-placeholder",
            isWholeLine: true,
          },
        },
      ]);

      editor.onDidChangeModelContent(() => {
        if (editor.getValue()) {
          placeholderDecoration.clear();
        } else {
          placeholderDecoration.set([
            {
              range: new monaco.Range(1, 1, 1, 1),
              options: {
                className: "editor-placeholder",
                isWholeLine: true,
              },
            },
          ]);
        }
      });
    }

    if (!readOnly) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        editor.getAction("editor.action.formatDocument").run();
      });
    }
  };

  const handleEditorChange = (value) => {
    if (onChange && !readOnly) {
      onChange(value);
    }
  };

  const detectLanguage = (content) => {
    if (language !== "auto") return language;

    if (!content) return "plaintext";

    if (content.trim().startsWith("{") || content.trim().startsWith("[")) {
      return "json";
    }
    if (content.trim().startsWith("<")) {
      return "xml";
    }
    if (
      content.includes("function") ||
      content.includes("const") ||
      content.includes("let")
    ) {
      return "javascript";
    }
    if (content.includes("Content-Type:")) {
      return "http";
    }

    return "plaintext";
  };

  const formatDocument = () => {
    if (editorRef.current && !readOnly) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  };

  const copyToClipboard = () => {
    if (editorRef.current) {
      navigator.clipboard.writeText(editorRef.current.getValue());
    }
  };

  return (
    <div className="code-editor-container">
      <div className="editor-toolbar">
        <div className="editor-info">
          <span className="language-badge">{detectLanguage(value)}</span>
          {value && (
            <span className="line-count">{value.split("\n").length} lines</span>
          )}
        </div>
        <div className="editor-actions">
          {!readOnly && (
            <button
              onClick={formatDocument}
              className="editor-btn"
              title="Format Document (Ctrl+S)"
            >
              🎨 Format
            </button>
          )}
          <button
            onClick={copyToClipboard}
            className="editor-btn"
            title="Copy to Clipboard"
          >
            📋 Copy
          </button>
        </div>
      </div>

      <Editor
        height={height}
        language={detectLanguage(value)}
        value={value || ""}
        theme={theme}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: "on",
          wordWrap: "on",
          automaticLayout: true,
          formatOnPaste: true,
          formatOnType: true,
          tabSize: 2,
          insertSpaces: true,
          renderWhitespace: "selection",
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
        }}
        loading={
          <div className="editor-loading">
            <div className="spinner"></div>
            <p>Loading editor...</p>
          </div>
        }
      />

      {placeholder && !value && (
        <div className="editor-placeholder-text">{placeholder}</div>
      )}
    </div>
  );
};

export default CodeEditor;
