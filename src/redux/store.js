import { createStore, combineReducers } from 'redux';
import placeReducer from './reducers/placeReducer';
import userReducer from './reducers/user-reducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({
  places: placeReducer,
  user: userReducer
});

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export var store = createStore(persistedReducer), persistor = persistStore(store)
