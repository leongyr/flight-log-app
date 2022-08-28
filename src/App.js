import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signin from './Signin.js';
import Register from './Register.js';
import Logs from './Logs.js';

function App() {

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="register" element={<Register />} />
          <Route path="logs" element={<Logs />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
