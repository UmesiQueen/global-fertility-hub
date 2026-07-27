/**
 * Data-layer integrity check.
 *
 * Runs the repositories for real (TypeScript is transpiled on require) and
 * asserts the invariants the UI will depend on: unique slugs, controlled
 * vocabularies, the story approval gate, pagination clamping, the derived
 * upcoming/replay split, and that no relation list is empty or self-
 * referential.
 *
 * Deliberately independent of `next build` — it catches content mistakes in
 * about a second, and content is what changes most often.
 *
 *   node scripts/verify-data.cjs
 */
const fs = require('fs'), path = require('path'), Module = require('module');
const ROOT = process.cwd();
const ts = require(ROOT + '/node_modules/typescript');

// Transpile-on-require so we can actually execute the data layer.
require.extensions['.ts'] = (mod, filename) => {
  const src = fs.readFileSync(filename, 'utf8');
  const out = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  }).outputText;
  mod._compile(out, filename);
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

const fail = [];
const ok = [];
const check = (cond, msg) => (cond ? ok : fail).push(msg);

(async () => {
  const R = require(ROOT+'/lib/repositories/resources.ts');
  const C = require(ROOT+'/lib/repositories/clinics.ts');
  const S = require(ROOT+'/lib/repositories/stories.ts');
  const E = require(ROOT+'/lib/repositories/events.ts');
  const Con = require(ROOT+'/lib/repositories/consultations.ts');
  const D = require(ROOT+'/lib/repositories/discounts.ts');
  const { FERTILITY_TOPICS, TOPIC_LABELS } = require(ROOT+'/types/shared.ts');
  const { RESOURCE_CATEGORIES } = require(ROOT+'/types/resource.ts');

  const res = require(ROOT+'/lib/data/resources.ts').resources;
  const cli = require(ROOT+'/lib/data/clinics.ts').clinics;
  const sto = require(ROOT+'/lib/data/stories.ts').stories;
  const evt = require(ROOT+'/lib/data/events.ts').events;

  console.log(`counts: resources=${res.length} clinics=${cli.length} stories=${sto.length} events=${evt.length}`);

  // --- uniqueness
  for (const [name, arr] of [['resource',res],['clinic',cli],['story',sto],['event',evt]]) {
    const slugs = arr.map(x=>x.slug), ids = arr.map(x=>x.id);
    check(new Set(slugs).size===slugs.length, `${name} slugs unique`);
    check(new Set(ids).size===ids.length, `${name} ids unique`);
    check(slugs.every(s=>/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)), `${name} slugs are kebab-case`);
  }

  // --- controlled vocabularies
  const topics = new Set(FERTILITY_TOPICS);
  for (const [name, arr] of [['resource',res],['clinic',cli],['story',sto],['event',evt]]) {
    const badTags = arr.flatMap(x=>x.tags.filter(t=>!topics.has(t)));
    check(badTags.length===0, `${name} tags all in FertilityTopic${badTags.length?' -> '+[...new Set(badTags)]:''}`);
    check(arr.every(x=>x.tags.length>0), `${name} every record has >=1 tag (relations depend on it)`);
  }
  check(Object.keys(TOPIC_LABELS).length===FERTILITY_TOPICS.length, 'TOPIC_LABELS covers every topic');
  const badCat = res.filter(r=>!RESOURCE_CATEGORIES.includes(r.category)).map(r=>r.slug);
  check(badCat.length===0, `resource categories valid${badCat.length?' -> '+badCat:''}`);
  const validStoryCats = new Set(S.STORY_CATEGORIES);
  const badStoryCat = sto.filter(s=>!validStoryCats.has(s.category)).map(s=>s.slug);
  check(badStoryCat.length===0, `story categories match the 9 filter chips${badStoryCat.length?' -> '+badStoryCat:''}`);

  // --- images have alt even when src is empty
  const noAlt = [...res.map(r=>r.coverImage),...sto.map(s=>s.coverImage),...evt.map(e=>e.image),...cli.map(c=>c.coverImage),...cli.map(c=>c.logo)].filter(i=>!i.alt);
  check(noAlt.length===0, `every image has alt text (${noAlt.length} missing)`);

  // --- clinics carry no ranking field
  const ranked = cli.filter(c=>'rating' in c||'score' in c||'rank' in c||'reviews' in c);
  check(ranked.length===0, 'no clinic has a rating/score/rank/review field');
  check(cli.every(c=>c.isEducationalPartner===true), 'every clinic flagged isEducationalPartner');

  // --- stories approval gate
  const pub = await S.getStories({pageSize:100});
  check(pub.items.every(s=>s.status==='approved'), 'getStories returns only approved stories');

  // --- pagination clamping
  const p0 = await R.getResources({page:-5,pageSize:5});
  const p99 = await R.getResources({page:99,pageSize:5});
  check(p0.page===1 && p0.items.length===5, 'page=-5 clamps to page 1');
  check(p99.page===p99.totalPages && p99.items.length>0, 'page=99 clamps to last page, still returns items');

  // --- events split is derived and exhaustive
  const now = new Date('2026-07-27');
  const up = await E.getUpcomingEvents({pageSize:100, now});
  const rp = await E.getReplayLibrary({pageSize:100, now});
  check(up.total+rp.total===evt.length, `upcoming(${up.total})+replay(${rp.total})===total(${evt.length})`);
  check(up.items.every(e=>new Date(e.startsAt)>now), 'every upcoming event is in the future');
  check(rp.items.every(e=>e.replayUrl||new Date(e.startsAt)<=now), 'every replay is past or has a recording');
  check(up.items.every((e,i,a)=>i===0||a[i-1].startsAt<=e.startsAt), 'upcoming sorted soonest-first');

  // --- relations never return self, never empty on featured content
  let selfRefs=0, emptyRels=[];
  for (const r of res) {
    const rel = await R.getRelatedResources(r);
    if (rel.some(x=>x.id===r.id)) selfRefs++;
    if (rel.length===0) emptyRels.push('res:'+r.slug);
    const rc = await R.getRelatedClinicsForResource(r);
    if (rc.some(x=>x.id===r.id)) selfRefs++;
  }
  for (const s of sto) {
    const rel = await S.getSimilarStories(s);
    if (rel.some(x=>x.id===s.id)) selfRefs++;
    if (rel.length===0) emptyRels.push('sto:'+s.slug);
  }
  check(selfRefs===0, 'no relation list contains its own source');
  check(emptyRels.length===0, `every record has at least one relation${emptyRels.length?' -> '+emptyRels.join(', '):''}`);

  // --- cross-entity relations actually resolve
  const r1 = await R.getResourceBySlug('understanding-your-fertility-journey');
  const xClinics = await R.getRelatedClinicsForResource(r1);
  const xEvents = await R.getRelatedEventsForResource(r1);
  check(xClinics.length>0, `resource -> clinics resolves (${xClinics.length})`);
  check(xEvents.length>0, `resource -> events resolves (${xEvents.length})`);

  // --- filters
  const ivf = await R.getResources({tag:'ivf',pageSize:100});
  check(ivf.items.every(r=>r.tags.includes('ivf')) && ivf.total>0, `tag filter works (${ivf.total} ivf resources)`);
  const vids = await R.getResources({formats:['video','download'],pageSize:100});
  check(vids.items.every(r=>['video','download'].includes(r.format)), 'multi-format filter works');
  const au = await C.getClinics({country:'Australia',pageSize:100});
  check(au.items.every(c=>c.country==='Australia') && au.total===2, `country filter works (${au.total} AU)`);
  const opts = await C.getClinicFilterOptions();
  check(opts.countries.length>=7 && opts.languages.length>=8, `filter options derived (${opts.countries.length} countries, ${opts.languages.length} languages)`);
  const search = await R.getResources({search:'PCOS',pageSize:100});
  check(search.total>0, `search works (${search.total} hits for "PCOS")`);
  const none = await R.getResources({search:'zzzznothing',pageSize:100});
  check(none.total===0 && none.items.length===0 && none.page===1, 'empty search returns clean empty state');

  // --- slug lookups round-trip
  const slugs = await R.getAllResourceSlugs();
  const roundTrip = await Promise.all(slugs.map(s=>R.getResourceBySlug(s)));
  check(roundTrip.every(Boolean), 'every generateStaticParams slug resolves to a record');
  check(await R.getResourceBySlug('does-not-exist')===null, 'unknown slug returns null (not undefined)');

  // --- featured fallbacks
  check((await R.getFeaturedResources()).length>0, 'featured resources non-empty');
  check((await C.getFeaturedClinics()).length>0, 'featured clinics non-empty');
  check((await S.getFeaturedStories()).length>0, 'featured stories non-empty');
  check((await E.getFeaturedEvents(3,now)).length>0, 'featured events non-empty');

  // --- consultations
  const avail = await Con.getAvailability(now);
  check(avail.every(s=>s.date>='2026-07-27'), 'availability never offers a past date');
  check((await Con.getConsultationTypes()).length===3, '3 consultation types');
  check((await Con.getConsultationFaqs()).length>=5, 'FAQs present');
  check((await D.getDiscounts()).length===5, '5 discounts');

  // --- reading times plausible vs body length
  const badRt = res.filter(r=>!Number.isInteger(r.readingTime)||r.readingTime<1||r.readingTime>40);
  check(badRt.length===0, `reading times are sane integers 1-40${badRt.length?' -> '+badRt.map(r=>r.slug):''}`);
  const badDates = [...res,...sto].filter(x=>!/^\d{4}-\d{2}-\d{2}$/.test(x.publishedAt));
  check(badDates.length===0, 'publishedAt all ISO yyyy-mm-dd');
  const fut = [...res,...sto].filter(x=>x.publishedAt>'2026-07-27');
  check(fut.length===0, `no content published in the future${fut.length?' -> '+fut.map(x=>x.slug):''}`);


  // ---- homepage section render paths ----

  
  
  
  const F=require(ROOT+'/lib/format.ts');

  // Each homepage section's exact repository call must return content,
  // otherwise the section self-suppresses and the page silently loses a band.
  const fr=await R.getFeaturedResources(6);
  const fc=await C.getFeaturedClinics(6);
  const fs_=await S.getFeaturedStories(6);
  const fe=await E.getFeaturedEvents(3);
  check(fr.length===6,`FeaturedResources renders ${fr.length}/6 cards`);
  check(fc.length===6,`FeaturedPartners renders ${fc.length}/6 cards`);
  check(fs_.length===6,`FeaturedStories renders ${fs_.length}/6 cards`);
  check(fe.length===3,`UpcomingEvents renders ${fe.length}/3 cards`);

  // Card fields the components read must be present on every rendered record.
  check(fr.every(r=>r.title&&r.excerpt&&r.coverImage.alt&&r.readingTime&&r.format),'resource cards have every field ResourceCard reads');
  check(fc.every(c=>c.name&&c.city&&c.country&&c.countryCode&&c.treatments.length&&c.coverImage.alt),'clinic cards have every field ClinicCard reads');
  check(fs_.every(s=>s.title&&s.preview&&s.author?.name&&s.category&&s.coverImage.alt),'story cards have every field StoryCard reads');
  check(fe.every(e=>e.title&&e.description&&e.timezone&&e.startsAt&&e.speakers.length&&e.image.alt),'event cards have every field EventCard reads');

  // Formatters must not throw on any real record, and must be stable.
  let threw=null;
  try{
    fr.forEach(r=>{F.formatReadingTime(r.readingTime,r.format);F.titleCase(r.format);});
    fs_.forEach(s=>{F.formatDateShort(s.publishedAt);F.formatReadingTime(s.readingTime);});
    fc.forEach(c=>{F.countryFlag(c.countryCode);c.treatments.map(F.titleCase);});
    fe.forEach(e=>{F.formatEventDate(e);F.formatEventTime(e);F.formatDuration(e.durationMinutes);});
  }catch(err){threw=err.message;}
  check(!threw,`formatters run clean on every rendered record${threw?' -> '+threw:''}`);

  // Event times must read in the event's own zone, not the server's.
  const perth=fe.find(e=>e.timezone==='Australia/Perth')||(await E.getUpcomingEvents({pageSize:99})).items.find(e=>e.timezone==='Australia/Perth');
  const t=F.formatEventTime(perth);
  check(/AWST|GMT\+8/.test(t),`event time renders in its own timezone -> "${t}"`);
  const before=F.formatEventTime(perth);
  process.env.TZ='America/New_York';
  check(F.formatEventTime(perth)===before,'event time is unaffected by server timezone');

  check(F.formatDate('2026-06-12')==='12 June 2026',`formatDate -> "${F.formatDate('2026-06-12')}"`);
  check(F.formatDuration(90)==='1h 30m',`formatDuration(90) -> "${F.formatDuration(90)}"`);
  check(F.formatReadingTime(18,'video')==='18 min watch','videos say "watch" not "read"');
  check(F.countryFlag('AU').length>0 && F.countryFlag('ZZZ')==='','countryFlag handles valid + invalid codes');

  // Detail routes the cards link to must exist as data.
  const rs=await R.getAllResourceSlugs(), cs=await C.getAllClinicSlugs(), ss=await S.getAllStorySlugs(), es=await E.getAllEventSlugs();
  check(fr.every(r=>rs.includes(r.slug)),'every resource card links to a real slug');
  check(fc.every(c=>cs.includes(c.slug)),'every clinic card links to a real slug');
  check(fs_.every(s=>ss.includes(s.slug)),'every story card links to a real slug');
  check(fe.every(e=>es.includes(e.slug)),'every event card links to a real slug');
  console.log('\n--- PASS ---');
  ok.forEach(m=>console.log('  ok  ', m));
  if (fail.length) { console.log('\n--- FAIL ---'); fail.forEach(m=>console.log('  FAIL', m)); }
  console.log(`\n${ok.length} passed, ${fail.length} failed`);
  process.exit(fail.length?1:0);
})().catch(e=>{console.error('THREW:',e.message);process.exit(1);});
