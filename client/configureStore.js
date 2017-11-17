import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import rootReducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

export default (initialState) => {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(logger, sagaMiddleware),
  );

  sagaMiddleware.run(rootSaga);

  return store;
};
