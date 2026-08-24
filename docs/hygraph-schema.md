# Hygraph schema — build sheet

Transcribe this into Hygraph's **Schema** editor. It maps one-to-one onto `types/`, which stays the source of truth in code.

**Work top to bottom.** Enumerations must exist before the models that use them, and both sides of a relation must exist before you can create the relation field. Section 5 is deliberately last for that reason.

## How to use this document

Every model, component, enumeration, enum value and field in Hygraph has a **Description** box. It shows as help text beside the input when someone is writing content — so it's the single best place to prevent mistakes.

**The "Description" column below is the text to paste into that box.** It's written for Henry and Precious, not for developers: plain language, and it says what to *do*, not what the field is technically.

Other conventions:

- **API ID** is what appears in GraphQL. Match these exactly or the repository queries won't line up.
- *Required* means tick "Make field required" in the Validations tab.
- Every model gets Hygraph's built-in `id`, `createdAt`, `updatedAt` for free — don't add them.

---

## 0. Project setup

1. Create the project. **Choose a region close to the audience** — it can't be changed later. The client is in Perth with an international readership; `EU Central` or `US East` are the usual picks, so decide deliberately.
2. Leave **public API access disabled** (the default).
3. Under **Schema → Enumerations**, do section 1 first.

---

## 1. Enumerations

Create all nine before touching models. Each has a description of its own, then a description per value.

### `FertilityTopic`

> **Enum description:** The topics this site covers. Tagging is how everything connects — a story tagged "PCOS" will automatically suggest PCOS articles, events and partners. Tag honestly rather than broadly: two or three accurate tags work far better than eight loose ones.

| API ID | Display name | Description |
|---|---|---|
| `ivf` | IVF | In vitro fertilisation — the process, the cycle, the decisions around it. |
| `iui` | IUI | Intrauterine insemination, and how it differs from IVF. |
| `male_fertility` | Male Fertility | Sperm health, testing, andrology, and the partner's side of a diagnosis. |
| `pcos` | PCOS | Polycystic ovary syndrome — diagnosis, symptoms, and conceiving with it. |
| `endometriosis` | Endometriosis | Endometriosis and its effect on fertility. |
| `pregnancy_loss` | Pregnancy Loss | Miscarriage, ectopic pregnancy, recurrent loss, and grief. Handle gently. |
| `donor_conception` | Donor Conception | Donor eggs, sperm or embryos, and talking to children about it. |
| `lgbtq` | LGBTQ+ | Family building for same-sex couples, single parents and trans people. |
| `fertility_preservation` | Fertility Preservation | Egg, sperm and embryo freezing, including before cancer treatment. |
| `international_ivf` | International IVF | Travelling abroad for treatment — cost, law, and practicalities. |
| `nutrition` | Nutrition & Lifestyle | Food, supplements, exercise and everyday habits. |
| `mental_health` | Emotional Wellbeing | The emotional side — anxiety, the two-week wait, coping, counselling. |
| `success_stories` | Success Stories | Journeys that ended in a pregnancy or birth. Use sparingly and carefully. |

> **Note the underscores.** Hygraph enum API IDs can't contain hyphens, but our TypeScript union uses `male-fertility`. The client code maps between them in one place — don't "fix" one side to match the other.

### `ResourceFormat`

> **Enum description:** What kind of thing this resource is. It sets the icon on the card and whether the card says "min read" or "min watch".

| API ID | Display name | Description |
|---|---|---|
| `article` | Article | A written piece, read on the site. |
| `video` | Video | A video hosted elsewhere and linked. Fill in Video URL. |
| `guide` | Guide | A longer, more structured written piece — usually a walkthrough. |
| `download` | Download | Something to print or keep, like a checklist. Fill in Download URL. |
| `webinar` | Webinar | A recorded session. Consider whether this belongs under Events instead. |

### `ResourceCategory`

> **Enum description:** The single best home for this resource, used by the "Browse by Category" sidebar. Pick one. Everything else it touches belongs in Tags.

