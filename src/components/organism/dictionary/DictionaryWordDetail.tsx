import { useState } from "react";
import { Bookmark, Volume2 } from "lucide-react";
import { pronunciationUrl, type DictionaryEntry } from "./dictionary-data";

export default function DictionaryWordDetail({ entry }: { entry?: DictionaryEntry }) {
  const [savedWords, setSavedWords] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("saved-dictionary-words") || "[]") as string[]; }
    catch { return []; }
  });
  if (!entry?.exists || !entry.results?.length) return <section className="flex min-h-72 items-center justify-center rounded-2xl border border-border bg-background-card p-8 text-center text-sm text-foreground-subtle">Chọn gợi ý hoặc tìm từ để xem mục từ.</section>;

  const word = entry.word;
  const saved = savedWords.includes(word);
  const first = entry.results[0];
  const definitions = entry.results.flatMap((result) => result.meanings ?? []);
  const translations = first.translations ?? [];
  const synonyms = first.relations?.filter((relation) => /synonym|đồng nghĩa/i.test(relation.relation_type)) ?? [];
  const toggleSaved = () => {
    const next = saved ? savedWords.filter((item) => item !== word) : [...savedWords, word];
    setSavedWords(next);
    try { localStorage.setItem("saved-dictionary-words", JSON.stringify(next)); } catch { /* Storage may be disabled. */ }
  };
  const playPronunciation = () => {
    const audio = new Audio(first.audio ? new URL(first.audio, "https://dict.minhqnd.com").toString() : pronunciationUrl(word));
    void audio.play().catch(() => undefined);
  };

  return (
    <section className="h-fit rounded-2xl border border-border bg-background-card p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div><span className="text-xs font-bold uppercase tracking-wider text-brand">Mục từ điển</span><div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1"><h2 className="text-3xl font-extrabold tracking-tight">{word}</h2><span className="text-sm text-foreground-subtle">{first.pronunciations?.[0]?.ipa}</span></div><p className="mt-2 text-xs italic text-foreground-subtle">{definitions.map((meaning) => meaning.pos).filter(Boolean).filter((value, index, items) => items.indexOf(value) === index).join(" · ") || first.lang_name}</p></div>
        <div className="flex gap-2"><button type="button" onClick={playPronunciation} title="Nghe phát âm" aria-label="Nghe phát âm" className="rounded-xl border border-border p-2.5 text-foreground-subtle transition hover:bg-background-hover hover:text-brand"><Volume2 className="h-4 w-4" /></button><button type="button" onClick={toggleSaved} title={saved ? "Remove saved word" : "Save word"} aria-label={saved ? "Remove saved word" : "Save word"} className={`rounded-xl border border-border p-2.5 transition hover:bg-background-hover ${saved ? "text-brand" : "text-foreground-subtle"}`}><Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} /></button></div>
      </div>
      <div className="my-6 h-px bg-border" />
      <div className="space-y-6">
        <div><h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground-subtle">Định nghĩa</h3><div className="space-y-4">{definitions.map((meaning, index) => <div key={`${meaning.definition}-${index}`}><p className="text-sm leading-6">{meaning.definition}</p>{meaning.example && <p className="mt-2 rounded-xl bg-background-hover/70 p-3 text-sm italic leading-6">“{meaning.example}”</p>}<p className="mt-1 text-[11px] text-foreground-subtle">{[meaning.pos, meaning.source].filter(Boolean).join(" · ")}</p></div>)}</div></div>
        {translations.length > 0 && <div><h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-foreground-subtle">Bản dịch</h3><div className="flex flex-wrap gap-2">{translations.map((item, index) => <span key={`${item.translation}-${index}`} className="rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand">{item.translation}<span className="ml-1 font-normal opacity-70">{item.lang_name ? `· ${item.lang_name}` : ""}</span></span>)}</div></div>}
        {(first.pronunciations?.length ?? 0) > 1 && <div><h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-foreground-subtle">Phát âm</h3><div className="space-y-1">{first.pronunciations?.map((item, index) => <p key={`${item.region}-${index}`} className="text-sm"><span className="text-foreground-subtle">{item.region}: </span>{item.ipa}</p>)}</div></div>}
        {synonyms.length > 0 && <div><h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-foreground-subtle">Từ liên quan</h3><div className="flex flex-wrap gap-2">{synonyms.map((item) => <span key={item.related_word} className="rounded-lg border border-border px-3 py-1.5 text-xs text-foreground-subtle">{item.related_word}</span>)}</div></div>}
      </div>
    </section>
  );
}
