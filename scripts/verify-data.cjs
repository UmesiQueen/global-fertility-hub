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


  { // ---- homepage section render paths ----

  
  
  
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

  } // end section block

  { // ---- listing page query paths ----
  const SP=require(ROOT+'/lib/search-params.ts');
  const qs=(s)=>{const p={};for(const [k,v] of new URLSearchParams(s)){if(k in p){p[k]=[].concat(p[k],v);}else p[k]=v;}return p;};
  // ---- listing page query paths ----







// ---- the classic pagination bug: filter while deep in a result set
let h=SP.buildHref('/resources',qs('page=4&sort=oldest'),{category:'ivf-basics'});
check(!h.includes('page='),`changing a filter on page 4 resets pagination -> ${h}`);
check(h.includes('sort=oldest'),'unrelated params survive a filter change');
h=SP.buildHref('/resources',qs('category=ivf-basics&page=2'),{page:'3'});
check(h.includes('page=3')&&h.includes('category=ivf-basics'),`paging keeps filters -> ${h}`);
check(SP.buildHref('/resources',qs('page=2'),{page:null})==='/resources','page=1 produces a clean canonical URL');
check(SP.buildHref('/stories',qs('category=IVF'),{category:null})==='/stories','clearing the last filter returns to the bare path');

// ---- multi-value params, both encodings
check(JSON.stringify(SP.readParamList(qs('format=video,guide'),'format'))==='["video","guide"]','comma-encoded multi-value parses');
check(JSON.stringify(SP.readParamList(qs('format=video&format=guide'),'format'))==='["video","guide"]','repeated-key multi-value parses');
check(SP.readParamList(qs(''),'format').length===0,'absent multi-value param yields []');
check(SP.readParam(qs('search=%20%20'),'search')===undefined,'whitespace-only search is treated as absent');
check(SP.readPage(qs('page=abc'))===1 && SP.readPage(qs('page=-3'))===1,'malformed page falls back to 1');
check(JSON.stringify(SP.toggleInList(['video'],'video'))==='[]','toggling a selected format removes it');

// ---- Resources page paths
let r=await R.getResources({page:1,pageSize:12});
check(r.items.length===12 && r.totalPages===2,`resources paginate 12/page (${r.total} total, ${r.totalPages} pages)`);
const p2=await R.getResources({page:2,pageSize:12});
const overlap=p2.items.filter(x=>r.items.some(y=>y.id===x.id));
check(overlap.length===0,'page 2 shares no items with page 1');
check(r.items.length+p2.items.length===r.total,'pages 1+2 cover every resource exactly once');
const filtered=await R.getResources({category:'emotional-wellbeing',pageSize:12});
check(filtered.total>0 && filtered.items.every(x=>x.category==='emotional-wellbeing'),`category filter (${filtered.total} in emotional-wellbeing)`);
const multi=await R.getResources({formats:['video','download'],pageSize:99});
check(multi.total>0 && multi.items.every(x=>['video','download'].includes(x.format)),`multi-format filter (${multi.total})`);
const combo=await R.getResources({category:'treatments-procedures',formats:['article'],search:'egg',pageSize:99});
check(combo.items.every(x=>x.category==='treatments-procedures'&&x.format==='article'),`filters combine (${combo.total} results)`);
const dead=await R.getResources({search:'zzzz',pageSize:12});
check(dead.total===0&&dead.totalPages===1&&dead.page===1,'no-results state is clean (page 1 of 1)');
const sorted=await R.getResources({sort:'reading-time',pageSize:99});
check(sorted.items.every((x,i,a)=>i===0||a[i-1].readingTime<=x.readingTime),'reading-time sort is ascending');

// ---- counts drive the sidebar; they must sum to the corpus
const cc=await R.getResourceCategoryCounts();
const fc=await R.getResourceFormatCounts();
check(Object.values(cc).reduce((a,b)=>a+b,0)===r.total,'category counts sum to total resources');
check(Object.values(fc).reduce((a,b)=>a+b,0)===r.total,'format counts sum to total resources');

// ---- Partners page: five filters that must intersect, not error
const opts=await C.getClinicFilterOptions();
let anyEmpty=false;
for(const c of opts.countries){const res=await C.getClinics({country:c,pageSize:99});if(!res.total)anyEmpty=true;}
check(!anyEmpty,'every country in the dropdown returns at least one partner');
for(const l of opts.languages){const res=await C.getClinics({language:l,pageSize:99});if(!res.total)anyEmpty=true;}
check(!anyEmpty,'every language in the dropdown returns at least one partner');
for(const t of opts.treatments){const res=await C.getClinics({treatment:t,pageSize:99});if(!res.total)anyEmpty=true;}
check(!anyEmpty,'every treatment in the dropdown returns at least one partner');
const narrow=await C.getClinics({country:'Australia',language:'Greek',pageSize:99});
check(narrow.total===1,`stacked filters narrow correctly (AU + Greek -> ${narrow.total})`);
const impossible=await C.getClinics({country:'Australia',language:'Marathi',pageSize:99});
check(impossible.total===0,'an impossible filter combination returns empty, not an error');
const byName=await C.getClinics({sort:'name',pageSize:99});
check(byName.items.every((x,i,a)=>i===0||a[i-1].name.localeCompare(x.name)<=0),'name sort is alphabetical');
check(!('rating' in (byName.items[0]||{})),'partner records still expose no rating field');

// ---- Stories page: every chip must work
const counts=await S.getStoryCategoryCounts();
const cats=S.STORY_CATEGORIES;
const emptyChips=[];
for(const cat of cats){const res=await S.getStories({category:cat,pageSize:99});if(res.total!==(counts[cat]??0))emptyChips.push(cat);}
check(emptyChips.length===0,'every story chip count matches its filtered result');
const zeroChips=cats.filter(c=>!(counts[c]??0));
check(zeroChips.length===0,`no story chip is empty${zeroChips.length?' -> '+zeroChips.join(', '):''}`);
const allStories=await S.getStories({pageSize:99});
check(allStories.items.every(s=>s.status==='approved'),'listing still only shows approved stories');

// ---- Events page tabs
const now=new Date('2026-07-27');
const up=await E.getUpcomingEvents({pageSize:99,now});
const rp=await E.getReplayLibrary({pageSize:99,now});
check(up.total>0&&rp.total>0,`both tabs have content (${up.total} upcoming, ${rp.total} replays)`);
const ids=new Set(up.items.map(e=>e.id));
check(rp.items.every(e=>!ids.has(e.id)),'no event appears in both tabs');
const tabHref=SP.buildHref('/events',qs('tab=replays&page=2'),{tab:null});
check(!tabHref.includes('page='),`switching tab resets pagination -> ${tabHref}`);
const searchUp=await E.getUpcomingEvents({search:'embryologist',pageSize:99,now});
check(searchUp.total>0,`event search works (${searchUp.total} hit)`);


  } // end listing block

  console.log('\n--- PASS ---');
  ok.forEach(m=>console.log('  ok  ', m));
  if (fail.length) { console.log('\n--- FAIL ---'); fail.forEach(m=>console.log('  FAIL', m)); }
  console.log(`\n${ok.length} passed, ${fail.length} failed`);
  process.exit(fail.length?1:0);
})().catch(e=>{console.error('THREW:',e.message);process.exit(1);});
