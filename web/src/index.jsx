import 'babel-polyfill'


import React from 'react'
import ReactDOM from 'react-dom'
import './index.html'
import './public/public.scss'
import './public/init.scss'


import ReactRouter,{Router , Route , browserHistory} from 'react-router'
import Redux,{createStore,applyMiddleware,combineReducers} from 'redux'
import ReactRouterRedux, { syncHistoryWithStore } from 'react-router-redux'
import ReduxThunk from 'redux-thunk'
import ReactRedux, { Provider } from 'react-redux'

import reducers from './redux/index.jsx'
import Routes from './routes/index.jsx'

const createStoreWithMiddleware = applyMiddleware(
    ReduxThunk
)(createStore);

const store = createStoreWithMiddleware(reducers);

const history = syncHistoryWithStore(browserHistory,store);

class App extends React.Component{
    render(){
        return (
            <Provider store={store}>
                <Routes history={history}></Routes>
            </Provider>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
