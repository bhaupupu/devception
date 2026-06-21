import { AUTHOR } from './site';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: number;
  category: string;
  tags: string[];
  author: string;
  content: string;
}

// Four focused, original, cited posts written under a real byline (E-E-A-T).
// We deliberately removed six earlier generic/AI articles that overlapped in
// thesis and carried no citations — fewer strong posts beat many thin ones.
export const blogPosts: BlogPost[] = [
  {
    slug: 'social-deduction-coding-collaboration',
    title: 'How Social Deduction Changes Coding Collaboration',
    excerpt:
      'Most collaboration tools assume everyone acts in good faith. Devception removes that assumption on purpose — and turns code review, communication, and trust into a skill you can feel yourself sharpening.',
    date: '2026-04-12',
    readTime: 8,
    category: 'Game Design',
    tags: ['social deduction', 'code review', 'collaboration', 'game design', 'psychological safety'],
    author: AUTHOR.name,
    content: `
<h2>The assumption baked into every collaboration tool</h2>
<p>Pull requests, pair programming, shared editors, Slack threads — almost every tool we use to build software together quietly assumes one thing: everyone is pulling in the same direction. The reviewer wants the code to be correct. The teammate editing your function is trying to help. When I started designing Devception, I wanted to know what happens to collaboration when you remove that single assumption and replace it with doubt.</p>
<p>The answer turned out to be more interesting than I expected. Take away guaranteed good faith and coding stops being a quiet, parallel activity. It becomes a social one — closer to a negotiation than a checklist.</p>

<h2>Why I put an imposter inside a code editor</h2>
<p>Devception drops 4–8 players into a single live editor working on one broken program. Most are Good Coders trying to fix it before the timer runs out. One or two are imposters trying to break it without being caught. The constraint that makes it work is simple: imposters cannot just sit idle. They have to touch the codebase, which means deception has to happen through real, observable actions — an edit near someone else's function, a confidently wrong suggestion in chat, a "fix" that quietly introduces an off-by-one error.</p>
<p>That constraint is the whole design. It converts a fuzzy social question ("who do I trust?") into a stream of concrete, reviewable evidence ("who edited line 42 right before the test started failing?").</p>

<h2>Trust stops being binary</h2>
<p>On a real team, trust is mostly binary: these are my colleagues, so I trust their commits. In Devception, trust is a dial that moves every few seconds. When a teammate edits a function you wrote, you cannot immediately tell whether they fixed a bug or planted one. So you do what good engineers do under uncertainty — you read the diff more carefully, you ask why, and you verify instead of assuming.</p>
<p>This is the same muscle that modern code review depends on. In their study of code review at Microsoft, Bacchelli and Bird found that the top motivation developers bring to review is <em>finding defects</em>, but the outcomes they actually value most are <em>understanding the change</em> and <em>knowledge transfer</em> — reviewing is as much about comprehension and communication as it is about catching bugs (<a href="https://www.microsoft.com/en-us/research/publication/expectations-outcomes-and-challenges-of-modern-code-review/" target="_blank" rel="noopener noreferrer">Bacchelli &amp; Bird, 2013</a>). Devception forces that comprehension-first posture on you, because you cannot review on autopilot when one of the authors might be sabotaging you.</p>

<h2>The psychological-safety paradox</h2>
<p>There is a tension here worth naming. Amy Edmondson's research on high-performing teams shows that people do their best work when they feel <strong>psychologically safe</strong> — safe to ask questions, admit mistakes, and challenge each other without fear of punishment (<a href="https://doi.org/10.2307/2666999" target="_blank" rel="noopener noreferrer">Edmondson, 1999</a>). A game built on suspicion looks like the opposite of that.</p>
<p>The trick is that Devception puts the distrust inside a clearly bounded fiction. For fifteen minutes, suspicion is the <em>rules of the game</em>, not a comment on your character. That framing lets people practice the uncomfortable parts of collaboration — pushing back on a change, voicing a doubt, defending a decision under scrutiny — in a setting where being wrong costs you a round, not your reputation. You get the reps without the real-world stakes.</p>

<h2>Why active beats passive</h2>
<p>One reason the format sticks is that it refuses to let anyone be a passive observer. Chi and Wylie's ICAP framework synthesizes decades of learning research into a clean ranking: <strong>I</strong>nteractive learning beats <strong>C</strong>onstructive, which beats <strong>A</strong>ctive, which beats <strong>P</strong>assive (<a href="https://doi.org/10.1080/00461520.2014.965823" target="_blank" rel="noopener noreferrer">Chi &amp; Wylie, 2014</a>). Reading a tutorial is passive. Typing along is active. Building your own solution is constructive. Arguing about a solution with another person who pushes back is interactive — and it is the most effective mode of the four.</p>
<p>A Devception match is interactive by construction: you are constantly reacting to other people's edits, defending your reasoning in chat, and updating your mental model when someone challenges it. That is the highest-value learning mode, dressed up as a party game.</p>

<h2>What actually transfers to real work</h2>
<ul>
  <li><strong>Reading code defensively.</strong> You stop skimming diffs and start asking what a change could break, not just what it claims to do.</li>
  <li><strong>Adversarial thinking.</strong> Playing — or hunting — the imposter is a crash course in the security mindset: how could this be misused on purpose?</li>
  <li><strong>Disagreeing productively.</strong> The voting phase is practice for the hardest conversation in engineering: telling a teammate you think they are wrong, with evidence, without it turning personal.</li>
  <li><strong>Trust calibration.</strong> Knowing when to take a suggestion on faith and when to verify it independently is a senior-engineer skill. Devception trains it directly.</li>
</ul>

<h2>A couple of questions I get a lot</h2>
<p><strong>Doesn't building a game on distrust make people worse collaborators?</strong> In testing, the opposite happened. Because the distrust is explicitly part of the game, people leave a match more aware of how they read each other's work — not more cynical about it.</p>
<p><strong>Do you need to be a strong coder to enjoy this?</strong> No. The deduction layer means observation and communication can carry you even when your algorithms are rusty. Some of the most effective players are the ones reading <em>people</em>, not just code.</p>

<h2>The takeaway</h2>
<p>Social deduction does not just make coding more fun. It makes the social half of software — the reviewing, the questioning, the negotiating — visible and practiceable in a way that ordinary tools never do. Code has always existed inside a web of human intentions. Devception just makes that web something you can see, and play with.</p>

<h2>References</h2>
<ul>
  <li><a href="https://www.microsoft.com/en-us/research/publication/expectations-outcomes-and-challenges-of-modern-code-review/" target="_blank" rel="noopener noreferrer">Bacchelli, A. &amp; Bird, C. (2013). Expectations, Outcomes, and Challenges of Modern Code Review. ICSE.</a></li>
  <li><a href="https://doi.org/10.2307/2666999" target="_blank" rel="noopener noreferrer">Edmondson, A. (1999). Psychological Safety and Learning Behavior in Work Teams. Administrative Science Quarterly.</a></li>
  <li><a href="https://doi.org/10.1080/00461520.2014.965823" target="_blank" rel="noopener noreferrer">Chi, M. T. H. &amp; Wylie, R. (2014). The ICAP Framework. Educational Psychologist.</a></li>
</ul>
    `,
  },
  {
    slug: 'psychology-finding-imposter',
    title: 'The Psychology of Finding the Imposter',
    excerpt:
      'People detect lies at barely better than chance. So why do skilled players catch saboteurs so reliably? Because good detection is about evidence and pattern recognition — not gut feeling. Here is the science.',
    date: '2026-04-28',
    readTime: 9,
    category: 'Game Psychology',
    tags: ['psychology', 'deception detection', 'cognitive bias', 'pattern recognition', 'social deduction'],
    author: AUTHOR.name,
    content: `
<h2>We are terrible lie detectors — and that is the interesting part</h2>
<p>Here is a number worth sitting with. Across 206 studies and more than 24,000 people, the average accuracy of judging whether someone is lying or telling the truth is about <strong>54%</strong> — barely above the 50% you would get from a coin flip (<a href="https://pubmed.ncbi.nlm.nih.gov/16859438/" target="_blank" rel="noopener noreferrer">Bond &amp; DePaulo, 2006</a>). Worse, confidence and accuracy are nearly unrelated: the people most sure they can spot a liar usually cannot.</p>
<p>So when players in a social deduction game reliably catch the saboteur, something other than raw lie-detection is happening. Understanding what that something is changes how you play Devception — and how you read a suspicious pull request at work.</p>

<h2>Why our instincts fail</h2>
<p>Most folk beliefs about lying are wrong. We watch for broken eye contact, fidgeting, and a nervous tone — but those are cues to <em>anxiety</em>, not deception. A calm liar sails through; an anxious but honest person looks guilty. We are not reading lies. We are reading nerves, and nerves are spread across honest and dishonest people alike.</p>
<p>This is exactly why Devception is a better detection environment than a face-to-face game of Mafia. The deception happens through <strong>code and behavior</strong>, not facial expressions. You are not guessing from a webcam. You are looking at an audit trail: who edited what, when, and what happened next.</p>

<h2>The bias that gets good players killed</h2>
<p>The single most dangerous mistake in deduction is <strong>confirmation bias</strong> — once you suspect someone, you start noticing every detail that fits and discounting everything that does not (<a href="https://doi.org/10.1037/1089-2680.2.2.175" target="_blank" rel="noopener noreferrer">Nickerson, 1998</a>). You lock onto a suspect early, then unconsciously build a case against them while a quieter imposter operates freely.</p>
<p>The counter-move is a habit, not a talent: before you vote, deliberately try to <em>disprove</em> your own theory. Ask "what would I expect to see if this person were innocent — and do I see it?" In Devception that means checking the actual edit history instead of trusting the story in your head. It is the same discipline that separates a real root-cause investigation from "blame whoever touched it last."</p>

<h2>Why experts see things you cannot</h2>
<p>Experienced players develop something that looks like intuition but is really compressed experience. The classic work is Chase and Simon's study of chess players, which showed that masters do not have better raw memory — they <strong>chunk</strong> the board into meaningful patterns they have seen thousands of times (<a href="https://doi.org/10.1016/0010-0285(73)90004-2" target="_blank" rel="noopener noreferrer">Chase &amp; Simon, 1973</a>). Show them a real position for five seconds and they reconstruct it almost perfectly; show them random pieces and they do no better than a beginner.</p>
<p>The same mechanism drives expert code review — a senior engineer "smells" a bug because they have seen that shape of mistake before — and it drives expert imposter-hunting. After enough matches you stop reasoning move by move and start recognizing whole patterns of suspicious behavior at a glance.</p>

<h2>The tells that actually mean something</h2>
<p>Unlike facial cues, the signals in a coding context are observable and checkable:</p>
<ul>
  <li><strong>Proximity to breakage.</strong> A test passed, someone edited near that code, the test failed. That timeline is hard evidence, not a vibe.</li>
  <li><strong>Skill inconsistency.</strong> Someone writes clean, competent code in three places and then makes a "beginner" mistake in the one function that matters. Real skill is consistent; sabotage is selective.</li>
  <li><strong>Reaction under scrutiny.</strong> When a bug surfaces, watch what a player does first: explain, deflect, or immediately accuse someone else. Pre-loaded accusations are a tell.</li>
  <li><strong>Helpful noise.</strong> Imposters often over-communicate in safe areas to bank credibility for the moment they need it.</li>
</ul>

<h2>Playing the other side</h2>
<p>Knowing how detection works also makes you a better imposter, which is half the fun. The strongest sabotage is not dramatic — it is a one-character change that looks like an honest mistake, dropped when attention is elsewhere, by someone who has spent the last five minutes being visibly useful. Good imposters do not hide from suspicion; they spend social credit they earned earlier.</p>

<h2>A practical detection checklist</h2>
<ul>
  <li>Track <em>who</em> edited <em>what</em>, not just what changed.</li>
  <li>Weigh actions over words — talk is cheap, edit history is not.</li>
  <li>Actively argue against your current suspect before you commit a vote.</li>
  <li>Prefer the player with the most opportunity to cause the specific failure you observed.</li>
  <li>Notice mismatches between how someone communicates and how they actually code.</li>
</ul>

<h2>The takeaway</h2>
<p>Finding the imposter is not a magic talent for reading people. It is evidence-handling under uncertainty, plus the self-awareness to fight your own biases — the exact skills that make someone good at code review, incident response, and security work. The biases you bring to a Devception match are the same ones you bring to a production outage. Practicing against them in a game is a surprisingly direct way to get better at the real thing.</p>

<h2>References</h2>
<ul>
  <li><a href="https://pubmed.ncbi.nlm.nih.gov/16859438/" target="_blank" rel="noopener noreferrer">Bond, C. F. &amp; DePaulo, B. M. (2006). Accuracy of Deception Judgments. Personality and Social Psychology Review.</a></li>
  <li><a href="https://doi.org/10.1037/1089-2680.2.2.175" target="_blank" rel="noopener noreferrer">Nickerson, R. S. (1998). Confirmation Bias: A Ubiquitous Phenomenon in Many Guises. Review of General Psychology.</a></li>
  <li><a href="https://doi.org/10.1016/0010-0285(73)90004-2" target="_blank" rel="noopener noreferrer">Chase, W. G. &amp; Simon, H. A. (1973). Perception in Chess. Cognitive Psychology.</a></li>
</ul>
    `,
  },
  {
    slug: 'how-we-built-devception',
    title: 'How We Built Devception: An Honest Build Log',
    excerpt:
      'The real engineering story of a pre-launch multiplayer coding game: the naive textarea that fell apart, the operational-transform rabbit hole, and why we ended up on CRDTs with Yjs.',
    date: '2026-05-15',
    readTime: 10,
    category: 'Behind the Scenes',
    tags: ['engineering', 'crdt', 'yjs', 'socket.io', 'next.js', 'build log'],
    author: AUTHOR.name,
    content: `
<h2>Start here: this is a small, honest project</h2>
<p>Before anything else, some context so you can calibrate everything below: Devception is a pre-launch project I have been building, not a funded company with a big team or a large user base. There is no growth chart to brag about yet. What I do have is a genuinely hard engineering problem that I had to solve from scratch, and this is the honest log of how that went — including the parts where I was wrong.</p>

<h2>The idea, and the weekend prototype</h2>
<p>The pitch was "Among Us, but the tasks are real code." Four to eight people share one live editor fixing a broken program; one or two are secretly trying to break it. I built the first prototype over a weekend with the dumbest possible approach: a shared <code>textarea</code>, a WebSocket, and a "broadcast the whole document on every keystroke" sync strategy.</p>
<p>It was unusable the moment a second person typed. Cursors jumped. Edits clobbered each other. Two people fixing different functions overwrote one another constantly. But it was unusable in an <em>encouraging</em> way — when four friends played it over a call, everyone was laughing, accusing each other, and typing furiously. The fun was real. The sync was broken. That told me exactly where to spend my time.</p>

<h2>The actual hard problem: collaborative editing</h2>
<p>Letting several people edit one document at the same time, over a network with variable latency, and have everyone end up with the <em>same</em> final text, is a genuinely deep computer-science problem. It is the same one Google Docs had to solve. There are two mature families of solutions, and I tried them in the wrong order.</p>

<h3>Detour 1: operational transformation</h3>
<p>Operational Transformation (OT) represents edits as operations — insert, delete, retain — and transforms concurrent operations against each other so they can be applied in any order and still converge. The foundational paper is Ellis and Gibbs' 1989 work on concurrency control in groupware (<a href="https://doi.org/10.1145/67544.66963" target="_blank" rel="noopener noreferrer">Ellis &amp; Gibbs, 1989</a>). It is elegant on paper. In practice, OT is notoriously fiddly to implement correctly — the transform functions have to handle every pairwise combination of operations, and subtle bugs only surface with three or more simultaneous editors. I burned real time here and never fully trusted my own implementation.</p>

<h3>The fix: CRDTs and Yjs</h3>
<p>The other family is Conflict-free Replicated Data Types (CRDTs). Instead of transforming operations against each other, a CRDT gives every character a unique, globally ordered identifier so concurrent edits are <em>commutative</em> by design — apply them in any order and you converge to the same result, no central coordinator required (<a href="https://hal.inria.fr/inria-00609399/" target="_blank" rel="noopener noreferrer">Shapiro et al., 2011</a>).</p>
<p>I stopped rolling my own anything and adopted <a href="https://docs.yjs.dev/" target="_blank" rel="noopener noreferrer">Yjs</a>, a battle-tested CRDT implementation, and bound it to the Monaco editor (the editor that powers VS Code) through the y-monaco binding. This is the change that made collaborative coding actually feel good: multiple people can type on the same line and nobody loses work. The lesson I keep relearning: distributed-systems problems have decades of research behind them. Use the libraries the researchers and maintainers already hardened; do not reinvent them at 2am.</p>

<h2>Transport: Socket.IO</h2>
<p>For the real-time layer I used <a href="https://socket.io/docs/v4/" target="_blank" rel="noopener noreferrer">Socket.IO</a>. It gives me bidirectional events, automatic reconnection, and — most importantly — a clean <em>rooms</em> abstraction. Each match is a room; game events broadcast to the room instead of to individual sockets, which collapses a lot of routing complexity. Yjs updates ride over the same connection. (The deeper architecture, including why the socket server cannot live on Vercel, is its own <a href="/blog/real-time-multiplayer-architecture">post</a>.)</p>

<h2>Designing sabotage was a balance problem, not a code problem</h2>
<p>My first imposter abilities were too strong — they could effectively wreck the round, so imposters always won and it felt unfair. Then I overcorrected and made sabotage so weak that Good Coders always won and matches felt flat. The version that works treats the imposter as a <em>social</em> actor, not a system-level attacker: the best abilities create plausible-deniability situations — a subtle logic error, a misleading hint — rather than obvious destruction. This took many rounds of playtesting with friends to tune, and I am still adjusting it.</p>

<h2>What I would do differently</h2>
<ul>
  <li><strong>Reach for CRDTs first.</strong> The OT detour cost me the most time for the least payoff.</li>
  <li><strong>Model the game state on paper before coding it.</strong> I refactored the match-state shape more than once because I started typing before I had thought it through.</li>
  <li><strong>Take "game feel" seriously from day one.</strong> The look and responsiveness are not polish you add at the end; they are most of why an early tester decides to play a second round.</li>
</ul>

<h2>Where it stands</h2>
<p>Devception is in active development and pre-launch. The collaborative editor, the role and sabotage systems, and the meeting-and-vote loop all work; ranking, spectator mode, and more languages are on the roadmap. I keep the running list of changes in the <a href="/devlog">devlog</a>, and if you want to see the mechanics without rounding up seven friends, the <a href="/#live-demo">interactive demo</a> on the home page walks through a full match against bots in about two minutes.</p>

<h2>References</h2>
<ul>
  <li><a href="https://hal.inria.fr/inria-00609399/" target="_blank" rel="noopener noreferrer">Shapiro, M., Preguiça, N., Baquero, C., Zawirski, M. (2011). Conflict-free Replicated Data Types. INRIA.</a></li>
  <li><a href="https://doi.org/10.1145/67544.66963" target="_blank" rel="noopener noreferrer">Ellis, C. A. &amp; Gibbs, S. J. (1989). Concurrency Control in Groupware Systems. ACM SIGMOD.</a></li>
  <li><a href="https://docs.yjs.dev/" target="_blank" rel="noopener noreferrer">Yjs — Shared editing framework documentation.</a></li>
  <li><a href="https://socket.io/docs/v4/" target="_blank" rel="noopener noreferrer">Socket.IO v4 documentation.</a></li>
</ul>
    `,
  },
  {
    slug: 'real-time-multiplayer-architecture',
    title: 'Real-Time Multiplayer Architecture with Socket.IO and Next.js',
    excerpt:
      'A practical guide to the architecture behind Devception: Socket.IO rooms and reconnection, why Vercel serverless fights long-lived sockets, CRDT vs OT for the shared editor, and server-authoritative anti-cheat.',
    date: '2026-06-02',
    readTime: 11,
    category: 'Technical',
    tags: ['socket.io', 'next.js', 'websockets', 'crdt', 'real-time', 'architecture'],
    author: AUTHOR.name,
    content: `
<h2>What makes real-time multiplayer hard</h2>
<p>A normal web app reasons about one user's state at a time. A real-time multiplayer app has to keep many users' views of a shared world consistent, over connections with unpredictable latency, while people disconnect and rejoin mid-session. Devception adds a brutal extra constraint: several of those users are editing the <em>same document</em> simultaneously. This post is the architecture I landed on, and the trade-offs behind each decision.</p>

<h2>Transport and rooms: Socket.IO</h2>
<p>The connection layer is <a href="https://socket.io/docs/v4/" target="_blank" rel="noopener noreferrer">Socket.IO</a>. Under the hood it uses WebSockets where available and adds the things you would otherwise rebuild yourself: automatic reconnection, heartbeats, and a <a href="https://socket.io/docs/v4/rooms/" target="_blank" rel="noopener noreferrer">rooms</a> abstraction. Each match is a room. Joining is a few lines:</p>
<pre style="background:#1e1e1e;color:#d4d4d4;padding:16px;overflow:auto;border:2px solid #1c1917;font-size:13px;line-height:1.6;"><code>// server
io.on('connection', (socket) =&gt; {
  socket.on('joinMatch', (roomId) =&gt; {
    socket.join(roomId);
    socket.to(roomId).emit('playerJoined', socket.id);
  });

  socket.on('codeUpdate', (roomId, update) =&gt; {
    // relay the Yjs update to everyone else in the room
    socket.to(roomId).emit('codeUpdate', update);
  });
});</code></pre>
<p>Broadcasting to a room instead of to individual sockets removes a whole category of routing bugs — you never maintain your own list of who is in a match.</p>

<h2>Why the socket server is not on Vercel</h2>
<p>This trips up a lot of Next.js developers, so it is worth being explicit. The Devception front end is Next.js 14 deployed on Vercel, but the Socket.IO server runs on a <strong>separate, always-on Node/Express process</strong>. The reason is structural: Vercel's serverless functions are short-lived and stateless, which is the opposite of what a long-lived, stateful WebSocket connection needs. Vercel's own guidance says serverless functions are not designed to maintain persistent socket connections and points you to a dedicated server or a managed realtime service for that workload (<a href="https://vercel.com/guides/do-vercel-serverless-functions-support-websocket-connections" target="_blank" rel="noopener noreferrer">Vercel: WebSocket connections</a>). So: static and server-rendered pages on Vercel, real-time on a persistent Node host. Keep them separate and life is much easier.</p>

<h2>Reconnection and state resync</h2>
<p>On a flaky connection, players <em>will</em> drop. The design has to treat reconnection as normal, not exceptional. I make the server authoritative over game state, so when a client reconnects within the grace window the server replays current state to just that socket rather than trying to diff what they missed. The Yjs document is the source of truth for the editor contents; the server is the source of truth for roles, progress, timers, and votes.</p>

<h2>The shared editor: CRDT, not OT</h2>
<p>For the editor itself I use a CRDT via <a href="https://docs.yjs.dev/" target="_blank" rel="noopener noreferrer">Yjs</a> rather than operational transformation. Both can converge concurrent edits, but they make different bets. Operational transformation transforms operations against each other and is famously hard to implement correctly. CRDTs give every character a unique identifier so concurrent operations are commutative by construction and need no central transform step (<a href="https://hal.inria.fr/inria-00609399/" target="_blank" rel="noopener noreferrer">Shapiro et al., 2011</a>). For a small team, "use a hardened CRDT library" beats "hand-write and debug OT" every time. Yjs binds directly to the Monaco editor, so the editor that powers VS Code becomes collaborative with very little glue.</p>

<h2>Optimistic updates with a server-authoritative backstop</h2>
<p>Latency above ~100ms feels laggy in an interactive editor, so the client applies local edits immediately (optimistic update) and reconciles when the authoritative update arrives. That is fine for ordinary text. It is <em>not</em> fine for privileged actions — which is the whole anti-cheat story.</p>
<p>Because imposter abilities are powerful, the client is never trusted to declare them. The server holds the secret role assignments and validates every privileged action before applying and broadcasting it:</p>
<pre style="background:#1e1e1e;color:#d4d4d4;padding:16px;overflow:auto;border:2px solid #1c1917;font-size:13px;line-height:1.6;"><code>socket.on('sabotage', (roomId, action) =&gt; {
  const match = matches.get(roomId);
  const player = match.players.get(socket.id);

  // never trust the client about its own role
  if (player.role !== 'imposter') return;
  if (!offCooldown(player, action)) return;

  applySabotage(match, action);
  io.to(roomId).emit('sabotageApplied', publicView(action));
});</code></pre>
<p>The rule of thumb: optimistic on the client for responsiveness, authoritative on the server for anything that affects fairness.</p>

<h2>Latency tactics that actually mattered</h2>
<ul>
  <li><strong>Debounce, don't flood.</strong> Yjs already batches document updates; relaying coalesced updates beats emitting on every keystroke.</li>
  <li><strong>Selective broadcasting.</strong> Not every event needs every client. A task completion only has to move the progress bar — it does not need a full state sync.</li>
  <li><strong>Separate channels by volatility.</strong> High-frequency editor traffic and low-frequency game events (votes, meetings) are distinct event types, so one cannot starve the other.</li>
</ul>

<h2>The topology, in one picture</h2>
<p>Browser (Next.js app + Monaco + Yjs client) talks over Socket.IO to a persistent Node/Express server that owns match state and relays Yjs updates; the marketing and content pages (this blog, About, legal) are plain server-rendered Next.js on Vercel. Two deployment targets, each doing what it is good at.</p>

<h2>The takeaway</h2>
<p>Real-time multiplayer is a stack of individually-hard problems — convergence, reconnection, latency, and trust — that multiply when combined. None of the choices here are exotic; they are the boring, correct options (rooms, CRDTs, a real server for sockets, server-side validation) applied deliberately. For a collaborative coding game, boring and correct is exactly what you want.</p>

<h2>References</h2>
<ul>
  <li><a href="https://socket.io/docs/v4/" target="_blank" rel="noopener noreferrer">Socket.IO v4 documentation.</a></li>
  <li><a href="https://socket.io/docs/v4/rooms/" target="_blank" rel="noopener noreferrer">Socket.IO — Rooms.</a></li>
  <li><a href="https://vercel.com/guides/do-vercel-serverless-functions-support-websocket-connections" target="_blank" rel="noopener noreferrer">Vercel — Do serverless functions support WebSocket connections?</a></li>
  <li><a href="https://hal.inria.fr/inria-00609399/" target="_blank" rel="noopener noreferrer">Shapiro, M. et al. (2011). Conflict-free Replicated Data Types. INRIA.</a></li>
  <li><a href="https://docs.yjs.dev/" target="_blank" rel="noopener noreferrer">Yjs documentation.</a></li>
</ul>
    `,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

export const blogCategories = [
  'All',
  'Game Design',
  'Game Psychology',
  'Behind the Scenes',
  'Technical',
];
