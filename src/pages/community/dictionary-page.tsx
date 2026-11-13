import { useEffect, useState } from "react";
import Header from "@/components/organism/common/Header";
import Footer from "@/components/organism/common/Footer";
import DictionarySearch from "@/components/organism/dictionary/DictionarySearch";
import DictionaryWordList from "@/components/organism/dictionary/DictionaryWordList";
import DictionaryWordDetail from "@/components/organism/dictionary/DictionaryWordDetail";
import { lookupWord, suggestWords, type DictionaryEntry, type DictionarySuggestion } from "@/components/organism/dictionary/dictionary-data";
import { useCreateDictionaryWordMutation } from "@/redux/dictionary/dictionaryApiSlice";

export default function DictionaryPage() {
  const [createDictionaryWord] = useCreateDictionaryWordMutation();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<DictionarySuggestion[]>([]);
  const [entry, setEntry] = useState<DictionaryEntry>();
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingEntry, setLoadingEntry] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const results = await suggestWords(trimmed, controller.signal);
        setSuggestions(
          results.filter(({ word }) => /^[a-z][a-z' -]*$/i.test(word)),
        );
      } catch (cause) {
        if (!controller.signal.aborted) setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setLoadingSuggestions(false);
      }
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query]);

  const search = async (word: string) => {
    const trimmed = word.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setError("");
    setLoadingEntry(true);
    try {
      const result = await lookupWord(trimmed);
      setEntry(result.exists ? result : undefined);
      if (result.exists) {
        const definition = result.results
          .flatMap((item) => item.meanings ?? [])
          .map((meaning) => meaning.definition.trim())
          .filter(Boolean)
          .join("\n");

        if (definition) {
          // The API creates a new record or increments its search count if it exists.
          void createDictionaryWord({
              word: result.word || trimmed,
              definition,
            })
            .unwrap()
            .catch(() => {
              setError("The word was found, but its search could not be saved.");
            });
        }
      } else {
        setError(`No dictionary entry found for “${trimmed}”.`);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong while searching.");
      setEntry(undefined);
    } finally {
      setLoadingEntry(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-8 sm:px-6">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand/15 via-background-card to-background-card p-7 sm:p-10">
          <div className="pointer-events-none absolute -right-8 -top-14 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
          <div className="relative max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand">English learning tools</span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Dictionary</h1>
            <p className="max-w-xl text-sm leading-6 text-foreground-subtle sm:text-base">Look up English vocabulary, or enter a Vietnamese word to find its English equivalent.</p>
            <form onSubmit={(event) => { event.preventDefault(); void search(query); }}>
              <DictionarySearch value={query} onChange={(value) => { setQuery(value); setError(""); }} />
              <button className="sr-only" type="submit">Search</button>
            </form>
            <p className="text-xs text-foreground-subtle">Dictionary data by <a className="font-semibold text-brand hover:underline" href="https://dict.minhqnd.com" target="_blank" rel="noreferrer">minhqnd.com</a> · CC BY-SA 4.0</p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
          <DictionaryWordList words={suggestions} query={query} loading={loadingSuggestions} onSelect={(word) => { void search(word); }} />
          {loadingEntry ? <section className="flex min-h-72 items-center justify-center rounded-2xl border border-border bg-background-card p-8 text-sm text-foreground-subtle">Looking up “{query}”…</section> : <DictionaryWordDetail entry={entry} />}
        </div>
        {error && <p role="status" className="rounded-xl border border-border bg-background-card p-4 text-sm text-foreground-subtle">{error}</p>}
      </main>
      <Footer />
    </div>
  );
}
