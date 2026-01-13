interface QuickRepliesProps {
  onSelect: (message: string) => void;
}

const quickReplies = [
  "Tell me pricing",
  "I want Pro plan",
  "Do you support YouTube?",
];

export function QuickReplies({ onSelect }: QuickRepliesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {quickReplies.map((reply) => (
        <button
          key={reply}
          onClick={() => onSelect(reply)}
          className="
            px-3 py-1.5 text-sm rounded-full
            bg-secondary text-secondary-foreground
            hover:bg-primary/10 hover:text-primary
            transition-colors duration-200
            border border-transparent hover:border-primary/20
          "
        >
          {reply}
        </button>
      ))}
    </div>
  );
}
