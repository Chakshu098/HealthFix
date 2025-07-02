export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: React.ReactNode;
}

export interface Report {
  id: string;
  date: string;
  type: 'Symptom' | 'Image';
  diagnosis: {
    condition: string;
    remedy: string;
    riskLevel: 'Low' | 'Medium' | 'High';
  };
  userInput: string;
}
