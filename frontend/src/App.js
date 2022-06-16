import './css/App.css';

import {
  useRoutes
} from 'react-router-dom';

import {routes} from './routes/routes';


function App() {
  let element = useRoutes(routes);
  return element;
}


export default App;
