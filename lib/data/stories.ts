import type { Story } from "@/types";

/**
 * Mock community stories — TEMPORARY. Replaced by the CMS.
 *
 * These are invented composites, not real people. Real stories must go
 * through the review process described in the brief before publication, and
 * contributors choose whether to be named or Anonymous.
 *
 * The repository only ever returns `status: "approved"` records. That filter
 * exists here rather than in a page so it cannot be forgotten.
 *
 * Pages must never import this file — go through lib/repositories/stories.
 */

const img = (alt: string) => ({ src: "", alt });

export const stories: Story[] = [
  {
    id: "sto-001",
    slug: "our-ivf-journey-patience-faith-and-hope",
    title: "Our IVF Journey: Patience, Faith and Hope",
    category: "IVF",
    tags: ["ivf", "success-stories"],
    coverImage: img("A couple standing together watching a sunset."),
    preview:
      "After two years of trying and three rounds of IVF, here's what we learned along the way.",
    author: { name: "Sarah & Daniel", country: "Australia" },
    publishedAt: "2026-06-12",
    readingTime: 8,
    status: "approved",
    isFeatured: true,
    body: `We started trying in the spring of 2023. By the following spring we had stopped saying "any month now".

## The first appointment

I put off booking it for months. Making the appointment felt like admitting something, and I wasn't ready to admit it.

When we finally went, the thing that surprised me most was how ordinary it was. No drama, no verdict. Just a doctor asking sensible questions and ordering tests.

## Round one

Our first cycle was cancelled at day eight. My body wasn't responding the way the protocol expected, and the clinic made the call to stop before egg collection.

I took it badly. It felt like failing at something before the test had even started. Our nurse said something I still think about — that a cancelled cycle is information, and information is what lets them change the plan.

## Round two

The second cycle went to transfer. We got a negative result twelve days later.

I don't have much to say about that fortnight that hasn't been said better elsewhere. It was the longest two weeks of my life and I did every single thing you're told not to do, including testing early, twice.

## Round three

We nearly didn't do a third. We had a conversation in the car park after the follow-up appointment about whether we were doing this because we still wanted to or because stopping felt like giving up.

We decided to do one more, and to mean it as the last one for a while rather than the last one ever. That distinction mattered more than it sounds.

Our daughter was born in February.

## What I'd tell someone starting out

Ask more questions than feels polite. Write things down, because you will not remember what was said. And find one person outside your relationship you can be completely honest with, because your partner is going through it too and cannot always be the one holding you up.

It was worth it for us. I want to be careful with that sentence, because I know how it lands when you're in the middle of it and don't yet know how yours ends. It was worth it for us, and I hope with everything that yours is too.`,
  },
  {
    id: "sto-002",
    slug: "healing-after-loss-finding-strength-again",
    title: "Healing After Loss: Finding Strength Again",
    category: "Pregnancy Loss",
    tags: ["pregnancy-loss", "mental-health"],
    coverImage: img("A pair of small knitted baby shoes on a soft blanket."),
    preview:
      "On grief, ectopic pregnancy, and slowly learning how to carry both sadness and hope.",
    author: { name: "Anonymous" },
    publishedAt: "2026-06-04",
    readingTime: 7,
    status: "approved",
    isFeatured: true,
    body: `I lost two pregnancies in eighteen months. The second was ectopic, and I was in surgery within a day of the scan.

## The thing nobody prepares you for

There was no funeral, no time off beyond the medical leave, and almost nobody outside my immediate family knew there had been anything to lose. I went back to work eleven days later and someone asked if I'd had a nice holiday.

I don't blame them. But that gap — between how enormous it was inside me and how invisible it was outside — was the hardest part.

## Grief that doesn't have a shape

I kept waiting to reach a stage. Anger, acceptance, whatever comes next. It didn't work like that. It came in waves, often over nothing: a nappy advert, a due date I'd never told anyone about.

What helped, eventually, was stopping trying to manage it on a schedule.

## Finding people who understood

I found a support group nine months after the second loss. I nearly didn't go. Sitting in a room where I didn't have to explain the basics, where nobody said "at least you know you can get pregnant" — that was the first time I felt less alone in it.

## Where I am now

I'm not going to end this with a pregnancy announcement. I don't have one, and I've come to think stories like mine matter partly because they don't all end that way.

I'm doing okay. I think about them both. Both of those things are true at once, and I've stopped expecting one to cancel the other.`,
  },
  {
    id: "sto-003",
    slug: "when-the-diagnosis-was-mine",
    title: "When the Diagnosis Was Mine",
    category: "Male Fertility",
    tags: ["male-fertility", "mental-health"],
    coverImage: img("A man sitting thoughtfully by a window."),
    preview:
      "My wife went through every test first. It turned out the answer was on my side all along.",
    author: { name: "Michael", country: "United Kingdom" },
    publishedAt: "2026-05-26",
    readingTime: 6,
    status: "approved",
    body: `My wife had been through eight months of investigations before anyone suggested testing me. Eight months of blood tests, scans, and a laparoscopy.

My test took twenty minutes and found the answer.

I felt sick about it for a long time — not just the diagnosis, but that she'd been put through all of that first while the actual issue sat undiagnosed on my side of the equation.

Nobody asked how I was doing. Not once, in the entire process. The appointments were addressed to her, the leaflets were written for her, and I was treated as the person accompanying the patient.

I'm not saying that to compete. She had the harder time of it by a long way. But there was a version of this where somebody checked in on me too, and it never happened.

We went on to have ICSI, and we have a son. What I'd say to any man reading this: get tested early. It's quick, it's cheap, and it might spare your partner months of investigation. And if the answer turns out to be you — that's a medical fact, not a verdict on you.`,
  },
  {
    id: "sto-004",
    slug: "living-with-pcos-and-trying-to-conceive",
    title: "Living with PCOS and Trying to Conceive",
    category: "PCOS",
    tags: ["pcos", "nutrition", "success-stories"],
    coverImage: img("A woman sitting on a sofa with a notebook."),
    preview:
      "Eleven years to a diagnosis, and what finally helped once I had one.",
    author: { name: "Priya", country: "Canada" },
    publishedAt: "2026-05-18",
    readingTime: 7,
    status: "approved",
    body: `I was seventeen when my periods stopped being predictable. I was twenty-eight when someone finally said the word "PCOS".

In between there were eleven years of being told to lose weight, that irregular cycles were normal, and once, memorably, that I was probably just stressed.

## What changed with a diagnosis

Mostly it changed how I was listened to. The same symptoms, described the same way, landed completely differently once there was a name attached.

We started with ovulation induction. It worked on the third cycle.

## What I wish I'd known sooner

That PCOS is enormously variable, and most of what I read early on described someone whose version looked nothing like mine.

That "just lose weight" is not a treatment plan, and you're allowed to ask what else is on the table.

And that if you feel dismissed, you are allowed to ask again, or ask someone else. It took me eleven years to work that out.`,
  },
  {
    id: "sto-005",
    slug: "from-our-lowest-point-to-our-greatest-joy",
    title: "From Our Lowest Point to Our Greatest Joy",
    category: "Success Stories",
    tags: ["success-stories", "ivf"],
    coverImage: img("A newborn baby's hand resting in an adult's palm."),
    preview:
      "Three rounds of IVF, and the year we very nearly stopped altogether.",
    author: { name: "Layla & Sam", country: "United States" },
    publishedAt: "2026-05-09",
    readingTime: 9,
    status: "approved",
    isFeatured: true,
    body: `In the summer of 2024 we told each other we were done.

We'd had two failed cycles, spent more than we could really afford, and the follow-up appointment had been the kind where the doctor is kind but the numbers aren't.

## The year off

We took eleven months away from it entirely. No tracking, no forums, no clinic. I'd expected to feel like I was wasting time. Instead I felt like I got my life back for a while.

That year is the thing I'd most recommend to anyone in the same position, and the thing I was most afraid of at the time.

## Going back

When we went back, we went to a different clinic. Not because the first was bad, but because we wanted a fresh read on the same information.

They changed the protocol substantially. Our third cycle produced four embryos where the previous two had produced one between them.

## Now

Our son is fourteen months old and currently pulling books off a shelf I only just moved out of reach.

I don't think there's a lesson in this. It could easily have gone the other way, and I'm conscious that for a lot of people reading, it has. The only thing I'd say is that stopping for a while isn't the same as stopping.`,
  },
  {
    id: "sto-006",
    slug: "travelling-for-ivf-our-experience-abroad",
    title: "Travelling for IVF: Our Experience Abroad",
    category: "International IVF",
    tags: ["international-ivf", "ivf"],
    coverImage: img("An aeroplane wing above clouds at sunrise."),
    preview:
      "Why we chose treatment overseas, what it cost, and what we'd do differently.",
    author: { name: "Emma & Chris", country: "United Kingdom" },
    publishedAt: "2026-04-29",
    readingTime: 8,
    status: "approved",
    body: `We went abroad for our third cycle, mainly for cost, partly for waiting times.

## The maths

The headline price was roughly a third of what we'd paid at home. By the time we'd added flights, accommodation for two trips, medication that wasn't included, and the monitoring scans we had done locally, it came to a little over half. Still a substantial saving, but not the number on the website.

Ask for a written breakdown. We didn't, the first time we enquired, and the quote we were working from turned out to exclude several things we'd assumed were in it.

## What worked well

The clinic coordinated with a local scanning service so we only travelled twice rather than staying for three weeks. That made the whole thing feasible around work.

Communication was faster than we were used to. We had a named coordinator who answered emails the same day.

## What was harder

Being a long way from home during the two-week wait. We flew back the day after transfer, which meant the hardest fortnight happened in our own house, which was right for us — but the appointment where we'd have asked questions in person happened over video.

## Would we do it again

Yes, with better preparation. Get the itemised quote, ask what happens if something goes wrong once you're home, and check how the legal side works in both countries before you commit to anything involving donors.`,
  },
  {
    id: "sto-007",
    slug: "endometriosis-and-infertility-my-long-road",
    title: "Endometriosis and Infertility: My Long Road",
    category: "Endometriosis",
    tags: ["endometriosis", "mental-health"],
    coverImage: img("A woman walking along a woodland path."),
    preview:
      "Nine years to a diagnosis, and what I'd say to anyone still waiting for one.",
    author: { name: "Anonymous" },
    publishedAt: "2026-04-19",
    readingTime: 7,
    status: "approved",
    body: `Nine years between my first appointment about the pain and someone saying the word endometriosis.

In that time I was told it was IBS, that period pain is normal, that I had a low pain threshold, and — by one memorable GP — that I should try to relax more.

The diagnosis came during a laparoscopy that was booked to investigate why we hadn't conceived. Stage three, and extensive.

## The complicated feeling of being right

I cried in the recovery room, and not from pain. Relief is a strange thing to feel about a chronic condition, but after nine years of being quietly treated as someone who exaggerated, having it on a screen was its own kind of vindication.

## What came after

We had surgery, then IVF. We're one cycle in with one to go.

## To anyone still waiting

The average time to diagnosis is still measured in years, and that is a failure of the system rather than a reflection of you. If you're not being heard, ask again, and ask someone else. I wish I'd done it five years sooner.`,
  },
  {
    id: "sto-009",
    slug: "choosing-donor-sperm-our-path-to-parenthood",
    title: "Choosing Donor Sperm: Our Path to Parenthood",
    category: "Donor Conception",
    tags: ["donor-conception", "male-fertility"],
    coverImage: img("Two people's hands forming a heart shape."),
    preview:
      "How we made the decision, and how we plan to talk to our son about it.",
    author: { name: "Anonymous" },
    publishedAt: "2026-03-30",
    readingTime: 7,
    status: "approved",
    body: `We moved to donor sperm after two years and a diagnosis of non-obstructive azoospermia.

## Getting there

It took my husband about eight months to be ready to have the conversation properly, and I'm glad I waited rather than pushing. The grief involved is real and it isn't the same as mine.

What eventually helped was counselling, specifically with someone who worked in donor conception rather than general fertility counselling.

## Choosing

We chose an identity-release donor. The reading we did on donor-conceived adults' experiences was fairly consistent on this point, and we decided to weight their perspective over our own comfort.

## Telling him

He's four. He has always known, in the sense that we have never had to sit him down and reveal anything. We started using the words before he could understand them so there would never be a day when the story changed.

The advice we were given was that secrecy tends to cause more damage than the fact itself, and everything we've read since has supported that.

## To my husband, if he reads this

He is your son. Everyone can see it but you, sometimes.`,
  },
  {
    id: "sto-010",
    slug: "what-i-wish-id-known-before-starting-ivf",
    title: "What I Wish I'd Known Before Starting IVF",
    category: "IVF",
    tags: ["ivf", "mental-health"],
    coverImage: img("A person organising medication on a kitchen counter."),
    preview: "Eleven things nobody told me before my first cycle.",
    author: { name: "Nkechi", country: "United Kingdom" },
    publishedAt: "2026-03-21",
    readingTime: 6,
    status: "approved",
    body: `Things I'd tell myself before cycle one:

The quoted price is not the price. Ask what's excluded, in writing.

Numbers drop at every stage. Eggs collected, then mature, then fertilised, then developing. That funnel is normal and nobody warned me.

Monitoring appointments are early and frequent. Tell work something, even if it's vague.

The injections are genuinely fine. The anticipation is worse than the doing.

The two-week wait is harder than the injections, the collection and the transfer combined.

Progesterone side effects are indistinguishable from early pregnancy symptoms. Symptom-spotting will tell you nothing and you will do it anyway.

Your partner is also going through it, and may be handling it by saying less rather than more.

You will become an expert on your own case. That's useful, and also exhausting.

Follow-up appointments after a failed cycle are worth going to even when you'd rather not.

One cancelled or failed cycle changes the plan, not the outcome.

And you're allowed to stop, pause, or change direction at any point. It's your life, not a protocol you owe completion to.`,
  },
  {
    id: "sto-011",
    slug: "supporting-my-partner-through-it-all",
    title: "Supporting My Partner Through It All",
    category: "Male Fertility",
    tags: ["male-fertility", "mental-health"],
    coverImage: img("Two people holding hands across a table."),
    preview:
      "What I learned about being the one who isn't having the treatment.",
    author: { name: "David", country: "Australia" },
    publishedAt: "2026-03-12",
    readingTime: 5,
    status: "approved",
    body: `My wife had the injections, the scans, the collection and the transfer. I drove, waited, and made a lot of dinners.

For a long time I thought my job was to stay positive. It turns out that relentless optimism is quite hard to be around when you're the one whose body isn't cooperating. "It'll work next time" wasn't reassuring — it was one more thing she had to manage.

What she actually wanted was for me to say that it was rubbish, and to sit with her in it.

The practical stuff mattered more than I expected. Knowing the medication schedule so she didn't have to hold it alone. Handling the calls to the clinic. Taking the day off for collection without being asked.

I also, eventually, talked to someone myself. I'd been treating my own feelings about it as illegitimate, on the grounds that I wasn't the one going through it. That wasn't true, and pretending otherwise wasn't doing either of us any favours.`,
  },
  {
    id: "sto-012",
    slug: "it-was-worth-every-tear-and-every-wait",
    title: "It Was Worth Every Tear and Every Wait",
    category: "Success Stories",
    tags: ["success-stories", "ivf", "pregnancy-loss"],
    coverImage: img("A smiling baby sitting on a blanket outdoors."),
    preview: "Four years, two losses, five cycles — and the morning it changed.",
    author: { name: "Marianne & Chike", country: "Canada" },
    publishedAt: "2026-03-02",
    readingTime: 8,
    status: "approved",
    body: `Four years. Two losses. Five cycles. One rather loud eighteen-month-old.

I want to be honest about how this reads, because I remember what stories like mine felt like when I was three years in and it hadn't worked. They felt like being handed someone else's lottery ticket.

So: this is not a story about persistence paying off. Plenty of people are more persistent than we were and it didn't work out. It's just what happened to us.

## The bits that helped

Changing clinics after cycle three. Not because the first was bad, but a second opinion on the same file led to a different protocol.

Taking six months off after the second loss. We were making decisions from a place of exhaustion and we needed to stop.

Counselling, both of us, separately and together.

## The bits that didn't

Every supplement I bought at 2am. Every forum thread I read comparing my numbers to strangers'. Every time I told myself that if I just researched hard enough I could control the outcome.

## What I'd say

Take the breaks. Ask for the second opinion. And find the people who can hear "this is awful" without immediately trying to fix it.

She's asleep upstairs. Four years feels like a long time and no time at all.`,
  },
];
