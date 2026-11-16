import { Search, X } from "lucide-react";

interface DictionarySearchProps { value: string; onChange: (value: string) => void }

export default function DictionarySearch({ value, onChange }: DictionarySearchProps) {
  return (
    <div className="relative mt-5 max-w-xl">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Từ tiếng Anh hoặc bản dịch tiếng Việt..." aria-label="Tìm trong từ điển" className="w-full rounded-2xl border border-border bg-background-card py-3.5 pl-11 pr-11 text-sm text-foreground outline-none transition focus:border-brand" />
      {value && <button type="button" onClick={() => onChange("")} aria-label="Xóa nội dung tìm kiếm" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-foreground-subtle hover:bg-background-hover"><X className="h-4 w-4" /></button>}
    </div>
  );
}
