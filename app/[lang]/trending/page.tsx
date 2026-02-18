import { ProjectCard } from "@/components/ProjectCard";
import { TrendingUp, Flame, Clock, Star } from "lucide-react";

const TRENDING_PROJECTS = [
  { _id: 't1', title: 'Zustand State Machine', description: 'Implement finite state machines elegantly with Zustand. Type-safe transitions and guards.', codeSnippet: `const useStateMachine = create((set) => ({
  state: 'idle',
  transition: (event) => set(prev => ({
    state: transitions[prev.state]?.[event] ?? prev.state
  }))
}));`, language: 'TypeScript', tags: ['zustand', 'fsm', 'state'], likes: Array(89).fill('u'), author: { name: 'Alex Chen' }, comments: 34 },
  { _id: 't2', title: 'CSS Scroll-driven Animation', description: 'Pure CSS scroll-driven animations using the new @scroll-timeline spec. No JS needed!', codeSnippet: `.progress {
  animation: grow linear;
  animation-timeline: scroll();
  transform-origin: left;
}
@keyframes grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}`, language: 'CSS', tags: ['css', 'animation', 'scroll'], likes: Array(156).fill('u'), author: { name: 'Emma Davis' }, comments: 67 },
  { _id: 't3', title: 'Python Async Generator Pipeline', description: 'Composable async generator pipeline for streaming data processing with backpressure.', codeSnippet: `async def pipeline(*stages):
    data = stages[0]()
    for stage in stages[1:]:
        data = stage(data)
    async for item in data:
        yield item

# Usage
async for result in pipeline(fetch, transform, filter):
    print(result)`, language: 'Python', tags: ['async', 'generators', 'pipeline'], likes: Array(43).fill('u'), author: { name: 'Marcus Wei' }, comments: 18 },
  { _id: 't4', title: 'Rust Zero-Copy Parser', description: 'High-performance zero-copy parsing using nom combinators. Avoids heap allocations.', codeSnippet: `fn parse_header(input: &[u8]) -> IResult<&[u8], Header> {
    let (input, magic) = tag(b"MAGIC")(input)?;
    let (input, version) = le_u16(input)?;
    let (input, size) = le_u32(input)?;
    Ok((input, Header { version, size }))
}`, language: 'Rust', tags: ['parser', 'zero-copy', 'nom'], likes: Array(71).fill('u'), author: { name: 'Jake Morrison' }, comments: 29 },
  { _id: 't5', title: 'Go Context-Aware Worker Pool', description: 'Graceful shutdown worker pool with context cancellation and panic recovery.', codeSnippet: `func WorkerPool(ctx context.Context, n int, jobs <-chan Job) {
    var wg sync.WaitGroup
    for i := 0; i < n; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                select {
                case <-ctx.Done(): return
                default: job.Execute()
                }
            }
        }()
    }
    wg.Wait()
}`, language: 'Go', tags: ['concurrency', 'context', 'workers'], likes: Array(52).fill('u'), author: { name: 'Priya Sharma' }, comments: 22 },
  { _id: 't6', title: 'React Server Actions Pattern', description: 'Progressively enhanced forms using React 19 Server Actions with optimistic updates.', codeSnippet: `async function createPost(formData: FormData) {
  'use server'
  const title = formData.get('title') as string
  await db.post.create({ data: { title, userId: auth().userId } })
  revalidatePath('/posts')
}

// Client component
<form action={createPost}>
  <input name="title" />
  <button type="submit">Create</button>
</form>`, language: 'TypeScript', tags: ['react', 'server-actions', 'next'], likes: Array(134).fill('u'), author: { name: 'Sarah Chen' }, comments: 55 },
];

export default function TrendingPage() {
  return (
    <div className="space-y-8">
      <section className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={20} className="text-primary" />
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Trending</h1>
          </div>
          <p className="text-muted-foreground text-sm">Most liked code snippets this week</p>
        </div>

        <div className="flex gap-2">
          {[{ icon: Flame, label: 'Hot' }, { icon: Clock, label: 'New' }, { icon: Star, label: 'Top' }].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                label === 'Hot'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {TRENDING_PROJECTS.map((p, i) => (
          <div key={p._id} className="relative">
            <div className="absolute -top-2 -left-2 z-10 w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {i + 1}
            </div>
            <ProjectCard project={p as any} />
          </div>
        ))}
      </div>
    </div>
  );
}
