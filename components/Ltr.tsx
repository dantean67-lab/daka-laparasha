// Wrap numbers and Latin text that sit inside a Hebrew sentence, so they do not get reordered.
export default function Ltr({ children }: { children: React.ReactNode }) {
  return (
    <span dir="ltr" className="inline-block">
      {children}
    </span>
  );
}
