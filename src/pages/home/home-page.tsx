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
  { icon: Headphones, title: "English dictation practice", text: "Listen to real video clips and type what you hear. Build listening accuracy one sentence at a time.", to: "/test" },
  { icon: Repeat2, title: "English shadowing", text: "Repeat after native speakers and improve pronunciation, intonation, and fluency.", to: "/chat" },
  { icon: Mic, title: "Speaking English with AI", text: "Talk about everyday topics and get instant feedback on pronunciation, vocabulary, and phrasing.", to: "/chat" },
  { icon: BookMarked, title: "Spaced repetition vocabulary", text: "Review useful words before you forget them with quick, focused flashcard sessions.", to: "/flashcards-list" },
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
  ["What is S English?", "S English helps you practice listening, speaking, vocabulary, and more with interactive lessons and tools."],
  ["Can I use my own YouTube videos?", "You can practice with supported video lessons and build skills through dictation and shadowing activities."],
  ["What is dictation and shadowing?", "Dictation asks you to type what you hear. Shadowing helps you speak along with a native speaker and refine your pronunciation."],
  ["Is there a mobile app?", "S English works in your browser, so you can practice on desktop, tablet, or mobile."],
];

const imageUrl = (id: string, width = 640) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

function SectionHeading({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return <div className="mx-auto mb-9 max-w-2xl text-center">
    {eyebrow && <span className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-background-card/[0.04] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-brand"><Sparkles className="h-3 w-3" />{eyebrow}</span>}
    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
    {text && <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-foreground-subtle">{text}</p>}
  </div>;
}

function LessonCard({ lesson, featured = false }: { lesson: typeof lessons[number] | typeof featuredLessons[number]; featured?: boolean }) {
  return <Link to="/test" className="group overflow-hidden rounded-xl border border-border/50 bg-background-card transition hover:-translate-y-1 hover:border-pink-500/40 hover:shadow-xl hover:shadow-pink-950/20">
    <div className="relative aspect-video overflow-hidden">
      <img src={imageUrl(lesson.image, 720)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      <span className="absolute left-2 top-2 rounded bg-orange-500 px-1.5 py-0.5 text-[9px] font-black text-white">{"label" in lesson ? lesson.label : "B2"}</span>
      <span className="absolute right-2 top-2 rounded-full bg-black/65 px-2 py-1 text-[9px] font-semibold text-white">◷ {lesson.time}</span>
      <span className="absolute inset-0 grid place-items-center bg-black/10"><span className="grid h-10 w-10 place-items-center rounded-full bg-background-card text-foreground shadow-lg transition group-hover:scale-110"><CirclePlay className="h-7 w-7" /></span></span>
    </div>
    <div className="p-3">
      <p className="line-clamp-2 text-xs font-semibold leading-5 text-foreground">{lesson.title}</p>
      <span className="mt-2 inline-block rounded bg-background-hover px-1.5 py-0.5 text-[9px] text-foreground-subtle">{"source" in lesson ? lesson.source : "IELTS"}</span>
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
            <div className="mb-5 flex flex-wrap gap-2"><span className="rounded-md border border-border bg-background-card/[0.05] px-2.5 py-1 text-[10px] text-foreground-muted">✨ Active Learning</span><span className="rounded-md border border-border bg-background-card/[0.05] px-2.5 py-1 text-[10px] text-emerald-300">▣ Free to Start</span></div>
            <h1 className="max-w-xl text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">Your All-in-One <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">English Learning</span> Platform</h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-foreground-muted">Practice <b className="text-brand">dictation</b> and <b className="text-brand">shadowing</b> with video lessons, <b className="text-brand">chat with an AI tutor</b>, look up words instantly, and build vocabulary — all with one subscription.</p>
            <div className="mt-6 flex flex-wrap gap-3"><Link to="/test" className="inline-flex items-center gap-2 rounded-md bg-pink-500 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-pink-900/30 transition hover:bg-pink-400">✦ Start Learning For Free <ArrowRight className="h-4 w-4" /></Link><Link to="/dictionary" className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-3 text-xs font-semibold text-foreground hover:bg-background-card/5"><BookOpen className="h-4 w-4" /> Browse Lessons</Link></div>
            <div className="mt-4 flex gap-2"><Link to="/test" className="rounded border border-border px-2.5 py-1.5 text-[9px] text-foreground-muted"> Download on the App Store</Link><Link to="/test" className="rounded border border-border px-2.5 py-1.5 text-[9px] text-foreground-muted">▶ Download on Google Play</Link></div>
            <div className="mt-6 grid max-w-lg grid-cols-2 gap-x-5 gap-y-2 text-[10px] text-foreground-subtle"><span className="text-emerald-400">◉ <span className="text-foreground-muted">YouTube-powered active lessons</span></span><span className="text-emerald-400">◉ <span className="text-foreground-muted">AI chat, dictionary & translation</span></span><span className="text-emerald-400">◉ <span className="text-foreground-muted">Free to start, no credit card</span></span><span className="text-amber-300">★★★★★ <span className="text-foreground-muted">Loved by learners</span></span></div>
          </div>
          <div className="relative mx-auto w-full max-w-2xl">
            <div className="absolute -inset-8 rounded-full bg-pink-600/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-xl border border-pink-200/10 bg-background-card shadow-2xl shadow-black/60">
              <div className="flex h-9 items-center gap-1.5 border-b border-border/50 bg-background-card px-3"><i className="h-2 w-2 rounded-full bg-red-400"/><i className="h-2 w-2 rounded-full bg-amber-300"/><i className="h-2 w-2 rounded-full bg-emerald-400"/><span className="ml-3 flex-1 rounded bg-black/50 px-3 py-1 text-[8px] text-foreground-subtle">senglish.net / dictation</span></div>
              <div className="grid grid-cols-[1fr_150px] sm:grid-cols-[1fr_190px]">
                <div className="p-3 sm:p-4"><div className="relative aspect-video overflow-hidden rounded-md bg-slate-800"><img className="h-full w-full object-cover opacity-75" src={imageUrl("photo-1523240795612-9a054b0db644", 800)} alt="English lesson preview"/><div className="absolute inset-0 grid place-items-center"><span className="grid h-12 w-12 place-items-center rounded-full bg-violet-600 shadow-lg"><CirclePlay className="h-7 w-7"/></span></div><span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[9px]">English in the workplace</span></div>
                  <div className="mt-3 flex items-center justify-between text-[9px] text-foreground-subtle"><span>00:08 / 04:31</span><span className="text-brand">● Listening mode</span></div><div className="mt-2 h-1 rounded-full bg-background-card/10"><div className="h-full w-1/4 rounded-full bg-pink-500"/></div>
                  <p className="mt-3 rounded-md border border-border/50 bg-black/20 p-2.5 text-xs text-foreground">Hi! I’m Ben. I’m here to learn English<span className="ml-1 animate-pulse text-brand">|</span></p><div className="mt-2 flex flex-wrap gap-1">{["Hi!", "I'm", "here", "to", "learn", "English"].map(word=><span key={word} className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[9px] text-emerald-300">{word}</span>)}</div>
                </div>
                <aside className="border-l border-border/50 bg-black/10 p-3 text-[9px] text-foreground-muted"><div className="mb-3 flex justify-between text-foreground-muted"><span>AI Play</span><span>•••</span></div><div className="rounded border border-border p-2"><span className="text-brand">●</span> Your practice</div>{[1,2,3,4,5,6].map(i=><div key={i} className="mt-3 border-b border-border/50 pb-2"><span className="text-foreground-subtle">0{i}:00</span><p className="mt-1 h-1 w-4/5 rounded bg-background-card/10"/></div>)}</aside>
              </div>
            </div>
            <span className="absolute -right-4 top-1/2 grid h-12 w-12 place-items-center rounded-full bg-violet-600 shadow-xl shadow-violet-900/40"><CirclePlay className="h-8 w-8"/></span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8"><SectionHeading title="Active methods to learn English" text="Four ways to practice with real lessons and instant feedback."/><div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">{methods.map(({icon: Icon,title,text,to})=><Link key={title} to={to} className="group rounded-xl border border-border/50 bg-background-card p-4 transition hover:border-pink-500/30 hover:bg-background-card"><Icon className="mb-3 h-5 w-5 text-pink-500"/><h3 className="text-xs font-semibold">{title}</h3><p className="mt-2 min-h-16 text-[10px] leading-4 text-foreground-subtle">{text}</p><span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-brand">Learn more <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1"/></span></Link>)}</div></section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><SectionHeading eyebrow="Featured Lessons" title="Start with BBC Learning English" text="Hand-picked lessons from real videos to get you speaking faster."/><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{featuredLessons.map(lesson=><LessonCard key={lesson.title} lesson={lesson} featured/>)}</div></section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><SectionHeading eyebrow="Browse Library" title="Explore the lesson library" text="Sign in to start practicing dictation, shadowing, and pronunciation on any device."/><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{lessons.map(lesson=><LessonCard key={lesson.title} lesson={lesson}/>)}</div><div className="mt-6 text-center"><Link to="/test" className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-xs font-semibold text-foreground hover:border-pink-500/40">Explore all lessons <ArrowRight className="h-4 w-4 text-brand"/></Link></div></section>

      <section className="border-y border-border/50 bg-background-card px-5 py-16 sm:px-8"><SectionHeading eyebrow="The S English Method" title="Why active practice beats passive watching" text="Transform how you learn English with proven interactive methods."/><div className="mx-auto grid max-w-4xl items-center gap-4 md:grid-cols-[1fr_auto_1fr]"><div className="rounded-xl border border-rose-300/40 bg-background-card p-5"><h3 className="text-sm font-bold">Passive Learning</h3><p className="mb-4 mt-1 text-[10px] text-foreground-subtle">Just watching videos...</p>{["Watching videos with subtitles", "Looking up words then forgetting them", "No speaking practice at all", "No way to track your progress"].map(x=><div key={x} className="mb-2 flex items-center gap-2 rounded bg-background-card/[0.03] p-2.5 text-[10px] text-foreground-muted"><span className="text-rose-400">⊗</span>{x}</div>)}</div><span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-pink-500 text-[10px] font-black">VS</span><div className="relative rounded-xl border border-pink-500 bg-background-card p-5 shadow-lg shadow-pink-950/20"><span className="absolute -top-3 right-5 rounded bg-pink-500 px-2 py-1 text-[9px] font-bold">Recommended</span><h3 className="text-sm font-bold">Active Practice</h3><p className="mb-4 mt-1 text-[10px] text-foreground-subtle">Engage with every word!</p>{["Type what you hear (Dictation)", "Speak and get AI feedback", "Save words with spaced repetition", "Track progress with detailed stats"].map((x,i)=><div key={x} className="mb-2 flex items-center gap-2 rounded bg-background-card/[0.03] p-2.5 text-[10px] text-foreground-muted"><span className={i%2?"text-emerald-400":"text-blue-400"}>◉</span>{x}</div>)}</div></div></section>

      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8"><SectionHeading eyebrow="Smart Dictation & Interactive Shadowing" title="Practice with real YouTube videos" text="Master English through active practice — not passive watching."/><div className="grid items-center gap-8 md:grid-cols-2"><div className="overflow-hidden rounded-xl border border-border bg-background-card p-3 shadow-xl"><img src={imageUrl("photo-1523240795612-9a054b0db644", 900)} alt="Learners practicing together" className="aspect-video w-full rounded-lg object-cover"/><div className="mt-3 flex gap-2"><span className="rounded bg-emerald-500/10 px-2 py-1 text-[9px] text-emerald-300">Listen</span><span className="rounded bg-pink-500/10 px-2 py-1 text-[9px] text-brand">Type</span><span className="rounded bg-violet-500/10 px-2 py-1 text-[9px] text-violet-300">Improve</span></div></div><div><span className="rounded bg-background-card/[0.06] px-2 py-1 text-[9px] text-brand">Smart Dictation</span><h3 className="mt-3 text-xl font-bold">Listen and type (Dictation)</h3><p className="mt-2 text-sm leading-6 text-foreground-muted">Listen carefully and type out what you hear. Our AI technology checks your accuracy and offers instant error correction suggestions.</p><ul className="mt-4 space-y-2 text-xs text-foreground-muted">{["Listen to bite-sized segments", "Type what you hear for active engagement", "Identify weaknesses in your listening"].map(x=><li key={x} className="flex gap-2"><Check className="h-4 w-4 text-emerald-400"/>{x}</li>)}</ul></div></div><div className="mt-14 grid items-center gap-8 md:grid-cols-2"><div className="order-2 md:order-1"><span className="rounded bg-background-card/[0.06] px-2 py-1 text-[9px] text-brand">Interactive Shadowing</span><h3 className="mt-3 text-xl font-bold">Speak and mimic</h3><p className="mt-2 text-sm leading-6 text-foreground-muted">Improve your speaking skills by mimicking native speaker pronunciation. Record your voice and receive detailed feedback on your pronunciation.</p><ul className="mt-4 space-y-2 text-xs text-foreground-muted">{["Speak along with native videos", "IPA support for precise pronunciation", "Improve fluency and rhythm"].map(x=><li key={x} className="flex gap-2"><Check className="h-4 w-4 text-emerald-400"/>{x}</li>)}</ul></div><div className="order-1 overflow-hidden rounded-xl border border-border bg-background-card p-3 md:order-2"><img src={imageUrl("photo-1516321318423-f06f85e504b3", 900)} alt="Interactive speaking practice" className="aspect-video w-full rounded-lg object-cover"/></div></div><div className="mt-14 grid items-center gap-8 md:grid-cols-2"><div className="overflow-hidden rounded-xl border border-border bg-background-card p-3"><div className="flex h-48 items-end gap-2 rounded-lg bg-gradient-to-b from-[#311326] to-[#170b11] p-5">{[34,47,40,62,50,75,61,88,70,100].map((h,i)=><span key={i} style={{height:`${h}%`}} className={`flex-1 rounded-t bg-gradient-to-t ${i%2?"from-pink-700 to-fuchsia-400":"from-violet-700 to-pink-400"}`}/>)}</div></div><div><span className="rounded bg-background-card/[0.06] px-2 py-1 text-[9px] text-brand">See Your Growth</span><h3 className="mt-3 text-xl font-bold">Watch yourself get better, day by day</h3><p className="mt-2 text-sm leading-6 text-foreground-muted">Real data. Real progress. See exactly how many minutes you’ve practiced and words you’ve mastered.</p><ul className="mt-4 space-y-2 text-xs text-foreground-muted">{["Daily practice time tracked automatically", "Every new word saved to your personal vocabulary list", "Spot weak areas and improve faster"].map(x=><li key={x} className="flex gap-2"><Check className="h-4 w-4 text-emerald-400"/>{x}</li>)}</ul></div></div></section>

      <section className="border-y border-border/50 bg-background-card px-5 py-16 sm:px-8"><SectionHeading eyebrow="Browser Extension" title="Your AI-powered browser extension" text="Translate any word inline, chat with AI for deeper understanding, and save new words while you browse."/><div className="mx-auto grid max-w-4xl gap-4 rounded-xl border border-border/50 bg-background-card p-4 md:grid-cols-2 md:p-6"><div className="flex flex-col justify-center gap-4"><h3 className="border-l-2 border-pink-500 pl-3 text-sm font-semibold">Learn new words in context, wherever you read</h3><p className="text-xs leading-5 text-foreground-muted">Get instant translations and clear explanations without leaving the page. Save useful words directly to your vocabulary list.</p><Link to="/dictionary" className="inline-flex items-center gap-2 text-xs font-semibold text-brand">Explore the dictionary <ArrowRight className="h-3 w-3"/></Link></div><div className="rounded-lg bg-background-card p-4"><div className="rounded bg-background-card p-4 text-[10px] leading-5 text-foreground-muted"><b>Learn in context</b><p className="mt-2">Read, understand, and save new vocabulary as you explore topics that interest you. Build a personal word list and come back to practice anytime.</p><p className="mt-2">Examples make every new expression easier to remember and use.</p></div></div></div></section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8"><SectionHeading eyebrow="Two Products, One Subscription" title="Learn English everywhere" text="One account connects your practice tools and vocabulary wherever you study."/><div className="grid gap-4 md:grid-cols-2"><div className="rounded-xl border-t-2 border-pink-500 bg-background-card p-5"><Globe2 className="h-5 w-5 text-brand"/><h3 className="mt-3 text-sm font-bold">S English Web App</h3><p className="text-[10px] text-foreground-subtle">Practice & master</p><ul className="mt-4 space-y-2 text-[10px] text-foreground-muted">{["Shadowing practice with videos", "Listen & type dictation", "AI speaking tutor for all levels", "Progress tracking"].map(x=><li key={x}><Check className="mr-2 inline h-3 w-3 text-emerald-400"/>{x}</li>)}</ul></div><div className="rounded-xl border-t-2 border-violet-500 bg-background-card p-5"><Languages className="h-5 w-5 text-violet-400"/><h3 className="mt-3 text-sm font-bold">Browser Extension</h3><p className="text-[10px] text-foreground-subtle">Learn while browsing</p><ul className="mt-4 space-y-2 text-[10px] text-foreground-muted">{["AI dictionary lookup", "Unlimited translation with AI", "Save words while browsing", "Audio pronunciation"].map(x=><li key={x}><Check className="mr-2 inline h-3 w-3 text-violet-400"/>{x}</li>)}</ul></div></div><div className="mt-4 rounded-xl border border-pink-500/30 bg-pink-500/[0.04] p-4 text-center"><p className="text-xs font-bold text-brand">✦ One subscription unlocks everything</p><p className="mt-2 text-[10px] text-foreground-subtle">Your progress and vocabulary stay together as you learn.</p></div><div className="mt-5 text-center"><Link to="/test" className="inline-flex rounded-md bg-pink-500 px-5 py-3 text-xs font-bold hover:bg-pink-400">Start Learning For Free</Link></div></section>

      <section className="border-y border-border/50 bg-background-card px-5 py-16 sm:px-8"><SectionHeading eyebrow="Trusted by Learners Worldwide" title="What our users are saying"/><div className="mx-auto grid max-w-3xl grid-cols-3 gap-3">{[[Users,"100,000+","Active Learners","text-blue-400"],[Star,"5.0","Learner Rating","text-amber-400"],[Globe2,"3+","Platforms","text-emerald-400"]].map(([Icon,value,label,color]:any)=><div key={label} className="rounded-xl border border-border/50 bg-background-card p-4 text-center"><Icon className={`mx-auto h-4 w-4 ${color}`}/><p className="mt-2 text-lg font-bold">{value}</p><p className="text-[9px] text-foreground-subtle">{label}</p></div>)}</div><div className="mx-auto mt-5 grid max-w-5xl gap-3 md:grid-cols-3">{[["“S English transformed my English learning. The practice tools keep me motivated every day.”","Elena Rodriguez","Learner"],["“A great way to improve my listening and learn useful vocabulary at my own pace.”","Akiko Tanaka","Graduate student"],["“I recommend S English to anyone who wants a more active way to practice.”","Michael Chang","English teacher"]].map(([quote,name,role])=><blockquote key={name} className="rounded-xl border border-border/50 bg-background-card p-4"><MessageCircle className="h-4 w-4 text-pink-500"/><p className="mt-3 text-xs italic leading-5 text-foreground-muted">{quote}</p><footer className="mt-4 border-t border-border/50 pt-3"><b className="block text-[10px]">{name}</b><span className="text-[9px] text-foreground-subtle">{role}</span></footer></blockquote>)}</div></section>

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8"><SectionHeading eyebrow="FAQs" title="Frequently asked questions" text="Common questions about S English features and services."/><div className="divide-y divide-white/[0.08]">{faqs.map(([q,a])=><details key={q} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between text-xs font-medium text-foreground">{q}<ChevronDown className="h-4 w-4 text-foreground-subtle transition group-open:rotate-180"/></summary><p className="mt-3 max-w-2xl text-xs leading-5 text-foreground-muted">{a}</p></details>)}</div></section>

      <section className="mx-auto mb-14 max-w-5xl px-5 sm:px-8"><div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-600 to-fuchsia-500 px-6 py-10 text-center text-white sm:px-12"><Sparkles className="absolute right-8 top-8 h-6 w-6 text-white/30"/><p className="text-sm font-semibold">Join learners practicing English with real video lessons</p><Link to="/test" className="mt-5 inline-flex items-center gap-2 rounded-md bg-background-card px-5 py-3 text-xs font-bold text-foreground hover:bg-background-hover">✦ Start Learning For Free <ArrowUpRight className="h-4 w-4"/></Link></div></section>
    </main>
    <Footer />
  </div>;
}
