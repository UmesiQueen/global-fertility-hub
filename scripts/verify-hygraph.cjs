/**
 * Live content check.
 *
 * Runs every Hygraph query, then asserts the invariants that must hold no
 * matter what the editors publish: unique kebab-case slugs, tags inside the
 * controlled vocabulary, alt text on every image, no ranking field anywhere
 * near a clinic, only approved stories reaching the site, and no product copy
 * claiming to affect fertility.
 *
 * A query failure names the exact field — "Field 'readingTime' doesn't exist
 * on type 'Resource'" — which is far more useful than a blank page later.
 *
 * Counts are reported, never asserted. "8 products" was a fact about mock
 * data; it would be noise now.
 *
 *   node scripts/verify-hygraph.cjs
 */

const fs = require('fs'), path = require('path'), Module = require('module');
const ROOT = process.cwd();
const ts = require(ROOT + '/node_modules/typescript');

// ---- .env.local
const envPath = path.join(ROOT, '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

// ---- transpile TS on require, resolve @/ aliases
require.extensions['.ts'] = (mod, file) => {
  mod._compile(
    ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
      fileName: file,
    }).outputText,
    file,
  );
};
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (req, ...rest) {
  if (req.startsWith('@/')) {
    const base = path.join(ROOT, req.slice(2));
    for (const c of [base + '.ts', base + '.tsx', path.join(base, 'index.ts')]) {
      if (fs.existsSync(c)) return c;
    }
  }
  return origResolve.call(this, req, ...rest);
};

// Next's `next: { revalidate }` option doesn't exist in plain node.
const nativeFetch = global.fetch;
global.fetch = (url, init = {}) => {
  const { next: _ignored, ...rest } = init;
  return nativeFetch(url, rest);
};

const fail = [], ok = [];
const check = (cond, msg) => (cond ? ok : fail).push(msg);

