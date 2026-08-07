const CODES =
  "AD AE AF AG AL AM AO AR AT AU AZ BA BB BD BE BF BG BH BI BJ BN BO BR BS BT BW BY BZ CA CD CF CG CH CI CL CM CN CO CR CU CV CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FM FR GA GB GD GE GH GM GN GQ GR GT GW GY HN HR HT HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KI KM KN KP KR KW KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MG MH MK ML MM MN MR MT MU MV MW MX MY MZ NA NE NG NI NL NO NP NR NZ OM PA PE PG PH PK PL PT PW PY QA RO RS RU RW SA SB SC SD SE SG SI SK SL SM SN SO SR SS ST SV SY SZ TD TG TH TJ TL TM TN TO TR TT TV TZ UA UG US UY UZ VA VC VE VN VU WS YE ZA ZM ZW".split(
    " ",
  );

export interface Country {
  code: string;
  name: string;
}

let cached: Country[] | null = null;

export function getCountries(): Country[] {
  if (cached) return cached;

  const display = new Intl.DisplayNames(["en"], { type: "region" });

  cached = CODES.map((code) => ({
    code,
    // Falls back to the raw code so an option can never render blank.
    name: display.of(code) ?? code,
  })).sort((a, b) => a.name.localeCompare(b.name));

  return cached;
}

export function getCountryName(code: string): string | null {
  return getCountries().find((country) => country.code === code)?.name ?? null;
}

export function isValidCountryCode(code: string): boolean {
  return CODES.includes(code);
}
