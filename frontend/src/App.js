import React from "react";
import { DataProvider } from "./context/DataContext";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <DataProvider>
      <MainPage />
    </DataProvider>
  );
}

export default App;