(async () => {
  console.log(`endpoint: ${process.env.NEXT_HYGRAPH_ENDPOINT || 'NOT SET'}`);
  console.log(`token:    ${process.env.HYGRAPH_AUTH_TOKEN ? 'set' : 'NOT SET'}\n`);

  const api = require(ROOT + '/api/index.ts');

  // ---- every query must be valid against the schema ----
  const fetched = {};
  for (const [name, run] of [
    ['resources', api.fetchResources],
    ['stories', api.fetchStories],
    ['clinics', api.fetchClinics],
    ['events', api.fetchEvents],
    ['products', api.fetchProducts],
    ['discounts', api.fetchDiscounts],
    ['consultationTypes', api.fetchConsultationTypes],
    ['consultationFaqs', api.fetchConsultationFaqs],
  ]) {
    try {
      fetched[name] = await run();
      check(true, `${name} query valid (${fetched[name].length} published)`);
    } catch (error) {
      fetched[name] = null;
      fail.push(`${name} query FAILED -> ${error.message}`);
    }
  }

  // If the transport itself is broken there's nothing further worth saying.
  if (Object.values(fetched).every(v => v === null)) {
    console.log('\n--- FAIL ---');
    fail.forEach(m => console.log('  FAIL', m));
    console.log('\nCheck NEXT_HYGRAPH_ENDPOINT and HYGRAPH_AUTH_TOKEN in .env.local.');
    process.exit(1);
  }

  const { resources: res, stories: sto, clinics: cli, events: evt, products: prd, discounts: dsc } = fetched;
  const R = require(ROOT+'/lib/repositories/resources.ts');
  const C = require(ROOT+'/lib/repositories/clinics.ts');
  const S = require(ROOT+'/lib/repositories/stories.ts');
  const E = require(ROOT+'/lib/repositories/events.ts');
  const P = require(ROOT+'/lib/repositories/products.ts');
  const D = require(ROOT+'/lib/repositories/discounts.ts');
  const MD = require(ROOT+'/lib/markdown.ts');
  const SEO = require(ROOT+'/lib/seo.ts');
  const { FERTILITY_TOPICS, TOPIC_LABELS } = require(ROOT+'/types/shared.ts');
  const { RESOURCE_CATEGORIES } = require(ROOT+'/types/resource.ts');
  const { PRODUCT_CATEGORIES } = require(ROOT+'/types/product.ts');

  const entities = [['resource',res],['clinic',cli],['story',sto],['event',evt],['product',prd]]
    .filter(([, arr]) => arr && arr.length);

  // ---- identity ----
  for (const [name, arr] of entities) {
    const slugs = arr.map(x=>x.slug), ids = arr.map(x=>x.id);
    check(new Set(slugs).size===slugs.length, `${name} slugs unique`);
    check(new Set(ids).size===ids.length, `${name} ids unique`);
    const badSlugs = slugs.filter(s=>!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s));
    check(badSlugs.length===0, `${name} slugs are kebab-case${badSlugs.length?' -> '+badSlugs:''}`);
  }

  // ---- controlled vocabularies ----
  // Hygraph enums use underscores; api/map.ts converts them. A mismatch here
  // means an enum was added in the CMS without a matching union member.
  const topics = new Set(FERTILITY_TOPICS);
  for (const [name, arr] of entities) {
    const badTags = arr.flatMap(x=>(x.tags||[]).filter(t=>!topics.has(t)));
    check(badTags.length===0, `${name} tags all in FertilityTopic${badTags.length?' -> '+[...new Set(badTags)]:''}`);
    const untagged = arr.filter(x=>!x.tags||!x.tags.length).map(x=>x.slug);
    check(untagged.length===0, `${name}: every record has >=1 tag (relations depend on it)${untagged.length?' -> '+untagged:''}`);
  }
  check(Object.keys(TOPIC_LABELS).length===FERTILITY_TOPICS.length, 'TOPIC_LABELS covers every topic');
  if (res) {
    const badCat = res.filter(r=>!RESOURCE_CATEGORIES.includes(r.category)).map(r=>r.slug);
    check(badCat.length===0, `resource categories valid${badCat.length?' -> '+badCat:''}`);
  }
  if (sto) {
    const valid = new Set(S.STORY_CATEGORIES);
    const bad = sto.filter(s=>!valid.has(s.category)).map(s=>s.slug);
    check(bad.length===0, `story categories match the 9 filter chips${bad.length?' -> '+bad:''}`);
  }
  if (prd) {
    const bad = prd.filter(p=>!PRODUCT_CATEGORIES.includes(p.category)).map(p=>p.slug);
    check(bad.length===0, `product categories valid${bad.length?' -> '+bad:''}`);
  }

  // ---- accessibility: alt text survives the round trip through the CMS ----
  const images = [
    ...(res||[]).map(r=>['resource:'+r.slug,r.coverImage]),
    ...(sto||[]).map(s=>['story:'+s.slug,s.coverImage]),
    ...(evt||[]).map(e=>['event:'+e.slug,e.image]),
    ...(cli||[]).flatMap(c=>[['clinic:'+c.slug,c.coverImage],['clinic-logo:'+c.slug,c.logo]]),
    ...(prd||[]).map(p=>['product:'+p.slug,p.coverImage]),
    ...(dsc||[]).map(d=>['discount:'+d.id,d.logo]),
  ];
  const noAlt = images.filter(([,i])=>!i||!i.alt).map(([id])=>id);
  check(noAlt.length===0, `every image has alt text${noAlt.length?` (${noAlt.length} missing -> ${noAlt.slice(0,5)})`:''}`);

  // ---- the client's hardest constraint: partners are never ranked ----
  if (cli) {
    const ranked = cli.filter(c=>'rating' in c||'score' in c||'rank' in c||'reviews' in c).map(c=>c.slug);
    check(ranked.length===0, `no clinic carries a rating/score/rank/review field${ranked.length?' -> '+ranked:''}`);
    check(cli.every(c=>c.isEducationalPartner===true), 'every clinic flagged isEducationalPartner');
    const byName = await C.getClinics({sort:'name',pageSize:999});
    check(byName.items.every((x,i,a)=>i===0||a[i-1].name.localeCompare(x.name)<=0),'name sort is alphabetical');
  }

  // ---- the story approval gate ----
  if (sto) {
    const listed = await S.getStories({pageSize:999});
    check(listed.items.every(s=>s.status==='approved'), 'listing returns only approved stories');
  }

  // ---- events: the upcoming/replay split is derived and exhaustive ----
  if (evt && evt.length) {
    const now = new Date();
    const up = await E.getUpcomingEvents({pageSize:999, now});
    const rp = await E.getReplayLibrary({pageSize:999, now});
    check(up.total+rp.total===evt.length, `upcoming(${up.total})+replay(${rp.total})===total(${evt.length})`);
    const ids = new Set(up.items.map(e=>e.id));
    check(rp.items.every(e=>!ids.has(e.id)), 'no event appears in both tabs');
    check(up.items.every(e=>new Date(e.startsAt)>now), 'every upcoming event is in the future');
    check(up.items.every((e,i,a)=>i===0||a[i-1].startsAt<=e.startsAt), 'upcoming sorted soonest-first');
    check(evt.every(e=>e.timezone&&e.startsAt&&e.durationMinutes>0), 'every event has a timezone, start and duration');
  }

  // ---- dates ----
  const dated = [...(res||[]),...(sto||[]),...(prd||[])];
  const badDates = dated.filter(x=>!/^\d{4}-\d{2}-\d{2}$/.test(x.publishedAt)).map(x=>x.slug);
  check(badDates.length===0, `publishedAt is ISO yyyy-mm-dd everywhere${badDates.length?' -> '+badDates:''}`);
  const today = new Date().toISOString().slice(0,10);
  const future = dated.filter(x=>x.publishedAt>today).map(x=>x.slug);
  check(future.length===0, `nothing is dated in the future${future.length?' -> '+future:''}`);
  if (res) {
    const badRt = res.filter(r=>!Number.isInteger(r.readingTime)||r.readingTime<1||r.readingTime>60).map(r=>r.slug);
    check(badRt.length===0, `reading times are sane integers 1-60${badRt.length?' -> '+badRt:''}`);
  }

  // ---- rich text arrives as markdown and survives parsing ----
  const bodies = [
    ...(res||[]).map(r=>['resource:'+r.slug,r.body]),
    ...(sto||[]).map(s=>['story:'+s.slug,s.body]),
    ...(prd||[]).map(p=>['product:'+p.slug,p.body]),
  ];
  const emptyBody = bodies.filter(([,b])=>!b||!MD.parseMarkdown(b).length).map(([id])=>id);
  check(emptyBody.length===0, `every body parses to >=1 block (${bodies.length} bodies)${emptyBody.length?' -> '+emptyBody.slice(0,5):''}`);
  const withH1 = bodies.filter(([,b])=>b&&/^#\s/m.test(b)).map(([id])=>id);
  check(withH1.length===0, `no body opens a level-1 heading (would duplicate the page h1)${withH1.length?' -> '+withH1.slice(0,5):''}`);

  // ---- every generateStaticParams slug must resolve ----
  for (const [name, getSlugs, getBySlug] of [
    ['resource', R.getAllResourceSlugs, R.getResourceBySlug],
    ['clinic', C.getAllClinicSlugs, C.getClinicBySlug],
    ['story', S.getAllStorySlugs, S.getStoryBySlug],
    ['event', E.getAllEventSlugs, E.getEventBySlug],
    ['product', P.getAllProductSlugs, P.getProductBySlug],
  ]) {
    const slugs = await getSlugs();
    const resolved = await Promise.all(slugs.map(s=>getBySlug(s)));
    check(resolved.every(Boolean), `every ${name} slug resolves to a record (${slugs.length})`);
    check(await getBySlug('definitely-not-a-real-slug')===null, `unknown ${name} slug returns null, not undefined`);
  }

  // ---- relations: never self-referential, never all-empty ----
  const emptyRails = [], selfRefs = [];
  for (const r of (res||[])) {
    const [a,b,c] = await Promise.all([R.getRelatedResources(r),R.getRelatedClinicsForResource(r),R.getRelatedEventsForResource(r)]);
    if (a.some(x=>x.id===r.id)) selfRefs.push('resource:'+r.slug);
    if (a.length+b.length+c.length===0) emptyRails.push('resource:'+r.slug);
  }
  for (const s of (sto||[])) {
    const [a,b,c,d] = await Promise.all([S.getSimilarStories(s),S.getRelatedResourcesForStory(s),S.getRelatedEventsForStory(s),S.getRelatedClinicsForStory(s)]);
    if (a.some(x=>x.id===s.id)) selfRefs.push('story:'+s.slug);
    if (a.length+b.length+c.length+d.length===0) emptyRails.push('story:'+s.slug);
  }
  for (const c of (cli||[])) {
    const [a,b] = await Promise.all([C.getRelatedResourcesForClinic(c),C.getRelatedEventsForClinic(c)]);
    if (a.length+b.length===0) emptyRails.push('clinic:'+c.slug);
  }
  for (const e of (evt||[])) {
    const [a,b,c] = await Promise.all([E.getRelatedEvents(e),E.getRelatedResourcesForEvent(e),E.getRelatedClinicsForEvent(e)]);
    if (a.some(x=>x.id===e.id)) selfRefs.push('event:'+e.slug);
    if (a.length+b.length+c.length===0) emptyRails.push('event:'+e.slug);
  }
  check(selfRefs.length===0, `no relation list contains its own source${selfRefs.length?' -> '+selfRefs:''}`);
  // A single record with a rare tag combination will trip this. The fix is
  // usually a second, genuinely accurate tag in the CMS — not a code change.
  check(emptyRails.length===0, `every detail page has at least one related rail${emptyRails.length?' -> '+emptyRails.slice(0,8).join(', '):''}`);

  // ---- meta descriptions ----
  const noDesc = [
    ...(res||[]).filter(r=>((r.excerpt||MD.markdownToPlainText(r.body,155))||'').length<20).map(r=>'resource:'+r.slug),
    ...(sto||[]).filter(s=>((s.preview||MD.markdownToPlainText(s.body,155))||'').length<20).map(s=>'story:'+s.slug),
    ...(cli||[]).filter(c=>!c.intro||c.intro.length<20).map(c=>'clinic:'+c.slug),
    ...(evt||[]).filter(e=>!e.description||e.description.length<20).map(e=>'event:'+e.slug),
    ...(prd||[]).filter(p=>!p.excerpt||p.excerpt.length<20).map(p=>'product:'+p.slug),
  ];
  check(noDesc.length===0, `every detail page has a usable meta description${noDesc.length?' -> '+noDesc.slice(0,5):''}`);
  const longDesc = (res||[]).filter(r=>r.excerpt&&r.excerpt.length>200).map(r=>'resource:'+r.slug);
  check(longDesc.length===0, `no excerpt runs past ~200 chars${longDesc.length?' -> '+longDesc:''}`);

  // ---- JSON-LD ----
  const first = { resource: (res||[])[0], event: (evt||[])[0], clinic: (cli||[])[0], story: (sto||[])[0] };
  for (const [name, builder, record] of [
    ['resource', SEO.resourceJsonLd, first.resource],
    ['event', SEO.eventJsonLd, first.event],
    ['clinic', SEO.clinicJsonLd, first.clinic],
    ['story', SEO.storyJsonLd, first.story],
  ]) {
    if (!record) continue;
    let parsed = null;
    try { parsed = JSON.parse(JSON.stringify(builder(record))); } catch {}
    check(parsed && parsed['@context']==='https://schema.org' && parsed['@type'], `${name} JSON-LD is serialisable with @context/@type`);
  }
  if (first.event) {
    const ev = SEO.eventJsonLd(first.event);
    check(new Date(ev.endDate)>new Date(ev.startDate), 'event JSON-LD endDate is after startDate');
    check(ev.endDate.endsWith('Z'), 'event JSON-LD endDate is a valid ISO instant');
  }
  if (first.clinic) {
    const doc = JSON.stringify(SEO.clinicJsonLd(first.clinic));
    check(!/aggregateRating|reviewCount|ratingValue|"Review"/i.test(doc), 'clinic JSON-LD emits no rating or review markup');
    check(SEO.clinicJsonLd(first.clinic)['@type']==='Organization', 'clinic is typed Organization, not MedicalClinic');
  }

  // ---- store: no product may claim to affect fertility ----
  if (prd && prd.length) {
    const BANNED = [
      /\bcures?\b/i, /\btreats?\b/i,
      /boosts? (your )?fertility/i, /improves? (your )?fertility/i,
      /increases? (your )?(chances|odds)/i, /improves? (your )?(chances|odds)/i,
      /helps? you (get pregnant|conceive)/i,
      /guarantee/i, /proven to/i, /clinically proven/i,
      /\bremedy\b/i, /\bheals?\b/i,
    ];
    const claims = [];
    for (const p of prd) {
      const text = [p.name,p.excerpt,p.body].join(' ');
      for (const re of BANNED) if (re.test(text)) claims.push(`${p.slug}: ${re}`);
    }
    check(claims.length===0, `no product copy makes a fertility health claim${claims.length?' -> '+claims.join(', '):''}`);

    const own = prd.filter(p=>p.source==='own'), aff = prd.filter(p=>p.source==='affiliate');
    check(prd.every(p=>['own','affiliate'].includes(p.source)), 'every product source is own or affiliate');
    check(own.every(p=>p.isFree||typeof p.price==='number'), 'every own product has a price or is marked free');
    check(aff.every(p=>p.price===undefined), 'no affiliate product states a price we do not control');
    check(own.every(p=>p.isFree||p.currency), 'priced products declare a currency');
    const badUrls = prd.filter(p=>!/^https:\/\//.test(p.externalUrl||'')).map(p=>p.slug);
    check(badUrls.length===0, `every buy link is https${badUrls.length?' -> '+badUrls:''}`);

    // price sorting must not be corrupted by unpriced affiliate items
    const low = await P.getProducts({sort:'price-low',pageSize:999});
    const vals = low.items.filter(p=>p.isFree||typeof p.price==='number').map(p=>p.isFree?0:p.price);
    check(vals.every((v,i,a)=>i===0||a[i-1]<=v), `price-low sorts ascending (${vals.join(', ')})`);
    const unpriced = low.items.filter(p=>!p.isFree&&p.price===undefined).length;
    check(unpriced===0||low.items.slice(-unpriced).every(p=>p.price===undefined), 'unpriced items sort to the end, not the top');

    // every product page must be able to offer free reading on the topic
    const noFree = [];
    for (const p of prd) if ((await P.getRelatedResourcesForProduct(p)).length===0) noFree.push(p.slug);
    check(noFree.length===0, `every product can offer a free alternative${noFree.length?' -> '+noFree:''}`);
  }

  // ---- discounts: codes get read aloud and retyped ----
  if (dsc && dsc.length) {
    check(new Set(dsc.map(d=>d.id)).size===dsc.length, 'no duplicate discount ids');
    check(new Set(dsc.map(d=>d.code)).size===dsc.length, 'every discount code is unique');
    check(dsc.every(d=>d.brand&&d.description&&d.code&&d.redeemUrl), 'every offer has brand, description, code and URL');
    const badPct = dsc.filter(d=>!(d.percentOff>0&&d.percentOff<=100)).map(d=>d.brand);
    check(badPct.length===0, `every percentOff is a sane percentage${badPct.length?' -> '+badPct:''}`);
    check(dsc.every(d=>/^https:\/\//.test(d.redeemUrl)), 'every redeem URL is https');
    const badCode = dsc.filter(d=>!/^[A-Z0-9]{4,16}$/.test(d.code)).map(d=>d.code);
    check(badCode.length===0, `every code is 4-16 uppercase alphanumerics${badCode.length?' -> '+badCode:''}`);
    for (const c of await D.getDiscountCategories()) {
      const filtered = await D.getDiscounts(c);
      check(filtered.length>0&&filtered.every(d=>d.category===c), `discount category "${c}" filters correctly (${filtered.length})`);
    }
  }

  // ---- consultations ----
  const types = fetched.consultationTypes;
  if (types && types.length) {
    check(types.every(t=>t.price>0&&t.durationMinutes>0), 'every session type has a price and a duration');
    check(new Set(types.map(t=>t.id)).size===types.length, 'no duplicate session type ids');
    check(types.every(t=>t.name&&t.description), 'every session type has a name and description');
  }

  console.log('\n--- PASS ---');
  ok.forEach(m=>console.log('  ok  ', m));
  if (fail.length) { console.log('\n--- FAIL ---'); fail.forEach(m=>console.log('  FAIL', m)); }
  console.log(`\n${ok.length} passed, ${fail.length} failed`);
  process.exit(fail.length?1:0);
})().catch(e=>{console.error('THREW:',e.message);process.exit(1);});
