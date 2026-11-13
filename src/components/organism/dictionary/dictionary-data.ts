const API = "https://dict.minhqnd.com/api/v1";

export interface DictionaryMeaning {
  definition: string;
  definition_lang?: string;
  example?: string;
  pos?: string;
  source?: string;
}

export interface DictionaryResult {
  lang_code: string;
  lang_name: string;
  audio?: string;
  meanings: DictionaryMeaning[];
  pronunciations?: { ipa: string; region?: string }[];
  translations?: { lang_code: string; translation: string; lang_name?: string }[];
  relations?: { related_word: string; relation_type: string }[];
}

export interface DictionaryEntry {
  exists: boolean;
  word: string;
  results: DictionaryResult[];
}

export interface DictionarySuggestion {
  word: string;
  [key: string]: unknown;
}

const hasVietnameseDiacritics = (value: string) => /[ăâđêôơưàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/i.test(value);
const isEnglishWord = (value: string) => /^[a-z][a-z' -]*$/i.test(value);

async function isEnglishDictionaryWord(word: string, signal?: AbortSignal): Promise<boolean> {
  try {
    const url = new URL(`${API}/lookup`);
    url.searchParams.set("word", word);
    url.searchParams.set("lang", "en");
    url.searchParams.set("def_lang", "vi");
    const response = await fetch(url, { signal });
    if (!response.ok) return false;

    const entry = await response.json() as DictionaryEntry;
    return entry.exists &&
      entry.word.toLocaleLowerCase() === word.toLocaleLowerCase() &&
      entry.results.some((result) => result.lang_code === "en");
  } catch (error) {
    if (signal?.aborted) throw error;
    return false;
  }
}

async function keepEnglishDictionaryWords(
  suggestions: DictionarySuggestion[],
  signal?: AbortSignal,
): Promise<DictionarySuggestion[]> {
  const checked = await Promise.all(suggestions.map(async (suggestion) =>
    isEnglishWord(suggestion.word) && await isEnglishDictionaryWord(suggestion.word, signal)
      ? suggestion
      : null,
  ));
  return checked.filter((suggestion): suggestion is DictionarySuggestion => suggestion !== null);
}

export async function suggestWords(query: string, signal?: AbortSignal): Promise<DictionarySuggestion[]> {
  const translatedSuggestion = async (): Promise<DictionarySuggestion[]> => {
    try {
      const entry = await lookupWord(query, signal);
      const translated = entry.exists && entry.word.toLocaleLowerCase() !== query.toLocaleLowerCase()
        ? [{ word: entry.word }]
        : [];
      return keepEnglishDictionaryWords(translated, signal);
    } catch (error) {
      if (signal?.aborted) throw error;
      return [];
    }
  };
  if (hasVietnameseDiacritics(query)) return translatedSuggestion();
  const url = new URL(`${API}/suggest`);
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "10");
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("Could not load word suggestions.");
  const payload: unknown = await response.json();
  const normalize = (items: unknown[]): DictionarySuggestion[] => items.flatMap((item) => {
    if (typeof item === "string") return [{ word: item }];
    if (!item || typeof item !== "object") return [];
    const data = item as Record<string, unknown>;
    const word = data.word ?? data.value ?? data.text ?? data.suggestion;
    return typeof word === "string" ? [{ ...data, word }] : [];
  });
  let suggestions: DictionarySuggestion[] = [];
  if (Array.isArray(payload)) suggestions = normalize(payload).filter((item) => isEnglishWord(item.word));
  if (payload && typeof payload === "object") {
    const data = payload as { suggestions?: unknown; results?: unknown; words?: unknown; data?: unknown };
    const list = data.suggestions ?? data.results ?? data.words ?? data.data;
    if (Array.isArray(list)) suggestions = normalize(list).filter((item) => isEnglishWord(item.word));
  }
  return suggestions.length
    ? keepEnglishDictionaryWords(suggestions, signal)
    : translatedSuggestion();
}

export async function lookupWord(word: string, signal?: AbortSignal): Promise<DictionaryEntry> {
  const lookup = async (term: string, source: "en" | "vi", target: "en" | "vi") => {
    const url = new URL(`${API}/lookup`);
    url.searchParams.set("word", term);
    url.searchParams.set("lang", source);
    url.searchParams.set("def_lang", target);
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error("Could not look up this word. Please try again.");
    return response.json() as Promise<DictionaryEntry>;
  };

  const preferVietnamese = hasVietnameseDiacritics(word);
  let entry = preferVietnamese
    ? await lookup(word, "vi", "en")
    : await lookup(word, "en", "vi");
  if (!entry.exists && !preferVietnamese) entry = await lookup(word, "vi", "en");
  if (!entry.exists || !preferVietnamese && entry.results.some((result) => result.lang_code === "en")) return entry;

  const englishWord = entry.results.flatMap((result) => result.translations ?? [])
    .find((translation) => translation.lang_code === "en")?.translation;
  if (!englishWord) return { exists: false, word: entry.word, results: [] };
  try {
    const englishEntry = await lookup(englishWord, "en", "vi");
    if (englishEntry.exists) return englishEntry;
  } catch (error) {
    if (signal?.aborted) throw error;
  }
  return {
    ...entry,
    word: englishWord,
    results: entry.results.map((result) => ({ ...result, lang_code: "en", lang_name: "English", translations: [], pronunciations: [] })),
  };
}

export function pronunciationUrl(word: string) {
  const url = new URL(`${API}/tts`);
  url.searchParams.set("word", word);
  url.searchParams.set("lang", "en");
  return url.toString();
}
