import { useEffect } from 'react';
import Map from './Map';

const App = () => {

  useEffect(()=>{
    fetch("/test")
      .then(res => res.json())
      .then(data=> console.log(data))
  },[])

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Map />
    </div>
  );
}

export default App;