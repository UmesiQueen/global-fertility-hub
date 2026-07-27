import type { Resource } from "@/types";

/**
 * Mock educational resources — TEMPORARY. Replaced by the CMS.
 *
 * Nothing here is medical advice and none of it has been clinically reviewed.
 * It exists so layouts, filters and reading-time can be built against
 * realistically shaped content. Every record must be replaced with
 * client-supplied, expert-reviewed copy before launch.
 *
 * NOTE: `readingTime` describes the intended finished article, while the mock
 * bodies below are abridged. Don't compute reading time from body length in a
 * component — it will disagree with the field until real copy lands.
 *
 * Pages must never import this file — go through lib/repositories/resources.
 */

const img = (alt: string) => ({ src: "", alt });

export const resources: Resource[] = [
  {
    id: "res-001",
    slug: "understanding-your-fertility-journey",
    title: "Understanding Your Fertility Journey",
    excerpt:
      "A complete overview of the fertility journey, from your first questions through to treatment.",
    format: "guide",
    category: "ivf-basics",
    tags: ["ivf", "mental-health"],
    author: { name: "Dr Amara Ellison", role: "Fertility Educator" },
    readingTime: 12,
    publishedAt: "2026-06-18",
    coverImage: img("Two people looking at a laptop together at a kitchen table."),
    isFeatured: true,
    isNew: true,
    body: `Starting to look into fertility can feel like being handed a new language overnight. Acronyms, timelines, tests, appointments — all at once, and usually while you are also trying to live an ordinary life.

This guide walks through the shape of a typical journey. Not because everyone's looks the same — they really don't — but because knowing the general map makes it easier to ask good questions when you meet a specialist.

## Where most journeys begin

For many people the first step is simply noticing that time is passing. General guidance in most countries is to seek support after twelve months of trying, or after six months if you are over thirty-five. Those numbers are starting points for a conversation, not deadlines, and plenty of people speak to someone sooner.

A first appointment usually covers your medical history, cycle patterns, and any symptoms you have noticed. It is worth writing things down beforehand — it is surprisingly hard to recall dates and details on the spot.

## Tests and what they tell you

Initial investigations often include hormone bloodwork, an ultrasound, and a semen analysis. Each one gives a partial picture. None of them, on its own, tells you what will happen.

That is worth sitting with, because results can feel enormously final when you first read them. They are inputs to a conversation with a clinician who knows your full situation.

## Making decisions you can live with

There is rarely one obvious right answer. Treatment paths differ in cost, intensity, time and emotional load, and people weigh those differently.

Some questions that help:

- What would this involve week to week?
- What are the realistic ranges for someone in my situation?
- What happens if this cycle doesn't work?
- What support is available alongside treatment?

## Looking after yourself along the way

The practical side of fertility gets most of the attention, but the emotional side is where people most often say they felt unprepared. Waiting is its own kind of work.

Whatever you decide, you are allowed to take it at your own pace, ask the same question twice, and change your mind.`,
  },
  {
    id: "res-002",
    slug: "ivf-process-explained-step-by-step",
    title: "IVF Process Explained Step by Step",
    excerpt:
      "What the entire IVF process involves, from your first consultation through to the two-week wait.",
    format: "article",
    category: "treatments-procedures",
    tags: ["ivf"],
    author: { name: "Dr Amara Ellison", role: "Fertility Educator" },
    readingTime: 10,
    publishedAt: "2026-06-02",
    coverImage: img("A clinician holding a clipboard during a consultation."),
    isFeatured: true,
    body: `IVF is often described as a single procedure. In practice it is a sequence of steps spread across several weeks, each with its own appointments and decisions.

## Preparation

Before a cycle begins there is usually a round of baseline testing and a planning appointment. This is where your clinic sets out the protocol they are recommending and why.

## Stimulation

Daily injections encourage the ovaries to mature several follicles at once rather than the single one of a natural cycle. Monitoring appointments — typically ultrasound and bloods every few days — track how things are progressing and let the clinic adjust doses.

This phase is where the calendar gets busy. Many people find it helps to book monitoring appointments early in the morning so they interfere less with work.

## Egg collection

A short procedure under sedation, usually around fifteen to twenty minutes. Most people go home the same day and take it easy for the rest of it.

## Fertilisation and embryo development

The eggs collected are combined with sperm, either conventionally or by ICSI, where a single sperm is injected directly into an egg. The embryology team then watches development over the following days.

Updates during this stage can feel intense — numbers often drop at each step, and that is expected rather than a sign something has gone wrong.

## Transfer and the wait

One embryo is usually transferred, with any others suitable for freezing stored for later. The transfer itself is quick and does not normally require sedation.

Then comes the two-week wait, which almost everyone describes as the hardest part. There is very little to *do*, which is precisely what makes it difficult.`,
  },
  {
    id: "res-003",
    slug: "preparing-for-egg-collection",
    title: "Preparing for Egg Collection",
    excerpt:
      "Everything you need to know before your egg collection, explained in plain terms.",
    format: "article",
    category: "treatments-procedures",
    tags: ["ivf"],
    author: { name: "Nurse Priya Raman", role: "Fertility Nurse Specialist" },
    readingTime: 7,
    publishedAt: "2026-05-28",
    coverImage: img("A person reading paperwork in a bright waiting room."),
    body: `Egg collection day tends to loom large. Knowing the shape of it helps.

You will usually be asked to fast from midnight, arrive a couple of hours before the procedure, and bring someone who can take you home afterwards. Sedation means you cannot drive.

The procedure itself is short. Afterwards you rest in recovery until the sedation wears off, and the team will tell you how many eggs were collected before you leave.

Cramping and bloating for a day or two is common. Sharp or worsening pain is not, and is worth calling the clinic about rather than waiting to see.

Plan for a quiet day. Most people underestimate how much the combination of sedation, nerves and a very early start takes out of them.`,
  },
  {
    id: "res-004",
    slug: "embryo-transfer-what-to-expect",
    title: "Embryo Transfer: What to Expect",
    excerpt:
      "How embryo transfer works, what happens before and after, and what the timeline looks like.",
    format: "article",
    category: "treatments-procedures",
    tags: ["ivf"],
    author: { name: "Nurse Priya Raman", role: "Fertility Nurse Specialist" },
    readingTime: 6,
    publishedAt: "2026-05-20",
    coverImage: img("A person resting on a clinic bed before a procedure."),
    body: `Transfer is usually the shortest appointment of the whole cycle, which catches people off guard after weeks of intensive monitoring.

You will normally be asked to arrive with a comfortably full bladder, which helps with the ultrasound guidance. The transfer takes a few minutes and most people describe it as similar to a smear test.

There is no evidence that bed rest afterwards improves outcomes. Ordinary activity is fine, and for many people getting back to a normal routine is easier than sitting still.

Your clinic will tell you when to test. Testing earlier than that date tends to produce results that are hard to interpret and harder to sit with.`,
  },
  {
    id: "res-005",
    slug: "amh-fsh-lh-what-do-they-mean",
    title: "AMH, FSH & LH: What Do They Mean?",
    excerpt:
      "Understand your fertility test results and what they do — and don't — tell you.",
    format: "article",
    category: "tests-diagnosis",
    tags: ["ivf", "pcos"],
    author: { name: "Dr Amara Ellison", role: "Fertility Educator" },
    readingTime: 8,
    publishedAt: "2026-05-14",
    coverImage: img("Laboratory sample vials arranged in a rack."),
    isNew: true,
    body: `Hormone results arrive as numbers on a page, often with no explanation attached. Here is what the common ones describe.

## AMH

Anti-Müllerian hormone gives an indication of how many eggs remain — the ovarian reserve. It says nothing about egg quality, and it is not a predictor of whether you can conceive naturally.

A low AMH in your twenties and a low AMH in your forties mean quite different things in context.

## FSH

Follicle-stimulating hormone tells the ovaries to mature follicles. Measured early in the cycle, a raised level can suggest the body is working harder to do that.

## LH

Luteinising hormone triggers ovulation. It is the hormone that ovulation predictor kits detect. A raised LH-to-FSH ratio is one of the patterns associated with PCOS.

## The important caveat

These are population-level indicators being applied to one person. Two people with identical results can have completely different outcomes. Ask your clinician what your numbers mean *for you*, given everything else they know.`,
  },
  {
    id: "res-006",
    slug: "nutrition-tips-to-support-fertility",
    title: "Nutrition Tips to Support Fertility",
    excerpt:
      "Evidence-based nutrition guidance to support fertility and overall health.",
    format: "guide",
    category: "lifestyle-nutrition",
    tags: ["nutrition"],
    author: { name: "Marta Nowak", role: "Registered Dietitian" },
    readingTime: 9,
    publishedAt: "2026-05-08",
    coverImage: img("A table of fresh vegetables, fruit and whole grains."),
    isFeatured: true,
    body: `Nutrition advice around fertility gets loud and contradictory fast. The evidence base is more modest — and more reassuring — than the internet suggests.

## What the research broadly supports

Dietary patterns matter more than individual foods. Diets rich in vegetables, whole grains, legumes, fish and unsaturated fats are consistently associated with better outcomes, while heavily processed diets are associated with worse ones.

Folic acid supplementation before conception is one of the few genuinely well-established recommendations.

## What gets oversold

Single "fertility superfoods" and elimination diets have far weaker evidence than their marketing implies. Restricting your diet sharply during an already stressful period can cost more in wellbeing than it returns.

## A note on weight

Weight is associated with fertility outcomes at a population level, and that association is often communicated to individuals in blunt, unhelpful ways. If this comes up in your care, you are entitled to a conversation that is specific, respectful and free of shame.

## Talk to someone who knows your situation

This is general information. A dietitian working with your clinical team can tell you what actually applies to you.`,
  },
  {
    id: "res-007",
    slug: "supporting-your-partner-through-ivf",
    title: "Supporting Your Partner Through IVF",
    excerpt:
      "How to be there for your partner during treatment — and look after yourself too.",
    format: "article",
    category: "emotional-wellbeing",
    tags: ["ivf", "mental-health"],
    author: { name: "Tomas Lindqvist", role: "Counsellor" },
    readingTime: 6,
    publishedAt: "2026-04-30",
    coverImage: img("Two people sitting together on a sofa, talking."),
    body: `Treatment tends to fall unevenly. One partner carries most of the appointments, injections and physical recovery; the other often carries a quieter, less visible load.

Both are real, and couples run into trouble when only one is acknowledged.

Practical support is usually more welcome than reassurance. Driving to appointments, keeping track of the medication schedule, handling dinner on collection day — these land better than "it'll be fine", which can feel dismissive even when it is meant kindly.

Ask what kind of support is wanted before offering it. Some people want to talk through every detail; others want treatment to occupy as little of the evening as possible.

And the supporting partner needs support too. Having someone outside the relationship to talk to is not disloyalty.`,
  },
  {
    id: "res-008",
    slug: "managing-anxiety-during-the-two-week-wait",
    title: "Managing Anxiety During the Two-Week Wait",
    excerpt:
      "Practical ways to manage stress and take care of your mental wellbeing while you wait.",
    format: "article",
    category: "emotional-wellbeing",
    tags: ["mental-health", "ivf"],
    author: { name: "Tomas Lindqvist", role: "Counsellor" },
    readingTime: 7,
    publishedAt: "2026-04-22",
    coverImage: img("A person sitting quietly by a window with a warm drink."),
    isFeatured: true,
    body: `The two-week wait is the part of treatment with the least to do and the most to feel.

## Why it is so hard

Every other stage has a task attached. This one asks you to wait while something either is or isn't happening, entirely outside your influence. Human beings are poorly designed for that.

## What tends to help

Structure helps more than distraction. Loose plans for each day — something to look forward to, something ordinary — give the time shape without demanding much.

Symptom-checking is nearly universal and almost never informative, because early pregnancy signs and progesterone side effects overlap almost completely. Noticing the urge without acting on it every time is a realistic goal; stopping entirely usually isn't.

Decide in advance who you'll tell and when. Fielding well-meaning questions on test day is its own burden.

## If it is more than you can carry

Persistent sleeplessness, dread that doesn't lift, or feeling unable to function are worth raising with your GP or a counsellor. Many clinics offer counselling as part of treatment, and using it is not a sign that anything has gone wrong.

If you are struggling with thoughts of harming yourself, please talk to your doctor or a crisis line in your country — you deserve support with this.`,
  },
  {
    id: "res-009",
    slug: "understanding-your-ultrasound-results",
    title: "Understanding Your Ultrasound Results",
    excerpt:
      "A guide to understanding common ultrasound findings during fertility treatment.",
    format: "guide",
    category: "tests-diagnosis",
    tags: ["ivf", "pcos"],
    author: { name: "Dr Amara Ellison", role: "Fertility Educator" },
    readingTime: 8,
    publishedAt: "2026-04-15",
    coverImage: img("An ultrasound screen displaying a scan image."),
    body: `Monitoring scans generate a running commentary of measurements, most of which are never explained at the time.

Antral follicle count is taken early in the cycle and gives an indication of how many follicles are available to respond to stimulation. Follicle measurements during stimulation track growth — clinics generally look for a cohort approaching maturity together.

Endometrial thickness describes the lining of the uterus. There is a range clinics like to see before transfer, and it can be adjusted with medication if needed.

Numbers moving around between scans is normal. Follicles do not grow at identical rates, and one slower scan is rarely meaningful on its own.`,
  },
  {
    id: "res-010",
    slug: "what-happens-to-extra-embryos",
    title: "What Happens to Extra Embryos?",
    excerpt:
      "Options for storing, using or donating your remaining embryos, and the decisions involved.",
    format: "article",
    category: "donor-surrogacy",
    tags: ["ivf", "donor-conception"],
    author: { name: "Dr Helena Voss", role: "Fertility Educator" },
    readingTime: 7,
    publishedAt: "2026-04-08",
    coverImage: img("Cryogenic storage equipment in a laboratory."),
    body: `If a cycle produces more suitable embryos than are transferred, the remainder can usually be frozen. That creates a decision most people have not thought about in advance.

The options generally available are continued storage, use in a future cycle, donation to another person or couple, donation to research, or allowing them to perish.

Storage has time limits and ongoing costs that vary considerably by country. It is worth asking about both early, because the renewal date tends to arrive at an emotionally complicated moment.

There is no consensus answer here. People with the same beliefs reach different conclusions, and many find their view changes over time. Counselling is available for this decision specifically, and it is a reasonable thing to use.`,
  },
  {
    id: "res-011",
    slug: "coping-with-disappointment",
    title: "Coping with Disappointment",
    excerpt:
      "You're not alone. How to cope with setbacks and hold onto hope through them.",
    format: "article",
    category: "emotional-wellbeing",
    tags: ["mental-health", "pregnancy-loss"],
    author: { name: "Tomas Lindqvist", role: "Counsellor" },
    readingTime: 6,
    publishedAt: "2026-04-01",
    coverImage: img("A heart shape formed from soft fabric on a bed."),
    body: `A negative result after a cycle is a loss, even though it is rarely treated as one by anyone outside it.

There is often no ritual attached, no time off, and very little acknowledgement — which can leave people feeling that their grief is disproportionate. It isn't.

Give it room. The pressure to immediately plan the next step can be intense, and it is usually possible to wait longer than it feels like you can.

Anniversaries land harder than expected — due dates that would have been, the date of a transfer. Knowing that in advance takes some of the sting out of being ambushed by it.

If the low mood does not lift, or you find yourself unable to function week after week, that is worth talking to a professional about.`,
  },
  {
    id: "res-012",
    slug: "fertility-planning-checklist",
    title: "Fertility Planning Checklist",
    excerpt:
      "A printable checklist to help you stay organised and prepared through treatment.",
    format: "download",
    category: "ivf-basics",
    tags: ["ivf"],
    author: { name: "Global Fertility Hub", role: "Editorial Team" },
    readingTime: 3,
    publishedAt: "2026-03-25",
    coverImage: img("A printed checklist on a desk beside a pen."),
    downloadUrl: "/downloads/fertility-planning-checklist.pdf",
    body: `A one-page checklist covering questions to ask at your first appointment, documents to gather, and a simple tracker for appointments and medication.

Designed to be printed and kept somewhere visible.`,
  },
  {
    id: "res-013",
    slug: "pcos-and-fertility-what-to-know",
    title: "PCOS and Fertility: What to Know",
    excerpt:
      "How polycystic ovary syndrome affects fertility, and the options commonly discussed.",
    format: "guide",
    category: "fertility-conditions",
    tags: ["pcos", "nutrition"],
    author: { name: "Dr Helena Voss", role: "Fertility Educator" },
    readingTime: 11,
    publishedAt: "2026-03-18",
    coverImage: img("A person talking with a clinician in a consulting room."),
    body: `PCOS is one of the most common causes of irregular ovulation, and one of the most variable in how it presents.

Diagnosis generally rests on a combination of irregular cycles, signs of raised androgens, and ovarian appearance on ultrasound. Not everyone with PCOS has all three, which is part of why diagnosis is so often delayed.

Because ovulation is irregular rather than absent, many people with PCOS conceive without intervention. Where support is needed, ovulation induction is commonly the first step discussed, with IVF considered later if needed.

People with PCOS often respond strongly to stimulation, which is a benefit and a risk at once — clinics usually adjust protocols accordingly.

Insulin resistance is frequently part of the picture, and management of it is often discussed alongside fertility treatment rather than separately.`,
  },
  {
    id: "res-014",
    slug: "endometriosis-and-conception",
    title: "Endometriosis and Conception",
    excerpt:
      "Understanding how endometriosis can affect fertility and what support is available.",
    format: "guide",
    category: "fertility-conditions",
    tags: ["endometriosis", "ivf"],
    author: { name: "Dr Helena Voss", role: "Fertility Educator" },
    readingTime: 10,
    publishedAt: "2026-03-11",
    coverImage: img("A person in conversation with a specialist."),
    body: `Endometriosis affects roughly one in ten people of reproductive age, and diagnosis still takes years more often than it should.

Its relationship with fertility is not straightforward. Many people with endometriosis conceive without difficulty; for others it contributes significantly. Severity of pain does not reliably predict effect on fertility.

Treatment decisions often involve weighing surgery against proceeding directly to assisted reproduction, and the right answer depends heavily on the individual picture.

If you have been dismissed or told your pain is normal, that experience is unfortunately common and is not a reflection of your credibility. It is reasonable to seek a second opinion.`,
  },
  {
    id: "res-015",
    slug: "male-fertility-the-overlooked-half",
    title: "Male Fertility: The Overlooked Half",
    excerpt:
      "Male factor is involved in around half of cases — here's what testing and treatment involve.",
    format: "article",
    category: "male-fertility",
    tags: ["male-fertility", "ivf"],
    author: { name: "Dr Samuel Okonkwo", role: "Andrology Educator" },
    readingTime: 8,
    publishedAt: "2026-03-04",
    coverImage: img("A person reading information at a clinic reception."),
    isFeatured: true,
    body: `Male factor contributes to roughly half of all fertility difficulties, and is still routinely investigated later and discussed less.

## Testing

Semen analysis is straightforward, inexpensive and informative, and there is a strong argument for doing it early rather than after months of investigating one partner alone.

Results vary considerably between samples, so a single result is rarely conclusive. Repeat testing after a few weeks is standard.

## What the numbers cover

Analysis looks at concentration, motility and morphology. Each describes something different, and a result outside the reference range in one area does not necessarily mean much on its own.

## Treatment

Options range from lifestyle factors and treating underlying causes through to ICSI, where a single sperm is injected directly into an egg — which has changed outcomes substantially for male factor.

## The part that gets skipped

Men are frequently left out of the emotional conversation entirely, including by clinics. That silence is not neutral. If this is your situation, support exists for you too.`,
  },
  {
    id: "res-016",
    slug: "questions-to-ask-your-clinic",
    title: "Questions to Ask Your Clinic",
    excerpt:
      "A practical list of questions to bring to your first consultation.",
    format: "download",
    category: "ivf-basics",
    tags: ["ivf"],
    author: { name: "Global Fertility Hub", role: "Editorial Team" },
    readingTime: 4,
    publishedAt: "2026-02-25",
    coverImage: img("A notebook with handwritten questions on a table."),
    downloadUrl: "/downloads/questions-to-ask-your-clinic.pdf",
    body: `First appointments move quickly, and it is easy to leave realising you asked none of what you meant to.

This printable list covers success rates and how they are calculated, what a quoted price does and doesn't include, protocol options, and what happens if a cycle is unsuccessful.`,
  },
  {
    id: "res-017",
    slug: "travelling-abroad-for-treatment",
    title: "Travelling Abroad for Treatment",
    excerpt:
      "Practical considerations if you're thinking about fertility treatment in another country.",
    format: "guide",
    category: "treatments-procedures",
    tags: ["international-ivf", "ivf"],
    author: { name: "Global Fertility Hub", role: "Editorial Team" },
    readingTime: 12,
    publishedAt: "2026-02-18",
    coverImage: img("An aircraft wing above clouds seen from a window seat."),
    isNew: true,
    body: `People travel for treatment for many reasons — cost, waiting times, access to donor programmes, or legal differences between countries.

## Legal differences matter more than expected

Rules on donor anonymity, treatment for single people and same-sex couples, embryo storage limits and surrogacy vary enormously. What is routine in one country may be unavailable in the next.

Crucially, the rules of the country where treatment happens are not always the rules that govern your legal parenthood at home. This is worth taking proper advice on before committing.

## The practical shape of it

Treatment abroad usually means at least two trips, or one longer stay. Monitoring can sometimes be done locally and shared with the treating clinic — worth asking about early, as it changes the cost calculation substantially.

## Continuity of care

Ask who you contact if something goes wrong after you return home, and what follow-up looks like from a distance.

## Cost

Quoted prices frequently exclude medication, freezing, storage and additional procedures. Ask for a written breakdown, and budget for travel and accommodation for more than one trip.`,
  },
  {
    id: "res-018",
    slug: "fertility-preservation-explained",
    title: "Fertility Preservation Explained",
    excerpt:
      "Egg, sperm and embryo freezing — how it works and what to consider.",
    format: "video",
    category: "treatments-procedures",
    tags: ["fertility-preservation", "ivf"],
    author: { name: "Dr Amara Ellison", role: "Fertility Educator" },
    readingTime: 18,
    publishedAt: "2026-02-11",
    coverImage: img("A presenter speaking to camera in a bright studio."),
    videoUrl: "https://example.com/video/fertility-preservation",
    body: `An eighteen-minute explainer covering how egg, sperm and embryo freezing work, who tends to consider them, and the practical questions worth asking.

Covers the effect of age at freezing on later outcomes, what storage involves and costs over time, and the difference between freezing eggs and freezing embryos — including the legal implications when embryos are created with a partner.`,
  },
];
