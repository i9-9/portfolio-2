import { cn } from "@/lib/utils";
import { glueLastWords, splitSentences } from "@/lib/typography/widows";

/**
 * Case-study h1: break by sentence, glue last words, balance lines.
 * Avoids widows of one or two words at any viewport.
 */
export function CaseStudyHeadline({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const sentences = splitSentences(text);

  return (
    <h1
      className={cn(
        "mt-6 w-full font-helveticaNowDisplayBold text-type-case-title leading-[1] tracking-[-0.02em] text-foreground",
        className,
      )}
    >
      {sentences.map((sentence, i) => (
        <span
          key={i}
          className={cn(i > 0 && "mt-[0.15em]", "block text-balance")}
        >
          {glueLastWords(sentence, 3)}
        </span>
      ))}
    </h1>
  );
}
