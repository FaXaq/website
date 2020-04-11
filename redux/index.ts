import { createStore, combineReducers } from 'redux'
import tempoReducer from './tempo/reducers'
import { devToolsEnhancer } from 'redux-devtools-extension'
// eslint-disable-next-line no-unused-vars
import { useSelector, TypedUseSelectorHook } from 'react-redux'

const rootReducer = combineReducers({
  tempo: tempoReducer
})

export type RootState = ReturnType<typeof rootReducer>

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

const store = createStore(rootReducer, devToolsEnhancer({}))

export default store
