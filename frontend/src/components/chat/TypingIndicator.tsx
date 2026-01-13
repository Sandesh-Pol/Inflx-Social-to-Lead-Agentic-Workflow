export function TypingIndicator() {
  return (
    <div className="flex flex-col gap-1 items-start message-enter">
      <span className="text-xs text-muted-foreground ml-1">
        AutoStream Assistant
      </span>
      <div className="bg-message-ai px-4 py-3 rounded-2xl rounded-tl-md shadow-message">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground mr-1">Thinking</span>
          <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full typing-dot" />
          <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full typing-dot" />
          <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full typing-dot" />
        </div>
      </div>
    </div>
  );
}
