import { Provider } from "react-redux";
import { store } from "./state";
import CellList from "./components/CellList/CellList";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div>
        <CellList />
      </div>
    </Provider>
  );
};

export default App;
