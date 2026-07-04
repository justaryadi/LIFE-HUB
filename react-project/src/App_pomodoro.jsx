import './App.css';
import { useState } from 'react';
import Navbar from './components/Navigation_pomodoro';
import Header from './components/Header_pomodoro';
import CardGrid from './components/CardGrid_pomodoro';
import { featureData } from './data/feature_pomodoro';

const App = () => {
  const [features, setFeatures] = useState(featureData);

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <Header />
        <CardGrid features={features} />
      </main>
    </>
  )  
}

export default App;