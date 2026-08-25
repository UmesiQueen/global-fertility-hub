/**
 * Offline logic check.
 *
 * Everything here runs without a network call: URL helpers, the markdown
 * parser, formatters, timezone maths, the three zod schemas, availability,
 * the legal documents (still authored in code), and the commercial-disclosure
 * guardrails that are enforced by page source rather than by data.
 *
 * Content itself now lives in Hygraph, so assertions about *which* records
 * exist moved to scripts/verify-hygraph.cjs. This file asserts the things
 * that must be true no matter what the editors publish.
 *
 *   node scripts/verify-code.cjs
 */
const fs = require('fs'), path = require('path'), Module = require('module');
const ROOT = process.cwd();
const ts = require(ROOT + '/node_modules/typescript');

// Transpile-on-require so we can actually execute the TypeScript.
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

  { // ---- URL as state ----
  const SP = require(ROOT+'/lib/search-params.ts');
  const qs = (s)=>{const p={};for(const [k,v] of new URLSearchParams(s)){if(k in p){p[k]=[].concat(p[k],v);}else p[k]=v;}return p;};

  // the classic pagination bug: change a filter while deep in a result set
  let h=SP.buildHref('/resources',qs('page=4&sort=oldest'),{category:'ivf-basics'});
  check(!h.includes('page='),`changing a filter on page 4 resets pagination -> ${h}`);
  check(h.includes('sort=oldest'),'unrelated params survive a filter change');
  h=SP.buildHref('/resources',qs('category=ivf-basics&page=2'),{page:'3'});
  check(h.includes('page=3')&&h.includes('category=ivf-basics'),`paging keeps filters -> ${h}`);
  check(SP.buildHref('/resources',qs('page=2'),{page:null})==='/resources','page=1 produces a clean canonical URL');
  check(SP.buildHref('/stories',qs('category=IVF'),{category:null})==='/stories','clearing the last filter returns to the bare path');
  const tabHref=SP.buildHref('/events',qs('tab=replays&page=2'),{tab:null});
  check(!tabHref.includes('page='),`switching tab resets pagination -> ${tabHref}`);

  // multi-value params, both encodings
  check(JSON.stringify(SP.readParamList(qs('format=video,guide'),'format'))==='["video","guide"]','comma-encoded multi-value parses');
  check(JSON.stringify(SP.readParamList(qs('format=video&format=guide'),'format'))==='["video","guide"]','repeated-key multi-value parses');
  check(SP.readParamList(qs(''),'format').length===0,'absent multi-value param yields []');
  check(SP.readParam(qs('search=%20%20'),'search')===undefined,'whitespace-only search is treated as absent');
  check(SP.readPage(qs('page=abc'))===1 && SP.readPage(qs('page=-3'))===1,'malformed page falls back to 1');
  check(JSON.stringify(SP.toggleInList(['video'],'video'))==='[]','toggling a selected format removes it');
  } // end search-params block

  { // ---- pagination helper ----
  const { paginate } = require(ROOT+'/lib/repositories/shared.ts');
  const items = Array.from({length:25},(_,i)=>({id:String(i)}));
  const p1 = paginate(items,1,12), p2 = paginate(items,2,12);
  check(p1.items.length===12 && p1.totalPages===3,'paginate splits 25 items into 3 pages of 12');
  check(p2.items.every(x=>!p1.items.some(y=>y.id===x.id)),'page 2 shares no items with page 1');
  check(paginate(items,-5,5).page===1,'page=-5 clamps to page 1');
  const last = paginate(items,99,5);
  check(last.page===last.totalPages && last.items.length>0,'page=99 clamps to the last page, still returns items');
  const none = paginate([],1,12);
  check(none.total===0 && none.totalPages===1 && none.page===1,'empty result set is a clean page 1 of 1');
  } // end pagination block

  { // ---- featured rails ----
  const { featuredFirst } = require(ROOT+'/lib/repositories/shared.ts');
  const item=(id,f)=>({id,isFeatured:f,n:Number(id)});
  const byId=(a,b)=>a.n-b.n;
  const run=(items,limit=6)=>featuredFirst(items,i=>Boolean(i.isFeatured),byId,limit).map(i=>i.id);

  // The bug this replaced: one flagged out of two used to return both.
  check(JSON.stringify(run([item('1',true),item('2',false)]))==='["1"]','one featured out of two returns only the featured one');
  check(JSON.stringify(run([item('1',false),item('2',true)]))==='["2"]','unticking Featured actually removes a card');
  check(run([item('1',true),item('2',true),item('3',false)]).length===2,'only flagged records appear, however many are unflagged');

  // Fallback keeps a fresh site from rendering an empty band.
  check(JSON.stringify(run([item('1',false),item('2',false)]))==='["1","2"]','nothing flagged falls back to the whole (sorted) list');
  check(run([],6).length===0,'an empty collection returns nothing, so the section self-suppresses');

  // The cap still holds, and ordering is the caller's comparator.
  check(run([1,2,3,4,5,6,7,8].map(n=>item(String(n),true)),6).length===6,'more featured than the limit is capped');
  check(JSON.stringify(run([item('3',true),item('1',true),item('2',true)]))==='["1","2","3"]','featured records keep the comparator ordering');
  check(run([item('1',false),item('2',false),item('3',false)],2).length===2,'the fallback respects the limit too');
  } // end featured block

  { // ---- markdown ----
  const MD=require(ROOT+'/lib/markdown.ts');
  check(MD.parseMarkdown('').length===0,'empty body yields no blocks (no crash)');
  check(MD.parseMarkdown('## H\r\n\r\nBody').length===2,'CRLF content still splits into blocks');
  const inl=MD.parseInline('a **b** c *d* e');
  check(inl.filter(n=>n.type==='strong').length===1 && inl.filter(n=>n.type==='em').length===1,'bold and italic parse without eating each other');
  check(MD.parseMarkdown('- one\n- two')[0].items.length===2,'bullet list parses');
  check(MD.markdownToPlainText('## Head\n\nBody text here',9).endsWith('…'),'plain text truncates on a word boundary');
  const weird=MD.parseMarkdown('#### deep heading\n\ntext');
  check(weird.length>0 && weird[0].type==='paragraph','unsupported syntax falls through as text, not dropped');
  const round='## Heading\n\nA paragraph with **bold** and a [link](/resources).';
  check(MD.markdownToPlainText(round).includes('paragraph')&&MD.markdownToPlainText(round).includes('bold'),'plain text keeps words from inside inline markup');
  } // end markdown block

  { // ---- formatters ----
  const F=require(ROOT+'/lib/format.ts');
  check(F.formatDate('2026-06-12')==='12 June 2026',`formatDate -> "${F.formatDate('2026-06-12')}"`);
  check(F.formatDuration(90)==='1h 30m',`formatDuration(90) -> "${F.formatDuration(90)}"`);
  check(F.formatReadingTime(18,'video')==='18 min watch','videos say "watch" not "read"');
  check(F.formatReadingTime(5)==='5 min read','articles say "read"');
  check(F.countryFlag('AU').length>0 && F.countryFlag('ZZZ')==='','countryFlag handles valid + invalid codes');
  check(F.titleCase('male-fertility')==='Male Fertility',`titleCase -> "${F.titleCase('male-fertility')}"`);

  // an event must read in its own zone, not the server's
  const ev={startsAt:'2026-08-03T09:00:00+08:00',durationMinutes:60,timezone:'Australia/Perth'};
  const t=F.formatEventTime(ev);
  check(/AWST|GMT\+8/.test(t),`event time renders in its own timezone -> "${t}"`);
  const original=process.env.TZ;
  process.env.TZ='America/New_York';
  check(F.formatEventTime(ev)===t,'event time is unaffected by the server timezone');
  process.env.TZ=original;
  } // end format block

  { // ---- join form schema + phone ----
  const V=require(ROOT+'/lib/validation/join.ts');
  const CO=require(ROOT+'/lib/countries.ts');
  const S=V.joinSchema;
  const good={fullName:'Sarah Whitfield',email:'sarah@example.com',countryCode:'AU',phone:'',referralSource:'Instagram',reason:'',marketingConsent:false};
  const err=(r,p)=>r.success?null:r.error.issues.find(i=>i.path[0]===p)?.message;

  check(S.safeParse(good).success,'minimal valid submission parses');
  check(err(S.safeParse({...good,fullName:'A'}),'fullName'),'one-character name rejected');
  check(err(S.safeParse({...good,fullName:'   '}),'fullName'),'whitespace-only name rejected');
  check(err(S.safeParse({...good,fullName:'x'.repeat(101)}),'fullName'),'over-long name rejected');
  check(err(S.safeParse({...good,email:'nope'}),'email'),'malformed email rejected');
  check(err(S.safeParse({...good,email:'a@b'}),'email'),'email without TLD rejected');
  check(S.safeParse({...good,email:'first.last+tag@sub.example.co.uk'}).success,'plus-addressing accepted');
  check(S.safeParse({...good,email:'  SARAH@EXAMPLE.COM '}).data.email==='sarah@example.com','email trimmed + lowercased by schema');
  check(S.safeParse({...good,countryCode:'au'}).data.countryCode==='AU','country code upper-cased by schema');
  check(err(S.safeParse({...good,countryCode:'ZZ'}),'countryCode'),'unknown country rejected');
  check(err(S.safeParse({...good,referralSource:'Carrier pigeon'}),'referralSource'),'referral outside list rejected');
  check(err(S.safeParse({...good,reason:'x'.repeat(1001)}),'reason'),'over-long reason rejected');

  check(S.safeParse({...good,marketingConsent:false}).success,'joining without consent is valid');
  check(!S.safeParse({...good,marketingConsent:'on'}).success,'string "on" is not accepted as consent');
  check(!S.safeParse({...good,marketingConsent:1}).success,'1 is not accepted as consent');
  check(S.safeParse({...good,marketingConsent:true}).data.marketingConsent===true,'true consent survives parse');

  // ---- phone: one E.164 string, validated by libphonenumber
  check(S.safeParse({...good,phone:''}).success,'blank phone is valid (field is optional)');
  check(S.safeParse({...good,phone:undefined}).success,'absent phone is valid');
  check(S.safeParse({...good,phone:'+447400123456'}).success,'valid UK mobile accepted');
  // 07700 900xxx is Ofcom's reserved fictional range — libphonenumber knows
  // it is not assignable, which a digit-count check never would.
  check(err(S.safeParse({...good,phone:'+447700900123'}),'phone'),'reserved fictional UK range rejected');
  check(S.safeParse({...good,phone:'+61400123456'}).success,'valid AU mobile accepted');
  check(S.safeParse({...good,phone:'+2348031234567'}).success,'valid NG mobile accepted');
  check(S.safeParse({...good,phone:'+12125550123'}).success,'valid US number accepted');
  check(err(S.safeParse({...good,phone:'+441'}),'phone'),'too-short national number rejected');
  check(err(S.safeParse({...good,phone:'+9999999999999'}),'phone'),'unassigned country code rejected');
  check(err(S.safeParse({...good,phone:'abc'}),'phone'),'letters rejected');
  check(err(S.safeParse({...good,phone:'400123456'}),'phone'),'number without country code rejected');
  check(err(S.safeParse({...good,phone:'+44 7700 900123 ext 5'}),'phone'),'trailing junk rejected');

  // normalizePhone: empty string must not reach the database as ""
  check(V.normalizePhone('')===undefined,'empty phone normalises to undefined');
  check(V.normalizePhone('   ')===undefined,'whitespace phone normalises to undefined');
  check(V.normalizePhone(undefined)===undefined,'undefined phone stays undefined');
  check(V.normalizePhone('+447400123456')==='+447400123456','valid phone passes through unchanged');
  check(V.normalizePhone('  +447400123456  ')==='+447400123456','phone is trimmed');

  // ---- country list (residence select) still intact
  const countries=CO.getCountries();
  check(countries.length>150,`country list resolves (${countries.length})`);
  check(countries.every((c,i,a)=>i===0||a[i-1].name.localeCompare(c.name)<=0),'countries alphabetical by name');
  check(new Set(countries.map(c=>c.code)).size===countries.length,'no duplicate ISO codes');
  check(CO.getCountryName('GB')==='United Kingdom',`GB resolves to "${CO.getCountryName('GB')}"`);
  check(CO.getCountryName('ZZ')===null,'unknown code returns null');
  check(CO.isValidCountryCode('NG')&&!CO.isValidCountryCode('XX'),'country code validation works');
  // dial codes now belong to libphonenumber only — guard against them creeping back
  check(!('dialCode' in countries[0]),'countries carry no dial code (single source of truth)');
  } // end join block

  { // ---- consultations: slots, timezones, booking schema ----
  const C=require(ROOT+'/lib/repositories/consultations.ts');
  const F=require(ROOT+'/lib/format.ts');
  const V=require(ROOT+'/lib/validation/consultation.ts');
  const S=V.bookingSchema;
  const PZ='Australia/Perth';

  const before=new Date('2026-07-01T00:00:00Z');

  // ---- availability shape (still authored in code, not Hygraph)
  const days=await C.getAvailability(before);
  check(days.length===10,`all 10 days available before August (${days.length})`);
  check(days.every(d=>d.starts.length>0),'no day has an empty slot list');
  check(days.every(d=>d.starts.every(s=>!Number.isNaN(new Date(s).getTime()))),'every slot parses as a date');
  check(days.every(d=>d.starts.every(s=>s.startsWith(d.date))),'every slot instant belongs to its own calendar date');
  check(days.every((d,i,a)=>i===0||a[i-1].date<=d.date),'days sorted ascending');
  const allStarts=days.flatMap(d=>d.starts);
  check(new Set(allStarts).size===allStarts.length,`no duplicate slots (${allStarts.length} total)`);

  // ---- past filtering happens on the instant, not the date
  const midday=new Date('2026-08-03T04:00:00Z'); // 12:00 Perth on the 3rd
  const after=await C.getAvailability(midday);
  const day3=after.find(d=>d.date==='2026-08-03');
  check(day3 && day3.starts.length===1,`same-day past slots dropped, later ones kept (${day3?day3.starts.length:0} left on 3 Aug)`);
  check(day3 && day3.starts[0].includes('T14:00'),'the surviving slot is the 2pm one');
  const evening=new Date('2026-08-03T10:00:00Z'); // 18:00 Perth
  check(!(await C.getAvailability(evening)).some(d=>d.date==='2026-08-03'),'a day with no future slots disappears entirely');
  check((await C.getAvailability(new Date('2027-01-01'))).length===0,'everything past yields an empty list, not a crash');

  // ---- slot availability guard used by the action
  check(await C.isSlotAvailable('2026-08-03T09:00:00+08:00',before),'a real future slot is bookable');
  check(!(await C.isSlotAvailable('2026-08-03T09:00:00+08:00',midday)),'a slot that has passed is rejected');
  check(!(await C.isSlotAvailable('2026-08-03T10:30:00+08:00',before)),'an invented time is rejected');
  check(!(await C.isSlotAvailable('not-a-date',before)),'garbage input is rejected without throwing');

  // ---- timezone conversion: the whole point of the page
  const slot='2026-08-03T09:00:00+08:00';
  check(F.formatTimeInZone(slot,PZ)==='9:00 am',`Perth reads 9:00 am (got "${F.formatTimeInZone(slot,PZ)}")`);
  check(F.formatTimeInZone(slot,'Europe/London')==='2:00 am',`London reads 2:00 am (got "${F.formatTimeInZone(slot,'Europe/London')}")`);
  check(F.formatTimeInZone(slot,'America/New_York')==='9:00 pm',`New York reads 9:00 pm (got "${F.formatTimeInZone(slot,'America/New_York')}")`);
  check(F.formatDateInZone(slot,'America/New_York').includes('2 Aug'),`New York is the PREVIOUS day (${F.formatDateInZone(slot,'America/New_York')})`);
  check(F.formatDateInZone(slot,PZ).includes('3 Aug'),'Perth is the 3rd');
  check(F.formatTimeInZone(slot,'Asia/Singapore')==='9:00 am','Singapore shares Perth wall-clock');
  check(F.isSameWallClock(slot,PZ,'Asia/Singapore'),'same wall clock detected -> "your time" suppressed');
  check(!F.isSameWallClock(slot,PZ,'Europe/London'),'different wall clock detected -> "your time" shown');
  check(F.isSameWallClock(slot,PZ,PZ),'identical zones are same wall clock');
  check(/AWST|GMT\+8/.test(F.formatTimeWithZone(slot,PZ)),`zone label present (${F.formatTimeWithZone(slot,PZ)})`);

  // a London slot crossing DST — the reason offsets can't be hardcoded
  const winter='2026-01-15T09:00:00+08:00';
  check(F.formatTimeInZone(winter,'Europe/London')==='1:00 am',`London in winter is 1:00 am, not 2:00 (got "${F.formatTimeInZone(winter,'Europe/London')}")`);

  // server timezone must not leak into output
  const original=process.env.TZ;
  const baseline=F.formatTimeInZone(slot,PZ)+F.formatDateInZone(slot,PZ);
  process.env.TZ='America/Chicago';
  check(F.formatTimeInZone(slot,PZ)+F.formatDateInZone(slot,PZ)===baseline,'output is unaffected by the server timezone');
  process.env.TZ=original;

  // ---- booking schema
  const good={consultationTypeId:'con-one-on-one',startsAt:slot,fullName:'Sarah Whitfield',email:'sarah@example.com',phone:'',memberId:'',note:'',requesterTimezone:'Europe/London'};
  const err=(r,p)=>r.success?null:r.error.issues.find(i=>i.path[0]===p)?.message;
  check(S.safeParse(good).success,'valid booking parses');
  check(err(S.safeParse({...good,consultationTypeId:''}),'consultationTypeId'),'missing session rejected');
  check(err(S.safeParse({...good,startsAt:''}),'startsAt'),'missing slot rejected');
  check(err(S.safeParse({...good,startsAt:'tomorrow-ish'}),'startsAt'),'unparseable slot rejected');
  check(err(S.safeParse({...good,email:'nope'}),'email'),'bad email rejected');
  check(err(S.safeParse({...good,fullName:'A'}),'fullName'),'one-char name rejected');
  check(S.safeParse({...good,memberId:'GFH-7K2M9'}).success,'valid member ID accepted');
  check(S.safeParse({...good,memberId:'gfh-7k2m9'}).data.memberId==='GFH-7K2M9','member ID upper-cased');
  check(err(S.safeParse({...good,memberId:'GFH-00000'}),'memberId'),'member ID with ambiguous chars rejected');
  check(err(S.safeParse({...good,memberId:'ABC123'}),'memberId'),'malformed member ID rejected');
  check(S.safeParse({...good,memberId:''}).success,'blank member ID is fine (optional)');
  check(S.safeParse({...good,phone:'+447400123456'}).success,'valid phone accepted');
  check(err(S.safeParse({...good,phone:'12'}),'phone'),'bad phone rejected');
  check(err(S.safeParse({...good,note:'x'.repeat(1001)}),'note'),'over-long note rejected');
  check(V.optional('  ')===undefined && V.optional('x')==='x','optional() normalises blanks');
  } // end consultations block

  { // ---- contact form ----
  const V=require(ROOT+'/lib/validation/contact.ts');
  const E=require(ROOT+'/lib/emails/contact-emails.ts');
  const S=V.contactSchema;
  const good={topic:'general',fullName:'Sarah Whitfield',email:'sarah@example.com',subject:'',message:'I wanted to ask about your webinars.'};
  const err=(r,p)=>r.success?null:r.error.issues.find(i=>i.path[0]===p)?.message;

  // ---- schema
  check(S.safeParse(good).success,'valid message parses');
  check(err(S.safeParse({...good,topic:''}),'topic'),'missing topic rejected');
  check(err(S.safeParse({...good,topic:'nonsense'}),'topic'),'topic outside the list rejected');
  check(err(S.safeParse({...good,fullName:'A'}),'fullName'),'one-char name rejected');
  check(err(S.safeParse({...good,email:'nope'}),'email'),'bad email rejected');
  check(S.safeParse({...good,email:'  SARAH@EXAMPLE.COM '}).data.email==='sarah@example.com','email trimmed + lowercased');
  check(err(S.safeParse({...good,message:'hi'}),'message'),'too-short message rejected');
  check(err(S.safeParse({...good,message:'   '}),'message'),'whitespace-only message rejected');
  check(err(S.safeParse({...good,message:'x'.repeat(4001)}),'message'),'over-long message rejected');
  check(S.safeParse({...good,message:'x'.repeat(4000)}).success,'message at the exact limit is accepted');
  check(err(S.safeParse({...good,subject:'x'.repeat(151)}),'subject'),'over-long subject rejected');
  check(S.safeParse({...good,subject:''}).success,'blank subject is fine (optional)');
  check(V.optional('  ')===undefined && V.optional(' x ')==='x','optional() normalises blanks');

  // ---- topics: every CTA target must resolve
  check(V.CONTACT_TOPICS.length===7,`7 topics defined (${V.CONTACT_TOPICS.length})`);
  check(new Set(V.CONTACT_TOPIC_VALUES).size===V.CONTACT_TOPICS.length,'no duplicate topic values');
  check(V.CONTACT_TOPICS.every(t=>t.label&&t.value),'every topic has a value and a label');
  for (const t of ['story','resource','consultation']) {
    check(V.CONTACT_TOPIC_VALUES.includes(t),`CTA topic "${t}" exists in the list`);
    check(S.safeParse({...good,topic:t}).success,`"${t}" passes validation`);
  }
  check(V.normaliseTopic('story')==='story','known query param passes through');
  check(V.normaliseTopic('hacker')==='general','unknown query param falls back to general');
  check(V.normaliseTopic(undefined)==='general','missing query param falls back to general');
  check(V.normaliseTopic(null)==='general','null query param falls back to general');
  check(V.topicLabel('story')==="I'd like to share my story",`topicLabel maps correctly ("${V.topicLabel('story')}")`);
  check(V.topicLabel('nope')==='General enquiry','unknown topic label falls back');

  // ---- emails
  const payload={topic:'story',fullName:'Sarah Whitfield',email:'sarah@example.com',subject:'My IVF journey',message:'We tried for three years.'};
  const ack=E.contactAckHtml(payload);
  check(ack.includes('Sarah')&&!ack.includes('Whitfield'),'acknowledgement greets by first name only');
  check(/urgent or medical/i.test(ack),'acknowledgement points urgent cases at real help');
  check(/not a clinic/i.test(ack),'acknowledgement restates we are not a clinic');
  check(!ack.includes(payload.message),'acknowledgement does NOT quote the message back');
  const nasty=E.contactAckHtml({...payload,fullName:'<script>alert(1)</script> Eve'});
  check(!nasty.includes('<script>alert'),'user-supplied name is escaped in the acknowledgement');
  const subj=E.contactNotificationSubject(payload);
  check(subj.includes('share my story')&&subj.includes('My IVF journey'),`notification subject carries topic + subject ("${subj}")`);
  check(E.contactNotificationSubject({...payload,subject:undefined}).includes('Sarah Whitfield'),'notification subject falls back to the sender name');
  const note=E.contactNotificationText(payload);
  check(note.includes(payload.message)&&note.includes(payload.email),'notification carries the message and reply address');
  check(E.contactAckText(payload).length>50 && E.contactAckSubject().length>0,'plain-text acknowledgement and subject are non-empty');
  } // end contact block

  { // ---- legal pages (authored in code, deliberately not in the CMS) ----
  const L=require(ROOT+'/lib/legal.ts');
  const MD=require(ROOT+'/lib/markdown.ts');
  const docs=L.legalDocuments;

  check(docs.length===3,`3 legal documents (${docs.length})`);
  check(['privacy','terms','disclaimer'].every(s=>L.getLegalDocument(s)),'all three slugs resolve');
  check(L.getLegalDocument('nope')===null,'unknown slug returns null');
  check(new Set(docs.map(d=>d.slug)).size===3,'no duplicate slugs');
  check(docs.every(d=>d.title&&d.description&&d.lastUpdated),'every doc has title, description and date');
  check(docs.every(d=>/^\d{4}-\d{2}-\d{2}$/.test(d.lastUpdated)),'lastUpdated is ISO yyyy-mm-dd');
  check(docs.every(d=>d.body.length>1500),'every doc has substantial content');

  // ---- markdown integrity
  for(const d of docs){
    const blocks=MD.parseMarkdown(d.body);
    check(blocks.length>5,`${d.slug}: parses to ${blocks.length} blocks`);
    const plain=MD.markdownToPlainText(d.body);
    const words=d.body.replace(/[#*\-\[\]()]/g,' ').split(/\s+/).filter(w=>w.length>4 && !w.includes('/') && !w.includes(':'));
    const lost=words.filter(w=>!plain.includes(w));
    check(lost.length===0,`${d.slug}: no words lost in parsing${lost.length?' -> '+lost.slice(0,3):''}`);
  }
  check(!docs.some(d=>/^#\s/m.test(d.body)),'no body uses a level-1 heading (page h1 owns that)');

  // ---- links must all be safe and resolvable
  const internal=new Set(['/','/contact','/join','/consultations','/privacy','/terms','/disclaimer','/resources','/stories','/events','/educational-partners','/about','/discounts','/store']);
  let linkCount=0, badLinks=[], unsafe=[];
  for(const d of docs){
    for(const block of MD.parseMarkdown(d.body)){
      const nodes = block.type==='list' ? block.items.flat() : block.content;
      for(const n of nodes){
        if(n.type!=='link') continue;
        linkCount++;
        if(!/^(https?:\/\/|mailto:|\/|#)/.test(n.href)) unsafe.push(d.slug+': '+n.href);
        if(n.href.startsWith('/') && !internal.has(n.href.split('#')[0])) badLinks.push(d.slug+': '+n.href);
      }
    }
  }
  // The count itself isn't the point — this guards against the inline link
  // parser silently returning nothing, which would make the two checks below
  // pass vacuously.
  check(linkCount>5,`links parsed across the documents (${linkCount})`);
  check(unsafe.length===0,`no unsafe link schemes${unsafe.length?' -> '+unsafe:''}`);
  check(badLinks.length===0,`every internal link points at a real route${badLinks.length?' -> '+badLinks:''}`);

  // ---- the guardrails that matter for this client
  const privacy=L.getLegalDocument('privacy');
  const terms=L.getLegalDocument('terms');
  const disc=L.getLegalDocument('disclaimer');
  check(/not medical advice/i.test(disc.body),'disclaimer states nothing is medical advice');
  check(/not a clinic/i.test(terms.body),'terms state we are not a clinic');
  check(/do not rank|don't rank|not recommend/i.test(disc.body),'disclaimer states clinics are not recommendations');
  check(/support and advocacy/i.test(disc.body),'disclaimer frames consultations as support and advocacy');
  check(/emergenc/i.test(disc.body),'disclaimer covers emergencies');
  check(/take your story down|remove/i.test(terms.body),'terms give contributors the right to withdraw a story');
  check(/unsubscribe/i.test(privacy.body),'privacy explains unsubscribing');
  check(/delete everything we hold/i.test(privacy.body),'privacy explains deletion rights');
  // accuracy: the policy must match what the code actually stores
  check(/member ID/i.test(privacy.body),'privacy mentions the member ID we actually issue');
  check(/IP address/i.test(privacy.body),'privacy discloses the IP address we actually store');
  check(/consent/i.test(privacy.body)&&/wording you agreed/i.test(privacy.body),'privacy describes the real consent-versioning behaviour');
  check(/don't set tracking|no tracking|don't use Google Analytics/i.test(privacy.body),'privacy states we set no tracking cookies — true as built');

  // ---- draft discipline
  const withTodos=docs.filter(d=>/TO CONFIRM/.test(d.body));
  check(withTodos.length===3,`all 3 documents carry open questions for the client (${withTodos.length})`);
  const liveWithTodos=docs.filter(d=>!d.draft && /TO CONFIRM/.test(d.body));
  check(liveWithTodos.length===0,`no document is marked live while unresolved questions remain${liveWithTodos.length?' -> '+liveWithTodos.map(d=>d.slug):''}`);
  check(docs.every(d=>d.draft),'all three are still flagged draft (expected until legal sign-off)');
  } // end legal block

  { // ---- commercial disclosure, enforced by page source ----
  // These are guardrails an editor cannot weaken from the CMS, because they
  // live in the templates rather than in the content.
  const t=fs.readFileSync(ROOT+'/types/discount.ts','utf8');
  check(/isAffiliate/.test(t),'Discount type supports a per-partner affiliate flag');

  const discountsRaw=fs.readFileSync(ROOT+'/app/discounts/page.tsx','utf8');
  // JSX wraps prose across lines, so collapse whitespace before matching
  // phrases — otherwise a real sentence looks missing purely because of
  // where the formatter broke the line.
  const discountsPage=discountsRaw.replace(/\s+/g,' ');
  const disclosureIndex=discountsRaw.indexOf('How these partnerships work');
  const offersIndex=discountsRaw.indexOf('discounts.map');
  check(disclosureIndex>0&&disclosureIndex<offersIndex,'commercial disclosure renders ABOVE the offer grid');
  check(/medical advice/i.test(discountsPage)&&/no product here is a treatment/i.test(discountsPage),'discounts page states the offers are not medical advice and not treatments');
  check(/healthcare team/i.test(discountsPage),'discounts page tells people to check with their clinicians');
  const discountCard=fs.readFileSync(ROOT+'/components/cards/discount-card.tsx','utf8');
  check(/rel="[^"]*sponsored/.test(discountCard),'outbound partner links carry rel="sponsored"');
  check(/noreferrer/.test(discountCard)&&/noopener/.test(discountCard),'outbound links carry noreferrer and noopener');
  check(/aria-live/.test(discountCard),'copy-to-clipboard result is announced to screen readers');

  const listRaw=fs.readFileSync(ROOT+'/app/store/page.tsx','utf8');
  const list=listRaw.replace(/\s+/g,' ');
  const detail=fs.readFileSync(ROOT+'/app/store/[slug]/page.tsx','utf8').replace(/\s+/g,' ');
  check(/(nothing|not|isn't)[^.]{0,60}a treatment/i.test(list),'store page states nothing is a treatment');
  check(/change your chances of conceiving/i.test(list),'store page rules out fertility claims explicitly');
  check(/change your chances of conceiving/i.test(detail),'product page rules out fertility claims explicitly');
  check(/How this store works/i.test(list),'store page carries a commercial disclosure');
  const discIdx=listRaw.indexOf('How this store works');
  const gridIdx=listRaw.indexOf('results.items.map');
  check(discIdx>0&&discIdx<gridIdx,'disclosure renders ABOVE the product grid');
  const productCard=fs.readFileSync(ROOT+'/components/cards/product-card.tsx','utf8');
  check(/Affiliate link/.test(productCard),'affiliate cards are labelled as such');
  check(/product\.vendor/.test(productCard),'cards state who made the product');
  check(/sponsored/.test(detail),'affiliate buy links carry rel="sponsored"');
  check(/noreferrer/.test(detail)&&/noopener/.test(detail),'external buy links carry noreferrer and noopener');
  check(/opens in a new tab/.test(detail),'external links warn screen reader users');

  // ---- navigation
  const nav=fs.readFileSync(ROOT+'/lib/site-config.ts','utf8');
  check(/label: "Store", href: "\/store"/.test(nav),'Store is in the navigation');
  check((nav.match(/href: "\/store"/g)||[]).length>=2,'Store appears in both main nav and footer');
  check(/href: "\/discounts"/.test(nav),'Discounts page is still linked (kept separate)');
  check(/View Discounts/.test(listRaw),'store cross-links to discounts');
  } // end disclosure block

  { // ---- the repository boundary itself ----
  // Rule 1 in CLAUDE.md: pages read content only through lib/repositories.
  // Now that content comes from Hygraph, a page importing api/ directly would
  // quietly bypass every filter, sort and guardrail above.
  const offenders=[];
  const walk=(dir)=>{
    for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
      const p=path.join(dir,entry.name);
      if(entry.isDirectory()){ walk(p); continue; }
      if(!/\.tsx?$/.test(entry.name)) continue;
      const src=fs.readFileSync(p,'utf8');
      if(/from ["']@\/api\//.test(src)) offenders.push(path.relative(ROOT,p));
    }
  };
  for(const dir of ['app','components']) walk(path.join(ROOT,dir));
  check(offenders.length===0,`no page or component imports @/api directly${offenders.length?' -> '+offenders.join(', '):''}`);

  // The mock corpus is retired. What matters is that nothing reads it any
  // more — if the directory is still on disk it's dead weight, not a bug.
  const stillImporting=[];
  const scan=(dir)=>{
    for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
      const p=path.join(dir,entry.name);
      if(entry.isDirectory()){ if(!/node_modules|\.next/.test(p)) scan(p); continue; }
      if(!/\.tsx?$/.test(entry.name)) continue;
      if(/[\\/]lib[\\/]data[\\/]/.test(p)) continue; // the corpse may reference itself
      if(/from ["']@\/lib\/data\//.test(fs.readFileSync(p,'utf8'))) stillImporting.push(path.relative(ROOT,p));
    }
  };
  for(const dir of ['app','components','lib','api']) { const d=path.join(ROOT,dir); if(fs.existsSync(d)) scan(d); }
  check(stillImporting.length===0,`nothing imports lib/data — content comes from Hygraph${stillImporting.length?' -> '+stillImporting.join(', '):''}`);
  } // end boundary block

  console.log('\n--- PASS ---');
  ok.forEach(m=>console.log('  ok  ', m));
  if (fail.length) { console.log('\n--- FAIL ---'); fail.forEach(m=>console.log('  FAIL', m)); }
  console.log(`\n${ok.length} passed, ${fail.length} failed`);
  process.exit(fail.length?1:0);
})().catch(e=>{console.error('THREW:',e.message);process.exit(1);});
