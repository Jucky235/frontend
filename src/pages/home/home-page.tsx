import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookMarked,
  BookOpen,
  Check,
  ChevronDown,
  CirclePlay,
  Globe2,
  Headphones,
  Languages,
  Mic,
  MessageCircle,
  Repeat2,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Header from "@/components/organism/common/Header";
import Footer from "@/components/organism/common/Footer";

const methods = [
  { icon: Headphones, title: "Luyện nghe chép chính tả tiếng Anh", text: "Nghe video thực tế và gõ lại nội dung. Cải thiện độ chính xác khi nghe qua từng câu.", to: "/test" },
  { icon: Repeat2, title: "Luyện nói nhại tiếng Anh", text: "Nói theo người bản ngữ để cải thiện phát âm, ngữ điệu và độ trôi chảy.", to: "/chat" },
  { icon: Mic, title: "Luyện nói tiếng Anh cùng AI", text: "Trò chuyện về các chủ đề thường ngày và nhận góp ý tức thì về phát âm, từ vựng và cách diễn đạt.", to: "/chat" },
  { icon: BookMarked, title: "Ôn từ vựng ngắt quãng", text: "Ôn từ hữu ích bằng các phiên thẻ ghi nhớ ngắn trước khi bạn quên chúng.", to: "/flashcards-list" },
];

const featuredLessons = [
  { title: "First treasure recovered from $20bn sunken ship", source: "BBC Learning English", time: "7 min", image: "photo-1500530855697-b586d89ba3ee", label: "B2" },
  { title: "Future perfect or future perfect continuous?", source: "BBC Learning English", time: "3 min", image: "photo-1523240795612-9a054b0db644", label: "B2" },
  { title: "How are influencers affecting politics?", source: "BBC Learning English", time: "6 min", image: "photo-1529105231764-0f4b4c7a1e7b", label: "C1" },
  { title: "Talking about films", source: "Real Easy English", time: "6 min", image: "photo-1489599849927-2ee91cede3ba", label: "B1" },
];

const lessons = [
  { title: "How Bones Adapt to Physical Load", image: "photo-1530026405186-ed1f139313f8", time: "5 min" },
  { title: "Bacteriophages and Bacterial Control", image: "photo-1532187863486-abf9dbad1b69", time: "4 min" },
  { title: "Understanding Coral Bleaching", image: "photo-1546026423-cc4642628d2b", time: "5 min" },
  { title: "Microbes in Wastewater Treatment", image: "photo-1532094349884-543bc11b234d", time: "4 min" },
  { title: "How Migratory Birds Find Their Way", image: "photo-1444464666168-49d633b86797", time: "4 min" },
  { title: "Why the Ozone Layer Changes", image: "photo-1462331940025-496dfbfc7564", time: "5 min" },
  { title: "How Gecko Feet Inspire Adhesive Technology", image: "photo-1473448912268-2022ce9509d8", time: "5 min" },
  { title: "How Ultrasound Creates Medical Images", image: "photo-1579684385127-1ef15d508118", time: "4 min" },
];

const faqs = [
  ["S English là gì?", "S English giúp bạn luyện nghe, nói, từ vựng và nhiều kỹ năng khác qua các bài học và công cụ tương tác."],
  ["Tôi có thể dùng video YouTube của mình không?", "Bạn có thể luyện với các video được hỗ trợ thông qua hoạt động nghe chép chính tả và nói nhại."],
  ["Nghe chép chính tả và nói nhại là gì?", "Nghe chép chính tả yêu cầu bạn gõ lại nội dung nghe được. Nói nhại giúp bạn nói theo người bản ngữ và cải thiện phát âm."],
  ["S English có ứng dụng di động không?", "S English hoạt động trên trình duyệt, bạn có thể luyện tập bằng máy tính, máy tính bảng hoặc điện thoại."],
];

const imageUrl = (id: string, width = 640) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

