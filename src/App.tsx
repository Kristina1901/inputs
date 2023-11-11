import React from "react";
import "./App.css";
import CardList from "./components/CardList";
import CardAdd from "./components/CardAdd";

function App() {
  return (
    <div className="App">
      <CardAdd></CardAdd>
      <CardList></CardList>
    </div>
  );
}

export default App;