| API ID | Display name | Description |
|---|---|---|
| `ivf_basics` | IVF Basics | Starting points for someone new to all of this. |
| `ovulation_hormones` | Ovulation & Hormones | Cycles, ovulation, and what hormones do. |
| `treatments_procedures` | Treatments & Procedures | What actually happens during a treatment or procedure. |
| `tests_diagnosis` | Tests & Diagnosis | Tests, results, and what the numbers mean. |
| `fertility_conditions` | Fertility Conditions | PCOS, endometriosis, and other diagnoses. |
| `male_fertility` | Male Fertility | Anything centred on sperm health or the male partner. |
| `pregnancy_after_ivf` | Pregnancy After IVF | What comes after a positive test. |
| `emotional_wellbeing` | Emotional Wellbeing | Coping, mental health and support. |
| `lifestyle_nutrition` | Lifestyle & Nutrition | Food, movement, sleep, supplements. |
| `finances_insurance` | Finances & Insurance | Costs, funding, insurance and what's included in a quote. |
| `donor_surrogacy` | Donor & Surrogacy | Donor conception, surrogacy and the decisions involved. |

### `Treatment`

> **Enum description:** Treatments an Educational Clinic Partner offers. Only tick what the clinic actually provides — people filter on these, and a wrong tick sends someone to the wrong place.

| API ID | Display name | Description |
|---|---|---|
| `ivf` | IVF | Standard in vitro fertilisation cycles. |
| `icsi` | ICSI | A single sperm injected directly into an egg. |
| `iui` | IUI | Intrauterine insemination. |
| `egg_freezing` | Egg Freezing | Freezing eggs for later use. |
| `egg_donation` | Egg Donation | Donor egg programmes. |
| `sperm_donation` | Sperm Donation | Donor sperm programmes. |
| `embryo_donation` | Embryo Donation | Donated embryo programmes. |
| `surrogacy` | Surrogacy | Surrogacy arrangements. Legality varies enormously by country. |
| `genetic_testing` | Genetic Testing | Genetic screening and counselling. |
| `fertility_preservation` | Fertility Preservation | Preserving fertility, often before medical treatment. |
| `recurrent_miscarriage` | Recurrent Miscarriage | Investigation and care after repeated loss. |
| `lgbtq_family_building` | LGBTQ+ Family Building | Reciprocal IVF and services for same-sex and trans parents. |
| `pgt_a` | PGT-A | Genetic testing of embryos before transfer. |

### `EventType`

> **Enum description:** The shape of the session, shown as a badge on the card.

| API ID | Display name | Description |
|---|---|---|
| `webinar` | Webinar | One or two speakers presenting, usually with questions at the end. |
| `live_qa` | Live Q&A | Mostly audience questions, answered live. |
| `panel_discussion` | Panel Discussion | Several speakers in conversation. |
| `workshop` | Workshop | Hands-on and participatory rather than a talk. |

### `ProductSource`

> **Enum description:** Who is behind this product. This drives the disclosure shown to readers, so it has to be accurate.

| API ID | Display name | Description |
|---|---|---|
| `own` | Made by us | Something Henry & Precious created. Set a price and use "Global Fertility Hub" as the vendor. |
| `affiliate` | Recommended by us | Someone else's product. The card will say so and the link is marked as an affiliate link. Leave Price empty. |

### `ProductFormat`

> **Enum description:** What someone actually receives. Sets the icon on the card.

| API ID | Display name | Description |
|---|---|---|
| `ebook` | Ebook | A book delivered as a file. |
| `guide` | Guide | A shorter written guide, often free. |
| `workbook` | Workbook | Something to fill in or print. |
| `course` | Course | A structured set of lessons. |
| `audio` | Audio | Recordings to listen to. |
| `bundle` | Bundle | Several products sold together. |
| `physical` | Physical item | Something posted, or an app or subscription bought elsewhere. |

### `ProductCategory`

> **Enum description:** Where this sits in the store sidebar. Pick the one place a person would look for it.

