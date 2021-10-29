import './App.css';
import 'antd/dist/antd.css';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { BrowserRouter as Router, Route } from "react-router-dom";
import MainScreen from './Components/MainScreen';
import PersonDetail from './Components/PersonDetail';

const client = new ApolloClient({
  uri:'http://localhost:4000/graphql',
  cache: new InMemoryCache()
})

const App = () => {

  return (
    <ApolloProvider client={client}>
      <Router>
        <Route exact path="/" >
          <MainScreen />
        </Route>
        <Route path="/people/:id" >
          <PersonDetail />
        </Route>
      </Router>

    </ApolloProvider>
  )
}

export default App;
