import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CitiesTable from './components/CitiesTable';  // Default export
import WeatherPage from './components/WeatherPage';  // Default export
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CitiesTable />} />
        <Route path="/weather/:cityName" element={<WeatherPage />} />
      </Routes>
    </Router>
  );
}

export default App;









