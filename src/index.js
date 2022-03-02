import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthContextProvider } from './reducer/Authreducer'


ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// node -e 'console.log(v8.getHeapStatistics().heap_size_limit/(1024*1024))'
// export NODE_OPTIONS="--max-old-space-size=8192"
