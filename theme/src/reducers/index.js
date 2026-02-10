import { combineReducers } from 'redux'

import audioPlayerReducer from './audioPlayer'

export default combineReducers({
  audioPlayer: audioPlayerReducer
})
