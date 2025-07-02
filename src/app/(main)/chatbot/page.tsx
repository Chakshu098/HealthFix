import { ChatbotUI } from '@/components/features/chatbot-ui';

export default function ChatbotPage() {
  return (
    <div className="h-[calc(100vh-10rem)]">
       <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">AI Health Assistant</h1>
        <p className="text-muted-foreground">Ask me anything about your health. I am here to help.</p>
      </div>
      <ChatbotUI />
    </div>
  );
}
