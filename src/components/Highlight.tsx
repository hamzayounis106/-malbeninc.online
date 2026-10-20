import { Fragment } from "react";

/**
 * Renders a heading string from the data files, where |wrapped| segments
 * get the brand gradient (e.g. "Our |Services|").
 */
const Highlight = ({ text, className = "text-gradient-primary" }: { text: string; className?: string }) => {
  const parts = text.split("|");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={className}>
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
};

export default Highlight;
