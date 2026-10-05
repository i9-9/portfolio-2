import { cn } from "@/lib/utils";
import { glueLastWordsFit, splitSentences } from "@/lib/typography/widows";

/**
 * Case-study h1: break by sentence, glue short trailing words, balance lines.
 * Binding is capped by length so long bound chunks never overflow narrow viewports.
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
          {glueLastWordsFit(sentence, 3)}
        </span>
      ))}
    </h1>
  );
}
