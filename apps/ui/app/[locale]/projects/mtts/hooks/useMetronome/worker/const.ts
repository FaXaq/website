// This is a module worker, so we can use imports (in the browser too!)
export const DEFAULT_BPM = 60;

export enum IncomingMessageType {
  UPDATE_BPM = "UPDATE_BPM",
  IS_WORKING = "IS_WORKING",
}

export enum OutgoingMessageType {
  BIP = "BIP",
  BPM_UPDATE = "BPM_UPDATE",
  WORKING_UPDATE = "WORKING_UPDATE"
}

export interface IncomingMessage {
  type: IncomingMessageType,
  payload: number | boolean
}

export interface OutgoingMessage {
  type: OutgoingMessageType,
  payload: number | boolean
}