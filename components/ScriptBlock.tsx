// One line of the vocalized script. Always Frank Ruhl Libre (never Heebo), because of nikud.

export type ScriptBlockType = "opening" | "paragraph" | "quote" | "message" | "closing";

export default function ScriptBlock({ type, text }: { type: ScriptBlockType; text: string }) {
  switch (type) {
    case "opening":
    case "closing":
      return <p className="script-paragraph script-bold">{text}</p>;
    case "quote":
      return (
        <blockquote className="script-quote">
          <p>{text}</p>
        </blockquote>
      );
    case "message":
      return <p className="script-paragraph script-message">{text}</p>;
    case "paragraph":
      return <p className="script-paragraph">{text}</p>;
  }
}