| API ID | Display name | Description |
|---|---|---|
| `guides_and_books` | Guides & Books | Things to read. |
| `planning_and_tracking` | Planning & Tracking | Tools for keeping track — journals, planners, apps. |
| `nutrition` | Nutrition | Food, supplements and related products. |
| `emotional_wellbeing` | Emotional Wellbeing | Support for the emotional side. |
| `for_partners` | For Partners | Made for the person who isn't having the treatment. |
| `gifts_and_comfort` | Gifts & Comfort | Things to send someone going through this. |

### `StoryCategory`

> **Enum description:** The one badge shown on a story card, and the chip people filter by. Choose the thing the story is most *about*, not everything it touches — Tags handle the rest.

| API ID | Display name | Description |
|---|---|---|
| `ivf` | IVF | The story centres on going through IVF. |
| `male_fertility` | Male Fertility | Told from the male partner's side, or about a male-factor diagnosis. |
| `pregnancy_loss` | Pregnancy Loss | Miscarriage, ectopic pregnancy or recurrent loss. Review with extra care. |
| `pcos` | PCOS | Living with PCOS while trying to conceive. |
| `endometriosis` | Endometriosis | Living with endometriosis while trying to conceive. |
| `success_stories` | Success Stories | Ends with a pregnancy or a baby. Use only when that's genuinely the subject. |
| `lgbtq` | LGBTQ+ | Same-sex, single or trans parenthood. |
| `donor_conception` | Donor Conception | Conceiving with donor eggs, sperm or embryos. |
| `international_ivf` | International IVF | Travelling to another country for treatment. |

---

## 2. Components

Hygraph **components** are reusable field groups — the equivalent of our nested data structures. Create these under **Schema → Components**.

### `Author`

> **Component description:** Who wrote a resource. Shown under the title and used in the article's search-engine data.

| Field | Type | API ID | Required | Description |
|---|---|---|---|---|
| Name | Single line text | `name` | Yes | The writer's name as it should appear publicly. |
| Role | Single line text | `role` | | Their title, e.g. "Fertility Educator". Helps readers judge who's speaking. |
| Avatar | Asset | `avatar` | | Optional headshot. |

### `StoryAuthor`

> **Component description:** Who shared this story. **"Anonymous" is a completely normal value here** — many contributors choose it, and it must be respected exactly as they asked.

| Field | Type | API ID | Required | Description |
|---|---|---|---|---|
| Name | Single line text | `name` | Yes | The name the contributor asked to be published under. Type "Anonymous" if they preferred not to be named. |
| Country | Single line text | `country` | | Country only — never a city, hospital or anything that could identify them. |
| Avatar | Asset | `avatar` | | Only if the contributor supplied one and agreed to it being shown. |

### `ClinicTeamMember`

> **Component description:** A named person at a partner clinic. Only add people the clinic has asked to be listed.

| Field | Type | API ID | Required | Description |
|---|---|---|---|---|
| Name | Single line text | `name` | Yes | Full name including title, e.g. "Dr Eleanor Whitfield". |
| Role | Single line text | `role` | Yes | Their role at the clinic. |
| Photo | Asset | `photo` | | Optional headshot supplied by the clinic. |
| Bio | Multi line text | `bio` | | A short paragraph. Keep it factual — no claims about outcomes. |

### `PartnerBenefit`

> **Component description:** What this partner contributes to education. This is what justifies their place on the site, so be concrete: "monthly open education evenings", not "committed to patient care".

| Field | Type | API ID | Required | Description |
|---|---|---|---|---|
| Title | Single line text | `title` | Yes | A short label, e.g. "Open education evenings". |
| Description | Multi line text | `description` | Yes | One or two sentences on what it actually is and who can access it. |

### `EventSpeaker`

> **Component description:** Someone appearing at an event. Listed on the card and the event page.

| Field | Type | API ID | Required | Description |
|---|---|---|---|---|
| Name | Single line text | `name` | Yes | Full name including title. |
| Role | Single line text | `role` | Yes | What they do, e.g. "Lead Embryologist". |
| Organisation | Single line text | `organisation` | | Where they work, if relevant. |
| Photo | Asset | `photo` | | Optional headshot. |

### `EventDownload`

> **Component description:** A file made available after an event — slides, a handout, a resource list.

