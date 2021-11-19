import { useRef } from "react";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import "./code-editor.css";
import "./jsx-syntax.css";
import codeShift from "jscodeshift";
import Highlighter from "monaco-jsx-highlighter";

//! default themes
type Theme = "dark" | "light";

interface EditorDimension {
  width?: string;
  height?: string;
}

interface CodeEditorProps {
  initialValue: string;
  theme?: Theme;
  language?: string;
  dimension?: EditorDimension;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = (props) => {
  const { initialValue, theme, language, dimension, onChange } = props;

  const monacoEditorRef = useRef<any>();

  const handleEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    monacoEditorRef.current = monacoEditor;

    //! Fire callback on editor value change.
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });

    //! Change tab size inside editor.
    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

    //! Configs for JSX highlighter.
    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      monacoEditor
    );

    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
  };

  //! Format codes inside monaco editor on click.
  const handleFormat = () => {
    //! Get current value from editor.
    const unformatted = monacoEditorRef.current.getModel().getValue();

    //! Format the editor current value.
    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
        jsxSingleQuote: false,
        bracketSpacing: true,
      })
      .replace(/\n$/, "");

    //! Set the formatted value back in the editor.
    monacoEditorRef.current.setValue(formatted);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={handleFormat}
      >
        Format
      </button>
      <MonacoEditor
        value={initialValue}
        height={dimension?.height}
        width={dimension?.width}
        theme={theme}
        language={language}
        options={{
          minimap: { enabled: false },
          wordWrap: "on",
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 2,
          fontSize: 18,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        editorDidMount={handleEditorDidMount}
      />
    </div>
  );
};

export default CodeEditor;
