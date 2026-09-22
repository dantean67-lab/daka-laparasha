import MixedText from "@/components/MixedText";

// One line of the vocalized script. Always Frank Ruhl Libre (never Heebo), because of nikud.

export type ScriptBlockType = "opening" | "paragraph" | "quote" | "message" | "closing";

export default function ScriptBlock({ type, text }: { type: ScriptBlockType; text: string }) {
  const content = <MixedText>{text}</MixedText>;
  switch (type) {
    case "opening":
    case "closing":
      return <p className="script-paragraph script-bold">{content}</p>;
    case "quote":
      return (
        <blockquote className="script-quote">
          <p>{content}</p>
        </blockquote>
      );
    case "message":
      return <p className="script-paragraph script-message">{content}</p>;
    case "paragraph":
      return <p className="script-paragraph">{content}</p>;
  }
}