function SectionHeading({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return <div className="mx-auto mb-9 max-w-2xl text-center">
    {eyebrow && <span className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-background-card/[0.04] px-2.5 py-1 text-xs font-semibold tracking-wide text-brand"><Sparkles className="h-3 w-3" />{eyebrow}</span>}
    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
    {text && <p className="mx-auto mt-2 max-w-xl text-base leading-6 text-foreground-subtle">{text}</p>}
  </div>;
}

function LessonCard({ lesson, featured = false }: { lesson: typeof lessons[number] | typeof featuredLessons[number]; featured?: boolean }) {
  return <Link to="/test" className="group overflow-hidden rounded-xl border border-border/50 bg-background-card transition hover:-translate-y-1 hover:border-pink-500/40 hover:shadow-xl hover:shadow-pink-950/20">
    <div className="relative aspect-video overflow-hidden">
      <img src={imageUrl(lesson.image, 720)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      <span className="absolute left-2 top-2 rounded bg-orange-500 px-1.5 py-0.5 text-[11px] font-black text-white">{"label" in lesson ? lesson.label : "B2"}</span>
      <span className="absolute right-2 top-2 rounded-full bg-black/65 px-2 py-1 text-[11px] font-semibold text-white">◷ {lesson.time}</span>
      <span className="absolute inset-0 grid place-items-center bg-black/10"><span className="grid h-10 w-10 place-items-center rounded-full bg-background-card text-foreground shadow-lg transition group-hover:scale-110"><CirclePlay className="h-7 w-7" /></span></span>
    </div>
    <div className="p-3">
      <p className="line-clamp-2 text-base font-semibold leading-5 text-foreground">{lesson.title}</p>
      <span className="mt-2 inline-block rounded bg-background-hover px-1.5 py-0.5 text-[11px] text-foreground-subtle">{"source" in lesson ? lesson.source : "IELTS"}</span>
    </div>
  </Link>;
}

export default function HomePage() {
  return <div className="min-h-screen bg-background text-foreground">
    <Header />
    <main className="overflow-hidden">
      <section className="relative border-b border-border bg-background">
        <div className="mx-auto grid min-h-[560px] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[.92fr_1.08fr] lg:py-24">
          <div className="relative z-10">
            <div className="mb-5 flex flex-wrap gap-2"><span className="rounded-md border border-border bg-background-card/[0.05] px-2.5 py-1 text-xs text-foreground-muted">✨ Học tập chủ động</span><span className="rounded-md border border-border bg-background-card/[0.05] px-2.5 py-1 text-xs text-emerald-300">▣ Bắt đầu miễn phí</span></div>
            <h1 className="max-w-xl text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">Nền tảng học tập toàn diện <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">tiếng Anh</span> </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-foreground-muted sm:text-lg">Luyện tập <b className="text-brand">nghe chép chính tả</b> và <b className="text-brand">nói nhại</b> qua video bài học, <b className="text-brand">trò chuyện cùng gia sư AI</b>, tra từ tức thì và mở rộng vốn từ chỉ với một gói đăng ký.</p>
            <div className="mt-6 flex flex-wrap gap-3"><Link to="/test" className="inline-flex items-center gap-2 rounded-md bg-pink-500 px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-pink-900/30 transition hover:bg-pink-400">✦ Bắt đầu học miễn phí <ArrowRight className="h-4 w-4" /></Link><Link to="/dictionary" className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3.5 text-base font-semibold text-foreground hover:bg-background-card/5"><BookOpen className="h-4 w-4" /> Khám phá bài học</Link></div>
            <div className="mt-6 grid max-w-lg grid-cols-2 gap-x-5 gap-y-2 text-xs text-foreground-subtle"><span className="text-emerald-400">◉ <span className="text-foreground-muted">Bài học tương tác từ YouTube</span></span><span className="text-emerald-400">◉ <span className="text-foreground-muted">Trò chuyện AI, từ điển và dịch thuật</span></span><span className="text-emerald-400">◉ <span className="text-foreground-muted">Bắt đầu miễn phí, không cần thẻ</span></span><span className="text-amber-300">★★★★★ <span className="text-foreground-muted">Được học viên yêu thích</span></span></div>
          </div>
          <div className="relative mx-auto w-full max-w-2xl">
            <div className="absolute -inset-8 rounded-full bg-pink-600/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-xl border border-pink-200/10 bg-background-card shadow-2xl shadow-black/60">
              <div className="flex h-9 items-center gap-1.5 border-b border-border/50 bg-background-card px-3"><i className="h-2 w-2 rounded-full bg-red-400"/><i className="h-2 w-2 rounded-full bg-amber-300"/><i className="h-2 w-2 rounded-full bg-emerald-400"/><span className="ml-3 flex-1 rounded bg-black/50 px-3 py-1 text-[9px] text-foreground-subtle">senglish.net / dictation</span></div>
              <div className="grid grid-cols-[1fr_150px] sm:grid-cols-[1fr_190px]">
                <div className="p-3 sm:p-4"><div className="relative aspect-video overflow-hidden rounded-md bg-slate-800"><img className="h-full w-full object-cover opacity-75" src={imageUrl("photo-1523240795612-9a054b0db644", 800)} alt="Xem trước bài học tiếng Anh"/><div className="absolute inset-0 grid place-items-center"><span className="grid h-12 w-12 place-items-center rounded-full bg-violet-600 shadow-lg"><CirclePlay className="h-7 w-7"/></span></div><span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[11px]">Tiếng Anh nơi công sở</span></div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-foreground-subtle"><span>00:08 / 04:31</span><span className="text-brand">● Chế độ nghe</span></div><div className="mt-2 h-1 rounded-full bg-background-card/10"><div className="h-full w-1/4 rounded-full bg-pink-500"/></div>
                  <p className="mt-3 rounded-md border border-border/50 bg-black/20 p-2.5 text-base text-foreground">Xin chào! Mình là Ben. Mình đến đây để học tiếng Anh<span className="ml-1 animate-pulse text-brand">|</span></p><div className="mt-2 flex flex-wrap gap-1">{["Hi!", "I'm", "here", "to", "learn", "English"].map(word=><span key={word} className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-300">{word}</span>)}</div>
                </div>
                <aside className="border-l border-border/50 bg-black/10 p-3 text-[11px] text-foreground-muted"><div className="mb-3 flex justify-between text-foreground-muted"><span>Luyện tập cùng AI</span><span>•••</span></div><div className="rounded border border-border p-2"><span className="text-brand">●</span> Bài luyện tập của bạn</div>{[1,2,3,4,5,6].map(i=><div key={i} className="mt-3 border-b border-border/50 pb-2"><span className="text-foreground-subtle">0{i}:00</span><p className="mt-1 h-1 w-4/5 rounded bg-background-card/10"/></div>)}</aside>
              </div>
            </div>
            <span className="absolute -right-4 top-1/2 grid h-12 w-12 place-items-center rounded-full bg-violet-600 shadow-xl shadow-violet-900/40"><CirclePlay className="h-8 w-8"/></span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8"><SectionHeading title="Phương pháp học tiếng Anh chủ động" text="Bốn cách luyện tập với bài học thực tế và nhận góp ý tức thì."/><div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">{methods.map(({icon: Icon,title,text,to})=><Link key={title} to={to} className="group rounded-xl border border-border/50 bg-background-card p-4 transition hover:border-pink-500/30 hover:bg-background-card"><Icon className="mb-3 h-5 w-5 text-pink-500"/><h3 className="text-base font-semibold">{title}</h3><p className="mt-2 min-h-16 text-xs leading-4 text-foreground-subtle">{text}</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand">Tìm hiểu thêm <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1"/></span></Link>)}</div></section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><SectionHeading eyebrow="Bài học nổi bật" title="Bắt đầu với BBC Learning English" text="Các bài học được chọn lọc từ video thực tế giúp bạn nói tiếng Anh tự tin hơn."/><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{featuredLessons.map(lesson=><LessonCard key={lesson.title} lesson={lesson} featured/>)}</div></section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><SectionHeading eyebrow="Khám phá thư viện" title="Khám phá thư viện bài học" text="Đăng nhập để luyện nghe chép chính tả, nói nhại và phát âm trên mọi thiết bị."/><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{lessons.map(lesson=><LessonCard key={lesson.title} lesson={lesson}/>)}</div><div className="mt-6 text-center"><Link to="/test" className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-base font-semibold text-foreground hover:border-pink-500/40">Xem tất cả bài học <ArrowRight className="h-4 w-4 text-brand"/></Link></div></section>

      <section className="border-y border-border/50 bg-background-card px-5 py-16 sm:px-8"><SectionHeading eyebrow="Phương pháp S English" title="Vì sao luyện tập chủ động hiệu quả hơn xem thụ động" text="Đổi mới cách học tiếng Anh với các phương pháp tương tác hiệu quả."/><div className="mx-auto grid max-w-4xl items-center gap-4 md:grid-cols-[1fr_auto_1fr]"><div className="rounded-xl border border-rose-300/40 bg-background-card p-5"><h3 className="text-base font-bold">Học thụ động</h3><p className="mb-4 mt-1 text-xs text-foreground-subtle">Chỉ xem video...</p>{["Xem video có phụ đề", "Tra từ rồi nhanh chóng quên mất", "Không luyện nói", "Không theo dõi được tiến độ"].map(x=><div key={x} className="mb-2 flex items-center gap-2 rounded bg-background-card/[0.03] p-2.5 text-xs text-foreground-muted"><span className="text-rose-400">⊗</span>{x}</div>)}</div><span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-pink-500 text-xs font-black">VS</span><div className="relative rounded-xl border border-pink-500 bg-background-card p-5 shadow-lg shadow-pink-950/20"><span className="absolute -top-3 right-5 rounded bg-pink-500 px-2 py-1 text-[11px] font-bold">Đề xuất</span><h3 className="text-base font-bold">Luyện tập chủ động</h3><p className="mb-4 mt-1 text-xs text-foreground-subtle">Chủ động với từng từ!</p>{["Gõ lại nội dung bạn nghe được", "Luyện nói và nhận góp ý từ AI", "Lưu từ và ôn tập ngắt quãng", "Theo dõi tiến độ qua thống kê chi tiết"].map((x,i)=><div key={x} className="mb-2 flex items-center gap-2 rounded bg-background-card/[0.03] p-2.5 text-xs text-foreground-muted"><span className={i%2?"text-emerald-400":"text-blue-400"}>◉</span>{x}</div>)}</div></div></section>

      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8"><SectionHeading eyebrow="Luyện nghe chép chính tả và nói nhại tương tác" title="Luyện tập với video YouTube thực tế" text="Làm chủ tiếng Anh bằng cách luyện tập chủ động."/><div className="grid items-center gap-8 md:grid-cols-2"><div className="overflow-hidden rounded-xl border border-border bg-background-card p-3 shadow-xl"><img src={imageUrl("photo-1523240795612-9a054b0db644", 900)} alt="Học viên cùng luyện tập" className="aspect-video w-full rounded-lg object-cover"/><div className="mt-3 flex gap-2"><span className="rounded bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-300">Nghe</span><span className="rounded bg-pink-500/10 px-2 py-1 text-[11px] text-brand">Gõ</span><span className="rounded bg-violet-500/10 px-2 py-1 text-[11px] text-violet-300">Cải thiện</span></div></div><div><span className="rounded bg-background-card/[0.06] px-2 py-1 text-[11px] text-brand">Luyện nghe chép chính tả thông minh</span><h3 className="mt-3 text-xl font-bold">Nghe và gõ lại</h3><p className="mt-2 text-base leading-6 text-foreground-muted">Lắng nghe và gõ lại nội dung. AI sẽ kiểm tra độ chính xác và gợi ý sửa lỗi ngay lập tức.</p><ul className="mt-4 space-y-2 text-base text-foreground-muted">{["Nghe từng đoạn ngắn", "Gõ lại nội dung để chủ động luyện nghe", "Nhận biết điểm cần cải thiện khi nghe"].map(x=><li key={x} className="flex gap-2"><Check className="h-4 w-4 text-emerald-400"/>{x}</li>)}</ul></div></div><div className="mt-14 grid items-center gap-8 md:grid-cols-2"><div className="order-2 md:order-1"><span className="rounded bg-background-card/[0.06] px-2 py-1 text-[11px] text-brand">Luyện nói nhại tương tác</span><h3 className="mt-3 text-xl font-bold">Nói theo người bản ngữ</h3><p className="mt-2 text-base leading-6 text-foreground-muted">Cải thiện kỹ năng nói bằng cách bắt chước phát âm của người bản ngữ. Ghi âm và nhận góp ý chi tiết.</p><ul className="mt-4 space-y-2 text-base text-foreground-muted">{["Nói theo video người bản ngữ", "Hỗ trợ IPA để phát âm chính xác", "Cải thiện độ trôi chảy và nhịp điệu"].map(x=><li key={x} className="flex gap-2"><Check className="h-4 w-4 text-emerald-400"/>{x}</li>)}</ul></div><div className="order-1 overflow-hidden rounded-xl border border-border bg-background-card p-3 md:order-2"><img src={imageUrl("photo-1516321318423-f06f85e504b3", 900)} alt="Luyện nói tương tác" className="aspect-video w-full rounded-lg object-cover"/></div></div><div className="mt-14 grid items-center gap-8 md:grid-cols-2"><div className="overflow-hidden rounded-xl border border-border bg-background-card p-3"><div className="flex h-48 items-end gap-2 rounded-lg bg-gradient-to-b from-[#311326] to-[#170b11] p-5">{[34,47,40,62,50,75,61,88,70,100].map((h,i)=><span key={i} style={{height:`${h}%`}} className={`flex-1 rounded-t bg-gradient-to-t ${i%2?"from-pink-700 to-fuchsia-400":"from-violet-700 to-pink-400"}`}/>)}</div></div><div><span className="rounded bg-background-card/[0.06] px-2 py-1 text-[11px] text-brand">Theo dõi tiến bộ</span><h3 className="mt-3 text-xl font-bold">Tiến bộ hơn qua từng ngày</h3><p className="mt-2 text-base leading-6 text-foreground-muted">Dữ liệu thực tế, tiến bộ rõ ràng. Theo dõi thời gian luyện tập và số từ bạn đã thành thạo.</p><ul className="mt-4 space-y-2 text-base text-foreground-muted">{["Tự động ghi lại thời gian luyện tập mỗi ngày", "Lưu từ mới vào danh sách từ vựng cá nhân", "Nhận biết điểm yếu và tiến bộ nhanh hơn"].map(x=><li key={x} className="flex gap-2"><Check className="h-4 w-4 text-emerald-400"/>{x}</li>)}</ul></div></div></section>

      <section className="border-y border-border/50 bg-background-card px-5 py-16 sm:px-8"><SectionHeading eyebrow="Tiện ích mở rộng trình duyệt" title="Tiện ích trình duyệt tích hợp AI" text="Dịch từ ngay trên trang, trò chuyện với AI để hiểu sâu hơn và lưu từ mới khi duyệt web."/><div className="mx-auto grid max-w-4xl gap-4 rounded-xl border border-border/50 bg-background-card p-4 md:grid-cols-2 md:p-6"><div className="flex flex-col justify-center gap-4"><h3 className="border-l-2 border-pink-500 pl-3 text-base font-semibold">Học từ mới theo ngữ cảnh ở bất cứ đâu</h3><p className="text-base leading-5 text-foreground-muted">Nhận bản dịch tức thì và lời giải thích rõ ràng ngay trên trang. Lưu từ hữu ích vào danh sách từ vựng.</p><Link to="/dictionary" className="inline-flex items-center gap-2 text-base font-semibold text-brand">Khám phá từ điển <ArrowRight className="h-3 w-3"/></Link></div><div className="rounded-lg bg-background-card p-4"><div className="rounded bg-background-card p-4 text-xs leading-5 text-foreground-muted"><b>Học theo ngữ cảnh</b><p className="mt-2">Đọc, hiểu và lưu từ mới khi khám phá các chủ đề bạn yêu thích. Tạo danh sách từ cá nhân và quay lại ôn tập bất cứ lúc nào.</p><p className="mt-2">Ví dụ giúp bạn ghi nhớ và sử dụng các cụm từ mới dễ dàng hơn.</p></div></div></div></section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8"><SectionHeading eyebrow="Hai sản phẩm, một gói đăng ký" title="Học tiếng Anh mọi lúc mọi nơi" text="Một tài khoản kết nối các công cụ luyện tập và từ vựng của bạn ở bất cứ đâu."/><div className="grid gap-4 md:grid-cols-2"><div className="rounded-xl border-t-2 border-pink-500 bg-background-card p-5"><Globe2 className="h-5 w-5 text-brand"/><h3 className="mt-3 text-base font-bold">Ứng dụng web S English</h3><p className="text-xs text-foreground-subtle">Luyện tập và làm chủ</p><ul className="mt-4 space-y-2 text-xs text-foreground-muted">{["Luyện nói nhại qua video", "Luyện nghe và gõ lại", "Gia sư nói tiếng Anh AI cho mọi trình độ", "Theo dõi tiến độ"].map(x=><li key={x}><Check className="mr-2 inline h-3 w-3 text-emerald-400"/>{x}</li>)}</ul></div><div className="rounded-xl border-t-2 border-violet-500 bg-background-card p-5"><Languages className="h-5 w-5 text-violet-400"/><h3 className="mt-3 text-base font-bold">Tiện ích mở rộng trình duyệt</h3><p className="text-xs text-foreground-subtle">Học khi duyệt web</p><ul className="mt-4 space-y-2 text-xs text-foreground-muted">{["Tra từ bằng AI", "Dịch không giới hạn bằng AI", "Lưu từ khi duyệt web", "Phát âm bằng âm thanh"].map(x=><li key={x}><Check className="mr-2 inline h-3 w-3 text-violet-400"/>{x}</li>)}</ul></div></div><div className="mt-4 rounded-xl border border-pink-500/30 bg-pink-500/[0.04] p-4 text-center"><p className="text-base font-bold text-brand">✦ Một gói đăng ký mở khóa mọi tính năng</p><p className="mt-2 text-xs text-foreground-subtle">Tiến độ và vốn từ được lưu cùng nhau trong suốt quá trình học.</p></div><div className="mt-5 text-center"><Link to="/test" className="inline-flex rounded-md bg-pink-500 px-5 py-3 text-base font-bold hover:bg-pink-400">Bắt đầu học miễn phí</Link></div></section>

      <section className="border-y border-border/50 bg-background-card px-5 py-16 sm:px-8"><SectionHeading eyebrow="Được học viên trên toàn thế giới tin dùng" title="Chia sẻ từ học viên"/><div className="mx-auto grid max-w-3xl grid-cols-3 gap-3">{[[Users,"100,000+","Học viên đang hoạt động","text-blue-400"],[Star,"5.0","Đánh giá học viên","text-amber-400"],[Globe2,"3+","Nền tảng","text-emerald-400"]].map(([Icon,value,label,color]:any)=><div key={label} className="rounded-xl border border-border/50 bg-background-card p-4 text-center"><Icon className={`mx-auto h-4 w-4 ${color}`}/><p className="mt-2 text-lg font-bold">{value}</p><p className="text-[11px] text-foreground-subtle">{label}</p></div>)}</div><div className="mx-auto mt-5 grid max-w-5xl gap-3 md:grid-cols-3">{[["“S English transformed my English learning. The practice tools keep me motivated every day.”","Elena Rodriguez","Học viên"],["“A great way to improve my listening and learn useful vocabulary at my own pace.”","Akiko Tanaka","Nghiên cứu sinh"],["“I recommend S English to anyone who wants a more active way to practice.”","Michael Chang","Giáo viên tiếng Anh"]].map(([quote,name,role])=><blockquote key={name} className="rounded-xl border border-border/50 bg-background-card p-4"><MessageCircle className="h-4 w-4 text-pink-500"/><p className="mt-3 text-base italic leading-5 text-foreground-muted">{quote}</p><footer className="mt-4 border-t border-border/50 pt-3"><b className="block text-xs">{name}</b><span className="text-[11px] text-foreground-subtle">{role}</span></footer></blockquote>)}</div></section>

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8"><SectionHeading eyebrow="Câu hỏi thường gặp" title="Các câu hỏi thường gặp" text="Giải đáp về các tính năng và dịch vụ của S English."/><div className="divide-y divide-white/[0.08]">{faqs.map(([q,a])=><details key={q} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium text-foreground">{q}<ChevronDown className="h-4 w-4 text-foreground-subtle transition group-open:rotate-180"/></summary><p className="mt-3 max-w-2xl text-base leading-5 text-foreground-muted">{a}</p></details>)}</div></section>

      <section className="mx-auto mb-14 max-w-5xl px-5 sm:px-8"><div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-600 to-fuchsia-500 px-6 py-10 text-center text-white sm:px-12"><Sparkles className="absolute right-8 top-8 h-6 w-6 text-white/30"/><p className="text-base font-semibold">Tham gia cộng đồng học tiếng Anh qua video thực tế</p><Link to="/test" className="mt-5 inline-flex items-center gap-2 rounded-md bg-background-card px-5 py-3 text-base font-bold text-foreground hover:bg-background-hover">✦ Bắt đầu học miễn phí <ArrowUpRight className="h-4 w-4"/></Link></div></section>
    </main>
    <Footer />
  </div>;
}
