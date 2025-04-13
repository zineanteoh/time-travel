import type { ChangeEvent } from "react";

interface EditorProps {
  content: string;
  setContent: (content: string) => void;
}

export default function Editor({ content, setContent }: EditorProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  return (
    <textarea
      value={content}
      onChange={handleChange}
      className="w-full h-64 p-2 border rounded"
      placeholder="Start typing..."
    />
  );
}
