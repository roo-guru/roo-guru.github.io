import React from 'react';
import './App.css';
import { useFestivalData } from './fetch';
import { Schedule } from './Schedule';
import { Spinner } from './Spinner';

function App() {
  const festivalData = useFestivalData();

  const content = (() => {
    if (!festivalData) {
      return <Spinner />;
    }
    return <Schedule festivalData={festivalData} />;
  })();

  return (
    <div className="App">
      <>
        <h1>Roo Guru</h1>
        {content}
      </>
    </div>
  );
}

export default App;
