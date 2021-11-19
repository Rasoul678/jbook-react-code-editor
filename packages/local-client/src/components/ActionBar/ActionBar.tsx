import useActions from "../../hooks/useActions";
import "./action-bar.css";

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { deleteCell, moveCell } = useActions();

  const handleMoveUpCell = () => {
    moveCell(id, "up");
  };

  const handleMoveDownCell = () => {
    moveCell(id, "down");
  };

  const handleDeleteCell = () => {
    deleteCell(id);
  };

  return (
    <div className="action-bar">
      <button className="button is-primary is-small" onClick={handleMoveUpCell}>
        <span className="icon">
          <i className="fas fa-arrow-up"></i>
        </span>
      </button>
      <button
        className="button is-primary is-small"
        onClick={handleMoveDownCell}
      >
        <span className="icon">
          <i className="fas fa-arrow-down"></i>
        </span>
      </button>
      <button className="button is-primary is-small" onClick={handleDeleteCell}>
        <span className="icon">
          <i className="fas fa-times"></i>
        </span>
      </button>
    </div>
  );
};

export default ActionBar;
