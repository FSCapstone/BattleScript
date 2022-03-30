import React, { useContext, createContext } from 'react';
import * as Colyseus from 'colyseus.js';

let client = new Colyseus.Client('ws://localhost:8080');
// let client = new Colyseus.Client('ws://capstone-battlescript.herokuapp.com/');
export const ColyseusContext = createContext(client);

export function useColyseus() {
  return useContext(ColyseusContext);
}

export default function ColyseusProvider(props) {
  return <ColyseusContext.Provider value={client}>{props.children}</ColyseusContext.Provider>;
}
