import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ApolloClient, InMemoryCache, ApolloProvider,
  split, HttpLink
} from '@apollo/client';
import { getMainDefinition } from
  '@apollo/client/utilities';
import { GraphQLWsLink } from
  '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SurveyProvider } from './containers/hooks/useSurvey';

const httpLink = new HttpLink({
  uri: 'https://gosurveyserver-production.up.railway.app/'
});
const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://gosurveyserver-production.up.railway.app/',
  options: {
    lazy: true,
  },
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);
const client = new ApolloClient({
  link: "https://gosurveyserver-production.up.railway.app/graphql",
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <SurveyProvider><App /></SurveyProvider>
    </ApolloProvider>
  </React.StrictMode>
);

reportWebVitals();