| Field | Type | API ID | Required | Description |
|---|---|---|---|---|
| Label | Single line text | `label` | Yes | What the file is, e.g. "Slides". |
| URL | Single line text | `url` | Yes | Direct link to the file. |
| Meta | Single line text | `meta` | | Type and size so people know before clicking, e.g. "PDF · 2.4 MB". |

### `Faq`

> **Component description:** A question people genuinely ask, with a straight answer. Write the question the way someone would actually ask it.

| Field | Type | API ID | Required | Description |
|---|---|---|---|---|
| Question | Single line text | `question` | Yes | In the reader's words, e.g. "Are you doctors?". |
| Answer | Multi line text | `answer` | Yes | Plain, honest, and never implying medical advice. |

### `AvailabilityDay` — only if availability moves to Hygraph (see §6)

> **Component description:** One day of bookable consultation slots. Times are stored as exact moments so the site can show them correctly to someone in any country.

| Field | Type | API ID | Required | Description |
|---|---|---|---|---|
| Date | Date | `date` | Yes | The day, in Henry & Precious's own timezone. |
| Start times | Date and time, **list** | `starts` | Yes | Each slot's start. Check the timezone carefully — an error here means someone books a time that doesn't exist. |

---

## 3. Models

### `Resource`

> **Model description:** A piece of free educational content — articles, guides, videos and downloads. This is the heart of the site. Nothing here is medical advice, and copy should help people understand and ask better questions rather than tell them what to do.

| Field | Type | API ID | Required | Description |
|---|---|---|---|---|
| Title | Single line text | `title` | Yes | Clear and plain. What someone would search for. |
| Slug | Slug | `slug` | Yes, unique | The web address. Generated from the title — **don't change it once published**, or existing links break. |
| Excerpt | Multi line text | `excerpt` | Yes | One or two sentences. Used on cards *and* as the search-engine description, so make it stand alone. |
| Body | Rich text | `body` | Yes | The article. Use Heading 2 for sections — the page supplies the main heading. |
| Format | Enumeration → `ResourceFormat` | `format` | Yes | What kind of thing this is. |
| Category | Enumeration → `ResourceCategory` | `category` | Yes | Its one home in the sidebar. |
| Tags | Enumeration → `FertilityTopic`, list | `tags` | Yes | **At least one.** Tags are how this connects to related stories, events and partners — a resource with no tags appears nowhere else on the site. |
| Author | Component → `Author` | `author` | Yes | Who wrote it. |
| Reading time | Number (integer) | `readingTime` | Yes | Minutes, rounded. Roughly 200 words per minute for reading, or the actual length for a video. |
| Published at | Date | `publishedAt` | Yes | The date shown to readers. Not the same as when it was created. |
| Cover image | Asset | `coverImage` | | Shown on the card and at the top of the article. |
| Is new | Boolean | `isNew` | | Shows a "New" pill on the card. Remember to untick it after a few weeks. |
| Is featured | Boolean | `isFeatured` | | Prefers this for the homepage. The homepage fills any gaps automatically, so this is a nudge rather than a guarantee. |
| Download URL | Single line text | `downloadUrl` | | For Download format — the link to the file. |
| Video URL | Single line text | `videoUrl` | | For Video or Webinar format. |

### `Story`

> **Model description:** Someone's real fertility journey, in their own words. **Publishing is the review step** — a story stays invisible to the public until you publish it, so take the time to read it properly first. Check that nothing identifies anyone who didn't consent, and respect exactly how the contributor asked to be named.

| Field | Type | API ID | Required | Description |
|---|---|---|---|---|
| Title | Single line text | `title` | Yes | The contributor's own framing wherever possible. |
| Slug | Slug | `slug` | Yes, unique | The web address. Don't change it after publishing. |
| Category | Enumeration → `StoryCategory` | `category` | Yes | The badge on the card and the chip people filter by. |
| Preview | Multi line text | `preview` | Yes | One or two sentences for the card. Honest, never sensational. |
| Body | Rich text | `body` | Yes | Their words. Edit only lightly, for clarity or length — never to make it more dramatic. |
| Tags | Enumeration → `FertilityTopic`, list | `tags` | Yes | At least one. Connects the story to related content. |
| Author | Component → `StoryAuthor` | `author` | Yes | How they asked to be credited. |
| Published at | Date | `publishedAt` | Yes | The date shown on the story. |
| Reading time | Number (integer) | `readingTime` | Yes | Minutes, rounded. |
| Cover image | Asset | `coverImage` | | Choose something gentle. Avoid baby imagery on loss stories. |
| Is featured | Boolean | `isFeatured` | | Prefers this story for the homepage. |

