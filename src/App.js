import logo from './logo.svg';
import './App.css';
import LoginPage from './containers/loginPage'
import UserInfo from './containers/userInfo'
import SurveyPage from './containers/surveyPage'
import CreatePage from './containers/createPage'
import { React, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import CardsPage from './containers/cardsPage';
import SearchPage from './containers/searchPage';
import { useSurvey } from './containers/hooks/useSurvey';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home/:id" element={<CardsPage />} />
        <Route path="/search/:id" element={<SearchPage />} />
        <Route path="/profile/:id" element={<UserInfo />} />
        <Route path="/survey/:id/:id" element={<SurveyPage />} />
        <Route path="/createSurvey/:id" element={<CreatePage type='survey' />} />
      </Routes>
    </Router>
  );
}

export default App;