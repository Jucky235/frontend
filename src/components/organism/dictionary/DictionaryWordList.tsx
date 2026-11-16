import { BookOpen, LoaderCircle, Search } from "lucide-react";
import type { DictionarySuggestion } from "./dictionary-data";

interface Props { words: DictionarySuggestion[]; query: string; loading: boolean; onSelect: (word: string) => void }

export default function DictionaryWordList({ words, query, loading, onSelect }: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-background-card">
      <div className="flex items-center justify-between border-b border-border p-5">
        <h2 className="font-bold">Gợi ý từ vựng</h2>
        <span className="text-xs text-foreground-subtle">{loading ? "Searching…" : words.length ? `${words.length} matches` : "English"}</span>
      </div>
      <div className="min-h-[250px] divide-y divide-border">
        {loading ? <div className="flex min-h-[250px] items-center justify-center gap-2 text-sm text-foreground-subtle"><LoaderCircle className="h-4 w-4 animate-spin" />Đang tìm từ...</div>
          : words.length ? words.map((suggestion, index) => {
            const word = typeof suggestion.word === "string" ? suggestion.word : String(suggestion);
            return <button key={`${word}-${index}`} type="button" onClick={() => onSelect(word)} className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-background-hover">
              <span className="rounded-xl bg-background-hover p-2 text-foreground-subtle"><BookOpen className="h-4 w-4" /></span>
              <span className="font-semibold">{word}</span>
              <span className="ml-auto text-xs text-brand">Xem định nghĩa</span>
            </button>;
          })
          : query.trim().length >= 2 ? <div className="p-10 text-center"><Search className="mx-auto mb-3 h-7 w-7 text-foreground-subtle/50" /><p className="text-sm font-semibold">Không có gợi ý tiếng Anh</p><p className="mt-1 text-xs text-foreground-subtle">Nhấn Enter để tra từ hoặc dịch từ tiếng Việt sang tiếng Anh.</p></div>
            : <div className="p-10 text-center"><Search className="mx-auto mb-3 h-7 w-7 text-foreground-subtle/50" /><p className="text-sm font-semibold">Bắt đầu với một từ</p><p className="mt-1 text-xs text-foreground-subtle">Nhập ít nhất hai ký tự để xem gợi ý tiếng Anh hoặc nhập từ tiếng Việt.</p></div>}
      </div>
    </section>
  );
}
