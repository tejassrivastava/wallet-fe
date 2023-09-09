
import React from 'react';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';

// import Transactions from './components/Transactions';
import "./index.css";
import { useAtom } from "jotai";
import Wallet from './components/Wallet';
import Transactions from './components/Transactions';



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" exact element={<Wallet/>} />
          <Route path="/transactions" element={<Transactions/>} />
        </Routes>
      </div>
    </Router>
  );
}



export default App;
