const BOT_PATTERNS = [
  /bot/i,
  /spider/i,
  /crawl/i,
  /slurp/i,
  /facebookexternalhit/i,
  /whatsapp/i,
  /telegram/i,
  /discordbot/i,
  /headlesschrome/i,
  /phantomjs/i,
  /puppeteer/i,
  /playwright/i,
  /selenium/i,
  /curl\//i,
  /wget\//i,
  /python-requests/i,
  /python-urllib/i,
  /go-http-client/i,
  /java\//i,
  /libwww-perl/i,
  /scrapy/i,
  /node-fetch/i,
  /okhttp/i,
  /pingdom/i,
  /uptimerobot/i,
  /statuscake/i,
  /bingpreview/i,
  /monitor/i,
];

export function isBotUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return true;
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}
