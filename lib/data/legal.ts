/**
 * Legal pages.
 *
 * ⚠️  THESE ARE DRAFTS. NOT LEGAL ADVICE. NOT REVIEWED BY A LAWYER.
 *
 * They exist because a lawyer reviewing a policy that accurately describes the
 * system is far quicker and cheaper than one reverse-engineering it from the
 * code. Everything below reflects what the application genuinely does as
 * built — the exact fields stored, the actual third parties, the real consent
 * mechanism. Where something is undecided it says so in bold rather than
 * inventing a plausible answer.
 *
 * Before launch this content must be reviewed by a lawyer qualified in the
 * client's jurisdiction, with attention to:
 *
 *   - GDPR / UK GDPR — the audience is explicitly international
 *   - Australian Privacy Act and the Australian Privacy Principles
 *   - Australian Spam Act (consent, sender identification, unsubscribe)
 *   - Whether membership data constitutes health data by inference
 *   - Consumer law around the paid consultations
 *   - Whether anything on the site could be read as regulated health advice
 *
 * Every `**TO CONFIRM:**` marker is a question only the client can answer.
 * `scripts/verify-data.cjs` fails if any survive with `draft: false`.
 */

export interface LegalDocument {
  slug: "privacy" | "terms" | "disclaimer";
  title: string;
  description: string;
  /** Shown on the page and in `dateModified`. */
  lastUpdated: string;
  /** Renders the "not yet reviewed" banner. Set false only after sign-off. */
  draft: boolean;
  body: string;
}

const LAST_UPDATED = "2026-08-10";