> There is no "status" field. **Draft means unreviewed; Published means live.**

### `Clinic`

> **Model description:** An Educational Clinic Partner. We showcase clinics that share our commitment to education — **we never rank, rate, score or recommend them.** Copy here describes what a clinic offers and contributes; it must never suggest one clinic is better than another.
>
> **Do not add a rating, score, star or review field to this model, ever.** If someone asks for one, that's a conversation about the whole product, not a schema change.

| Field | Type | API ID | Required | Description |
|---|---|---|---|---|
| Name | Single line text | `name` | Yes | The clinic's official name. |
| Slug | Slug | `slug` | Yes, unique | The web address. |
| Intro | Multi line text | `intro` | Yes | A neutral sentence or two on what they do and how they support education. No superlatives. |
| Country | Single line text | `country` | Yes | Full country name, e.g. "United Kingdom". |
| Country code | Single line text | `countryCode` | Yes | Two-letter code in capitals, e.g. GB, AU, NG. Draws the flag on the card. |
| City | Single line text | `city` | Yes | The city they're based in. |
| Treatments | Enumeration → `Treatment`, list | `treatments` | Yes | Only what they genuinely offer — people filter on this. |
| Specialties | Single line text, list | `specialties` | | Areas of particular focus, one per entry. |
| Languages | Single line text, list | `languages` | | Languages patients can be seen in. Matters a lot to international readers. |
| Services | Single line text, list | `services` | | What's available, in plain language. |
| Team | Component → `ClinicTeamMember`, list | `team` | | Named staff the clinic has asked to be listed. |
| Partner benefits | Component → `PartnerBenefit`, list | `partnerBenefits` | | What they contribute to education. Be specific. |
| Website | Single line text | `website` | Yes | Full address including https://. |
| Contact email | Single line text | `contactEmail` | | A public enquiries address only. |
| Contact phone | Single line text | `contactPhone` | | Include the country code. |
| Tags | Enumeration → `FertilityTopic`, list | `tags` | Yes | Topics this partner is relevant to. |
| Logo | Asset | `logo` | | Their logo, ideally with a transparent background. |
| Cover image | Asset | `coverImage` | | A photo of the clinic they've given us permission to use. |
| Is featured | Boolean | `isFeatured` | | Prefers this partner for the homepage. **This is not a ranking** — it rotates. |
| Joined at | Date | `joinedAt` | Yes | When they became a partner. Orders the "Recently Added" view. |

### `Event`

> **Model description:** A webinar, Q&A, panel or workshop. The site works out whether an event is upcoming or a replay on its own — you never have to move it. Add a Replay URL after it runs and it appears in the Replay Library automatically.

| Field | Type | API ID | Required | Description |
|---|---|---|---|---|
| Title | Single line text | `title` | Yes | What the session is called. |
| Slug | Slug | `slug` | Yes, unique | The web address. |
| Type | Enumeration → `EventType` | `type` | Yes | The shape of the session. |
| Description | Multi line text | `description` | Yes | What it covers and who it's for. |
| Starts at | Date and time | `startsAt` | Yes | The exact start. **Check this carefully** — the site shows every reader their own local time based on it. |
| Timezone | Single line text | `timezone` | Yes | The zone the event is hosted in, written like `Australia/Perth` or `Europe/London`. Not "AWST" and not "+8". |
| Duration minutes | Number (integer) | `durationMinutes` | Yes | How long the session runs. |
| Speakers | Component → `EventSpeaker`, list | `speakers` | | Who's appearing. |
| Tags | Enumeration → `FertilityTopic`, list | `tags` | Yes | Topics covered. Connects the event to related content. |
| Image | Asset | `image` | | Shown on the card and the event page. |
| Registration URL | Single line text | `registrationUrl` | | Where people sign up. Leave empty and the button points at our contact form. |
| Replay URL | Single line text | `replayUrl` | | **Add this after the event runs.** Filling it in moves the event into the Replay Library on its own. |
| Transcript | Multi line text | `transcript` | | A written version, or a note that one is available. Helps people who can't watch. |
| Slides URL | Single line text | `slidesUrl` | | Link to the slides, if the speaker agreed to share them. |
| Downloads | Component → `EventDownload`, list | `downloads` | | Any other files from the session. |
| Is featured | Boolean | `isFeatured` | | Prefers this event for the homepage. |

