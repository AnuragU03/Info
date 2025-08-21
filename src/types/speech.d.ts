// Lightweight declarations for browser SpeechRecognition and webkitSpeechRecognition
interface Window {
  webkitSpeechRecognition?: any;
}

declare global {
  type SpeechRecognition = any;
}

export {};