export const legalDocuments: LegalDocument[] = [
  /* ------------------------------------------------------------- privacy */
  {
    slug: "privacy",
    title: "Privacy Policy",
    description:
      "What we collect, why we collect it, who we share it with, and how to get it removed.",
    lastUpdated: LAST_UPDATED,
    draft: true,
    body: `Global Fertility Hub is run by Henry and Precious. This policy explains what we do with your information, in plain English.

We've tried to write this the way we'd want it written for us. If anything is unclear, [ask us](/contact) and we'll explain it.

**TO CONFIRM:** the registered legal entity, its trading address, and the country whose privacy law governs this policy.

## The short version

We only collect what you actively type into a form. We don't use cookies for tracking, we don't run advertising, and we never sell your information. You can ask us to delete everything we hold about you at any time.

## What we collect

We collect three things, and only when you choose to send them.

### When you join the community

Through the [join form](/join) we store your name, email address, country, phone number if you give one, how you heard about us, and anything you write in the "what brings you here" box.

We also record whether you opted into our mailing list, the exact wording you agreed to, and when you agreed. We store your IP address alongside the submission, purely so we can investigate abuse of the form.

We generate a member ID for you, like GFH-7K2M9, so you can identify yourself if you use our services later.

### When you request a consultation

Through the [consultations page](/consultations) we store which session you asked for, the time you chose, your name, email address, phone number if you give one, your member ID if you quote it, and anything you write in the notes box.

### When you send us a message

Through the [contact form](/contact) we store the topic you selected, your name, email address, subject if you add one, and your message.

## What we don't collect

We think this list matters as much as the one above.

- We don't ask for medical information, and you shouldn't send it to us.
- We don't set tracking or advertising cookies.
- We don't use Google Analytics or any similar tool.
- We don't have advertising on this site and we don't share your information with advertisers.
- We don't sell your information to anyone, ever.
- We don't require an account or password to read anything on this site.

Our fonts are served from our own servers rather than loaded from Google, so simply reading a page doesn't tell any third party you were here.

**TO CONFIRM:** whether any analytics will be added before launch. If so this section must change, and a cookie notice will likely be required.

## Why we hold it, and on what basis

We hold your details so we can do the thing you asked us to do — welcome you into the community, arrange a session, or reply to your message. Under GDPR that's your consent and, for consultations, the performance of an agreement with you.

Marketing email is separate. We only send it if you ticked the box, and joining the community never required you to. You can unsubscribe from any email we send.

We do not share your information with the fertility clinics listed on this site, or with any of our discount partners. If you contact a clinic after finding them here, that's between you and them.

## Where your information is stored

Our providers store data on servers that may be outside your country, including in the United States and the European Union.

**TO CONFIRM:** the exact hosting regions and the transfer mechanism relied on — standard contractual clauses or otherwise.

## How long we keep it

Community memberships are kept until you ask us to remove you. Consultation requests and messages are kept while we may still need them, then deleted.

**TO CONFIRM:** exact retention periods for each. A specific number of months is far better than "as long as necessary".

## Your rights

Wherever you live, you can ask us to:

- tell you what we hold about you
- correct anything that's wrong
- delete everything we hold about you
- stop sending you marketing email
- send you a copy of your information

Just [write to us](/contact). We'll act on it, and we won't ask you why.

If you're in the UK or EU and you're unhappy with how we've handled your information, you have the right to complain to your national data protection authority. In Australia you can complain to the Office of the Australian Information Commissioner.

## Keeping it safe

Access to our database is limited to Henry and Precious. Information travels to us over an encrypted connection.

We should be honest that no system is perfectly secure. What we can promise is that we collect as little as possible, so there's as little as possible to lose.

## Children

This site is not intended for anyone under 16, and we don't knowingly collect information from anyone under 16.

## Changes

If we change this policy we'll update the date at the top of this page. If the change is significant and you're on our mailing list, we'll email you.

## Contact

Questions about anything here? [Send us a message](/contact).

**TO CONFIRM:** a dedicated privacy contact address, and whether a Data Protection Officer is required.`,
  },

  /* --------------------------------------------------------------- terms */
  {
    slug: "terms",
    title: "Terms of Use",
    description:
      "The agreement between you and Global Fertility Hub when you use this site.",
    lastUpdated: LAST_UPDATED,
    draft: true,
    body: `These terms apply when you use Global Fertility Hub. By using the site you're agreeing to them.

**TO CONFIRM:** the registered legal entity and the governing law and jurisdiction. The rest of this document depends on both.

## What this site is

Global Fertility Hub is an educational platform. We publish information, host community stories, run events, and introduce people to clinics who share our commitment to education.

**We are not a clinic. We do not provide medical care, and nothing on this site is medical advice.** Please read our [disclaimer](/disclaimer) — it's short, and it's the most important page here.

## Using the site

You can read everything here for free. In return, please don't:

- copy our content to republish it elsewhere as your own
- use the site to harass anyone or to promote something harmful
- submit anything false, or anything that isn't yours to share
- try to break, overload or gain unauthorised access to the site
- scrape the site automatically without asking us first

## Joining the community

Joining is free. We'll issue you a member ID and send it to you by email.

Marketing email is optional and separate — you'll only receive it if you ticked that box, and you can unsubscribe at any time.

We may remove someone from the community if they behave in a way that makes it unsafe for others.

## Sharing your story

If you send us your story, you're telling us it's true and that it's yours to share.

Every story is read and reviewed before it's published, and we may edit lightly for clarity or length. We may decline to publish a story, and we don't have to explain why.

By submitting a story you give us permission to publish it on this site and to share extracts on our social channels. You keep ownership of your words. You can choose to be named or to stay anonymous, and **you can ask us to take your story down at any time** — just tell us, and we will.

**TO CONFIRM:** whether this licence should extend to newsletters, printed material or future formats.

## Educational Clinic Partners

The clinics listed here are educational partners. We are not recommending them, we don't rank or rate them, and their presence here is not an endorsement of their clinical care.

We don't verify the medical claims a clinic makes. Choosing where to have treatment is a decision for you and your healthcare team, and we take no responsibility for the care any clinic provides.

**TO CONFIRM:** whether partners pay a fee. If any commercial relationship exists it must be disclosed clearly on the partners page — not only here.

## Consultations

Sessions with Henry and Precious are **support and advocacy, not medical care**. They are not doctors, they don't diagnose or treat, and nothing said in a session is medical advice.

Booking through this site sends a request. Nothing is confirmed until we email you to confirm it. Prices are shown before you request a session, and payment is arranged separately.

**TO CONFIRM:** cancellation and refund terms, how far in advance a session can be rescheduled, and what happens if Henry or Precious has to cancel. Consumer law in most countries requires these to be stated plainly.

## Partner discounts

Discount codes on this site are offers from other companies. The product or service is theirs, the transaction is between you and them, and their terms apply. We're not responsible for what they sell or how they treat you.

**TO CONFIRM:** whether we earn commission on these. If so it must be disclosed on the discounts page itself.

## Events and webinars

Events are educational. Speakers give their own views, which aren't necessarily ours. We may record sessions and publish them in our replay library.

## Our content

The words, design and images on this site belong to us or to the people who licensed them to us. You're welcome to link to us and to quote us with credit. Please don't republish our content wholesale.

## Links to other sites

We link out to clinics, partners and other resources. We don't control those sites and we're not responsible for them.

## If something goes wrong

We put real care into what we publish, but we can't promise the site will always be available, accurate or up to date. Fertility information changes, and general information can never account for your particular situation.

To the extent the law allows, we're not liable for any loss arising from your use of this site or from decisions made on the basis of anything you read here. Nothing here limits any right you have that can't legally be limited.

**TO CONFIRM:** this clause needs a lawyer's attention. Its enforceability varies by jurisdiction, and in a health-adjacent context it will get scrutiny.

## Changes

We may update these terms. The date at the top of this page tells you when we last did.

## Contact

[Get in touch](/contact) if anything here needs explaining.`,
  },

  /* ---------------------------------------------------------- disclaimer */
  {
    slug: "disclaimer",
    title: "Medical Disclaimer",
    description:
      "Global Fertility Hub is educational. Nothing here is medical advice.",
    lastUpdated: LAST_UPDATED,
    draft: true,
    body: `This is the most important page on this site, so we've kept it short.

## Nothing here is medical advice

Global Fertility Hub is an educational platform. Everything we publish is general information, written to help you understand your options and ask better questions.

It is not medical advice, it is not a diagnosis, and it is not a treatment plan. It can't be — we don't know you, your history or your circumstances.

**Always talk to a qualified healthcare professional about your own care.** If something here contradicts what your doctor has told you, please trust your doctor over us.

## We are not your healthcare providers

Reading this site, joining our community, attending an event or booking a session does not create a doctor-patient relationship between you and anyone at Global Fertility Hub.

## Sessions with Henry and Precious are support, not care

Henry and Precious are not doctors and have no clinical training. Their sessions are support and advocacy: helping you feel informed, prepare for appointments, and feel less alone.

They will not diagnose anything, recommend a treatment, interpret your test results or tell you what to do about your care. Those conversations belong with your clinical team.

## Our clinic partners are not recommendations

The clinics listed on this site are educational partners. We do not rank, rate, recommend or endorse them, and we do not verify their clinical claims or outcomes.

Being listed here says one thing only: they share our commitment to educating people. Where to have treatment is a decision for you and your healthcare team.

## Community stories are personal experiences

Stories on this site are individual accounts, published in the words of the people who lived them.

One person's experience is not evidence of what will happen to anyone else. Fertility journeys differ enormously, and something that worked for one person may be wrong or unavailable for another. Please don't make decisions about your care based on a story alone.

## We can't promise outcomes

Nothing on this site is a promise, guarantee or prediction about your fertility, your treatment or your chance of having a child. Anyone who offers you that certainty should be treated with caution.

## If you need help now

**This site is not for emergencies and we can't respond quickly.**

If you're experiencing severe pain, heavy bleeding, or any symptom that worries you, contact your doctor or your local emergency service immediately.

If you're struggling with your mental health, please talk to your doctor or a crisis line in your country. Fertility journeys are genuinely hard, and asking for support is a reasonable thing to do.

**TO CONFIRM:** whether to list specific crisis and support organisations. If so they must be checked and kept current — a dead helpline number on a page like this is worse than none.

## Information changes

Fertility medicine moves. We review our content, but we can't promise everything is current everywhere. Guidance, availability and law all differ by country.

## Links to other sites

We link to clinics, partners and other organisations. We don't control what they publish and we're not responsible for it.

## Questions

If anything here is unclear, [ask us](/contact). We'd rather explain twice than have you unsure.`,
  },
];

export function getLegalDocument(slug: string): LegalDocument | null {
  return legalDocuments.find((doc) => doc.slug === slug) ?? null;
}