### `Product`

> **Model description:** Something in the store — either made by Henry & Precious, or recommended by us. We never take payment on this site; every product links out to wherever it's actually sold.
>
> **Nothing here may claim to affect fertility.** Describe what a product *is* and who it's for — never that it improves chances, boosts fertility, treats anything or is proven to work. That's a legal problem as well as an editorial one, and the build will fail a check if it happens.

| Field | Type | API ID | Required | Description |
|---|---|---|---|---|
| Name | Single line text | `name` | Yes | The product's name. |
| Slug | Slug | `slug` | Yes, unique | The web address. |
| Excerpt | Multi line text | `excerpt` | Yes | One sentence for the card. What it is, plainly. |
| Body | Rich text | `body` | Yes | A fuller description. Say what it is and who it suits — including who it won't suit. |
| Source | Enumeration → `ProductSource` | `source` | Yes | Ours or someone else's. Drives the disclosure readers see. |
| Format | Enumeration → `ProductFormat` | `format` | Yes | What someone receives. |
| Category | Enumeration → `ProductCategory` | `category` | Yes | Where it sits in the store sidebar. |
| Tags | Enumeration → `FertilityTopic`, list | `tags` | Yes | Topics it relates to. Also decides which free articles we offer alongside it. |
| Price | Number (float) | `price` | | Only for our own products. **Leave empty for recommended products** — we don't control what another shop charges, and a wrong price is a real problem. |
| Currency | Single line text | `currency` | | AUD, USD or GBP. Only needed when there's a price. |
| Is free | Boolean | `isFree` | | Shows "Free" instead of a price. |
| External URL | Single line text | `externalUrl` | Yes | Where someone actually buys or downloads it. |
| Vendor | Single line text | `vendor` | Yes | Who sells it. Use "Global Fertility Hub" for our own products. |
| Includes | Single line text, list | `includes` | | What they get, one per entry: "180-page PDF", "6 audio sessions". |
| Cover image | Asset | `coverImage` | | Product image or cover. |
| Published at | Date | `publishedAt` | Yes | When it went on sale. |
| Is featured | Boolean | `isFeatured` | | Prefers this product for prominent placement. |
| Is new | Boolean | `isNew` | | Shows a "New" pill. Untick after a few weeks. |

### `Discount`

> **Model description:** An exclusive code from a partner brand. If we earn anything when someone uses a code, that must be declared — readers are told before they click, not after.

| Field | Type | API ID | Required | Description |
|---|---|---|---|---|
| Brand | Single line text | `brand` | Yes | The brand's name as they write it. |
| Description | Multi line text | `description` | Yes | What they sell, in one sentence. No health claims. |
| Percent off | Number (integer) | `percentOff` | Yes | Just the number — 20 shows as "20% OFF". |
| Code | Single line text | `code` | Yes | Capitals and numbers only. Avoid characters that look alike, like O and 0. |
| Redeem URL | Single line text | `redeemUrl` | Yes | Where the code is used. |
| Category | Single line text | `category` | | One of: app, testing, supplements, products, coaching. |
| Is affiliate | Boolean | `isAffiliate` | | **Tick this if we earn anything from the code.** It adds a short disclosure to the card. |
| Logo | Asset | `logo` | | The brand's logo. |

### `ConsultationType`

> **Model description:** A session people can book with Henry & Precious. These are **support and advocacy, never medical care** — copy must never suggest diagnosis, treatment or clinical guidance.

