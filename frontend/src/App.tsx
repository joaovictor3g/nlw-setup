import { Habit } from "./components/Habit";

import "./styles/global.css";

export function App() {
  return (
    <div className="App">
      <Habit completed={4} />
    </div>
  );
}
