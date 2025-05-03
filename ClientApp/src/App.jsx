import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import About from './About';
import './App.css'; // Keep or modify default styling

function App() {
  return (
    <HashRouter> {/* Use HashRouter */}
      <div>
        <h1>React App Running Inside MVC</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              {/* Regular anchor tag to navigate to MVC view */}
              <a href="/Home/Privacy">MVC Privacy Page</a>
            </li>
          </ul>
        </nav>

        <hr />

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;