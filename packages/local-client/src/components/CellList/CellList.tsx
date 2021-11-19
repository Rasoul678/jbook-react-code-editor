import { Fragment, useEffect } from "react";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import CellListItem from "../CellListItem/CellListItem";
import AddCell from "../AddCell/AddCell";
import useActions from "../../hooks/useActions";
import "./cell-list.css";

interface CellListProps {}

const CellList: React.FC<CellListProps> = () => {
  const cells = useTypedSelector(({ cells }) =>
    cells?.order.map((id) => cells.data[id])
  );

  const { fetchCells } = useActions();

  useEffect(() => {
    fetchCells();
  }, [fetchCells]);

  const renderedCells = cells?.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell previousCellId={cell.id} />
    </Fragment>
  ));

  return (
    <div className="cell-list">
      <AddCell forceVisible={cells?.length === 0} previousCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
