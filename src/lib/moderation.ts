import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
  DataSet,
  pattern,
  PhraseBuilder,
} from "obscenity";

// Extend the default English dataset with additional harmful patterns
const customDataset = new DataSet<{ originalWord: string }>()
  .addAll(englishDataset);

// Add additional harmful words/patterns
const additionalPatterns = [
  "kill yourself",
  "kys",
  "unalive",
  "go die",
  "k1ll",
  "r4pe",
  "rap3",
];

additionalPatterns.forEach((word) => {
  const builder = new PhraseBuilder();
  builder.setMetadata({ originalWord: word });
  // Use literal pattern for multi-word phrases
  word.split("").forEach((char) => {
    builder.addPattern(pattern`${char}`);
  });
  // Just add the word as a simple phrase
  customDataset.addPhrase((phrase) =>
    phrase
      .setMetadata({ originalWord: word })
      .addPattern(pattern`|${word}|`)
  );
});

const matcher = new RegExpMatcher({
  ...customDataset.build(),
  ...englishRecommendedTransformers,
});

export interface ModerationResult {
  safe: boolean;
  reason?: string;
  flaggedTerms?: string[];
  suggestedStatus: "pending" | "rejected";
}

/**
 * Check confession text for harmful content
 * Returns moderation result with safety determination
 */
export function moderateConfession(text: string): ModerationResult {
  const matches = matcher.getAllMatches(text, true);

  if (matches.length > 0) {
    const flaggedTerms = matches
      .map((match) => {
        const term = text.substring(match.startIndex, match.endIndex + 1);
        return term;
      })
      .filter((term, index, self) => self.indexOf(term) === index);

    return {
      safe: false,
      reason: `Content flagged for potentially harmful language`,
      flaggedTerms,
      suggestedStatus: "rejected",
    };
  }

  // Check for spam patterns
  const spamPatterns = [
    /(.)\1{10,}/i, // Repeated characters (10+)
    /(https?:\/\/\S+\s*){3,}/i, // Multiple URLs
    /(.{10,})\1{2,}/i, // Repeated long phrases
  ];

  for (const spamPattern of spamPatterns) {
    if (spamPattern.test(text)) {
      return {
        safe: false,
        reason: "Content flagged as potential spam",
        suggestedStatus: "rejected",
      };
    }
  }

  // Content passes automated checks → still goes to pending for human review
  return {
    safe: true,
    suggestedStatus: "pending",
  };
}

/**
 * Check for duplicate/near-duplicate confessions
 */
export function normalizeForDuplicateCheck(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