| Field | Type | API ID | Required | Description |
|---|---|---|---|---|
| Name | Single line text | `name` | Yes | What the session is called, e.g. "Couple Session". |
| Description | Multi line text | `description` | Yes | Who it's for and what happens. Support and advocacy language only. |
| Audience | Single line text | `audience` | Yes | One of: one-on-one, couple, follow-up. |
| Duration minutes | Number (integer) | `durationMinutes` | Yes | How long the session runs. |
| Price | Number (float) | `price` | Yes | The fee. Shown before anyone books. |
| Currency | Single line text | `currency` | Yes | e.g. AUD. |
| Sort order | Number (integer) | `sortOrder` | | Lower numbers appear first. |

### `ConsultationFaq`

> **Model description:** Questions people ask before booking. The first few set expectations about what these sessions are and aren't — that framing is the most important copy on the page.

| Field | Type | API ID | Required | Description |
|---|---|---|---|---|
| Question | Single line text | `question` | Yes | As someone would actually ask it. |
| Answer | Multi line text | `answer` | Yes | Honest and plain. Never implies medical advice. |
| Sort order | Number (integer) | `sortOrder` | | Lower numbers appear first. |

---

## 4. Assets

Hygraph's built-in `Asset` model needs one addition.

| Field | Type | API ID | Required | Description |
|---|---|---|---|---|
| Alt text | Single line text | `altText` | **Yes** | Describe what's in the image for people who can't see it, e.g. "A couple sitting together on a sofa, smiling". Don't write "image of" — just describe it. Leave decorative background images blank only if the page already explains them. |

Making this required is the only reliable way to keep every image on the site accessible once content is written by people rather than developers.

---

## 5. Relation fields — do this last

Both models must exist before you can create a relation. None are needed for launch, but they let editors curate relationships instead of relying purely on tag overlap.

| From | Field | To | Type | Description |
|---|---|---|---|---|
| `Resource` | `relatedResources` | `Resource` | Many-to-many | Hand-pick articles to show alongside this one. Leave empty and the site chooses by shared tags. |
| `Resource` | `relatedClinics` | `Clinic` | Many-to-many | Partners particularly relevant to this topic. |
| `Event` | `relatedResources` | `Resource` | Many-to-many | Reading to go with this session. |
| `Clinic` | `featuredResources` | `Resource` | Many-to-many | Content this partner contributed or is connected to. |

Until populated, `lib/relations.ts` computes everything from tag overlap. The code should prefer a curated relation when present and fall back to tags otherwise.

---

## 6. Availability — decide before building

`AvailabilityDay` is defined in §2 but **not attached to any model yet**, because it's an open question:

- **In Hygraph:** the client edits their own availability. Convenient, but a mistyped slot means someone books a time that doesn't exist, and timezone entry is easy to get wrong.
- **Stays in code or Convex:** safer, but every change needs a developer.

Recommendation: leave availability out of Hygraph for now.

---

## 7. Rich text

Hygraph's Rich Text field returns several representations of the same content, including markdown.

**Request markdown.** Our `Prose` renderer already handles headings, lists, emphasis and links with a safe-scheme allowlist, and it's tested. Taking the JSON AST instead means writing a new renderer for no gain we currently need.

Enable in the field's settings: **headings 2 and 3 only** (heading 1 belongs to the page), bold, italic, lists, links. **Turn off** tables, images-in-body and code blocks — nothing in the design supports them, and leaving them on invites layouts we can't render.

---

## 8. After the schema exists

1. Create a **read-only PAT** scoped to `PUBLISHED` on every content model. That's the site's token.
2. Create a second PAT with `DRAFT` read access for preview mode. Keep them separate.
3. Add both to `.env.local` and the host's environment.
4. Add Hygraph's asset domain to `next.config.ts` `remotePatterns`.
5. Add Hygraph to the privacy policy's subprocessor list.
6. Repoint `scripts/verify-data.cjs` at the API. **The checks that must survive:** unique slugs, every record has at least one tag, no clinic has a rating field, no product copy makes a health claim, every image has alt text.
