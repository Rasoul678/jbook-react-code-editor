import { useEffect } from "react";
import CodeEditor from "../CodeEditor/CodeEditor";
import Preview from "../Preview/Preview";
import Resizable from "../resizable/resizable";
import { Cell } from "../../state";
import useActions from "../../hooks/useActions";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useCumulativeCode } from "../../hooks/useCumulativeCode";
import "./code-cell.css";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles?.[cell.id]);
  const cumulativeCode = useCumulativeCode(cell.id);

  const handleChangeCodeEditor = (value: string) => {
    updateCell(cell.id, value);
  };

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumulativeCode);
      return;
    }

    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode);
    }, 750);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode, cell.id, createBundle]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "calc(100% - 10px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            theme="dark"
            language="javascript"
            dimension={{ height: "100%", width: "100%" }}
            onChange={handleChangeCodeEditor}
          />
        </Resizable>
        <div className="progress-wrapper">
          {bundle?.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle?.code} err={bundle?.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
