import { RawService } from "./types";
import { normalizeDomain } from "./utils";

// =============================================================================
// Seed List — 600+ subscription services organized by category
// =============================================================================

export const SEED_SERVICES: RawService[] = [

  // ===========================================================================
  // Streaming (~52)
  // ===========================================================================

  // --- Video Streaming ---
  { name: "Netflix", domain: "netflix.com", category_hint: "Streaming" },
  { name: "Hulu", domain: "hulu.com", category_hint: "Streaming" },
  { name: "Disney+", domain: "disneyplus.com", category_hint: "Streaming" },
  { name: "Amazon Prime Video", domain: "primevideo.com", category_hint: "Streaming" },
  { name: "HBO Max", domain: "max.com", category_hint: "Streaming" },
  { name: "Apple TV+", domain: "tv.apple.com", category_hint: "Streaming" },
  { name: "Peacock", domain: "peacocktv.com", category_hint: "Streaming" },
  { name: "Paramount+", domain: "paramountplus.com", category_hint: "Streaming" },
  { name: "Discovery+", domain: "discoveryplus.com", category_hint: "Streaming" },
  { name: "Crunchyroll", domain: "crunchyroll.com", category_hint: "Streaming" },
  { name: "Funimation", domain: "funimation.com", category_hint: "Streaming" },
  { name: "Shudder", domain: "shudder.com", category_hint: "Streaming" },
  { name: "Mubi", domain: "mubi.com", category_hint: "Streaming" },
  { name: "BritBox", domain: "britbox.com", category_hint: "Streaming" },
  { name: "Criterion Channel", domain: "criterionchannel.com", category_hint: "Streaming" },
  { name: "AMC+", domain: "amcplus.com", category_hint: "Streaming" },
  { name: "Starz", domain: "starz.com", category_hint: "Streaming" },
  { name: "Showtime", domain: "showtime.com", category_hint: "Streaming" },
  { name: "CuriosityStream", domain: "curiositystream.com", category_hint: "Streaming" },
  { name: "Tubi", domain: "tubitv.com", category_hint: "Streaming" },
  { name: "Vudu", domain: "vudu.com", category_hint: "Streaming" },
  { name: "Plex", domain: "plex.tv", category_hint: "Streaming" },
  { name: "Viki", domain: "viki.com", category_hint: "Streaming" },
  { name: "Hayu", domain: "hayu.com", category_hint: "Streaming" },
  { name: "MGM+", domain: "mgmplus.com", category_hint: "Streaming" },
  { name: "Acorn TV", domain: "acorn.tv", category_hint: "Streaming" },
  { name: "Hallmark Movies Now", domain: "hallmarkmovienow.com", category_hint: "Streaming" },
  { name: "Kanopy", domain: "kanopy.com", category_hint: "Streaming" },

  // --- Live TV & Sports Streaming ---
  { name: "YouTube TV", domain: "tv.youtube.com", category_hint: "Streaming" },
  { name: "Sling TV", domain: "sling.com", category_hint: "Streaming" },
  { name: "fuboTV", domain: "fubo.tv", category_hint: "Streaming" },
  { name: "Philo", domain: "philo.com", category_hint: "Streaming" },
  { name: "ESPN+", domain: "espnplus.com", category_hint: "Streaming" },
  { name: "DAZN", domain: "dazn.com", category_hint: "Streaming" },
  { name: "NBA League Pass", domain: "nba.com", category_hint: "Streaming" },
  { name: "MLB.tv", domain: "mlb.tv", category_hint: "Streaming" },
  { name: "NFL+", domain: "nfl.com", category_hint: "Streaming" },
  { name: "FloSports", domain: "flosports.tv", category_hint: "Streaming" },
  { name: "Bally Sports+", domain: "ballysports.com", category_hint: "Streaming" },

  // --- Twitch & Live Platforms ---
  { name: "Twitch", domain: "twitch.tv", category_hint: "Streaming" },
  { name: "YouTube Premium", domain: "youtube.com", category_hint: "Streaming" },
  { name: "Vimeo", domain: "vimeo.com", category_hint: "Streaming" },
  { name: "Nebula", domain: "nebula.tv", category_hint: "Streaming" },
  { name: "Dropout", domain: "dropout.tv", category_hint: "Streaming" },
  { name: "Rooster Teeth", domain: "roosterteeth.com", category_hint: "Streaming" },

  // --- International ---
  { name: "Stan", domain: "stan.com.au", category_hint: "Streaming" },
  { name: "Crave", domain: "crave.ca", category_hint: "Streaming" },
  { name: "NOW TV", domain: "nowtv.com", category_hint: "Streaming" },
  { name: "iQIYI", domain: "iq.com", category_hint: "Streaming" },
  { name: "Shahid", domain: "shahid.mbc.net", category_hint: "Streaming" },
  { name: "Hotstar", domain: "hotstar.com", category_hint: "Streaming" },
  { name: "Wavve", domain: "wavve.com", category_hint: "Streaming" },
  { name: "Kocowa", domain: "kocowa.com", category_hint: "Streaming" },
  { name: "Sundance Now", domain: "sundancenow.com", category_hint: "Streaming" },
  { name: "Tivify", domain: "tivify.tv", category_hint: "Streaming" },
  { name: "VRV", domain: "vrv.co", category_hint: "Streaming" },
  { name: "Docsville", domain: "docsville.com", category_hint: "Streaming" },
  { name: "Topic", domain: "topic.com", category_hint: "Streaming" },
  { name: "Dekkoo", domain: "dekkoo.com", category_hint: "Streaming" },
  { name: "Magellan TV", domain: "magellantv.com", category_hint: "Streaming" },

  // ===========================================================================
  // Music (~22)
  // ===========================================================================

  { name: "Spotify", domain: "spotify.com", category_hint: "Music" },
  { name: "Apple Music", domain: "music.apple.com", category_hint: "Music" },
  { name: "Amazon Music Unlimited", domain: "music.amazon.com", category_hint: "Music" },
  { name: "YouTube Music", domain: "music.youtube.com", category_hint: "Music" },
  { name: "Tidal", domain: "tidal.com", category_hint: "Music" },
  { name: "Deezer", domain: "deezer.com", category_hint: "Music" },
  { name: "Pandora", domain: "pandora.com", category_hint: "Music" },
  { name: "SoundCloud Go", domain: "soundcloud.com", category_hint: "Music" },
  { name: "iHeartRadio", domain: "iheart.com", category_hint: "Music" },
  { name: "Qobuz", domain: "qobuz.com", category_hint: "Music" },
  { name: "Audiomack", domain: "audiomack.com", category_hint: "Music" },
  { name: "Napster", domain: "napster.com", category_hint: "Music" },
  { name: "LiveOne", domain: "liveone.com", category_hint: "Music" },
  { name: "Idagio", domain: "idagio.com", category_hint: "Music" },
  { name: "Primephonic", domain: "primephonic.com", category_hint: "Music" },
  { name: "Audible", domain: "audible.com", category_hint: "Music" },
  { name: "Scribd", domain: "scribd.com", category_hint: "Music" },
  { name: "Pocket Casts", domain: "pocketcasts.com", category_hint: "Music" },
  { name: "Stitcher", domain: "stitcher.com", category_hint: "Music" },
  { name: "Luminary", domain: "luminarypodcasts.com", category_hint: "Music" },
  { name: "Mixcloud", domain: "mixcloud.com", category_hint: "Music" },
  { name: "Bandcamp", domain: "bandcamp.com", category_hint: "Music" },
  { name: "Anghami", domain: "anghami.com", category_hint: "Music" },
  { name: "Gaana", domain: "gaana.com", category_hint: "Music" },
  { name: "JioSaavn", domain: "jiosaavn.com", category_hint: "Music" },
  { name: "Nugs.net", domain: "nugs.net", category_hint: "Music" },

  // ===========================================================================
  // Gaming (~32)
  // ===========================================================================

  // --- Game Subscriptions ---
  { name: "Xbox Game Pass", domain: "xbox.com", category_hint: "Gaming" },
  { name: "PlayStation Plus", domain: "playstation.com", category_hint: "Gaming" },
  { name: "Nintendo Switch Online", domain: "nintendo.com", category_hint: "Gaming" },
  { name: "EA Play", domain: "ea.com", category_hint: "Gaming" },
  { name: "Ubisoft+", domain: "ubisoft.com", category_hint: "Gaming" },
  { name: "Humble Bundle", domain: "humblebundle.com", category_hint: "Gaming" },
  { name: "Apple Arcade", domain: "apple.com/apple-arcade", category_hint: "Gaming" },
  { name: "Google Play Pass", domain: "play.google.com", category_hint: "Gaming" },

  // --- Cloud Gaming ---
  { name: "GeForce NOW", domain: "nvidia.com/geforce-now", category_hint: "Gaming" },
  { name: "Xbox Cloud Gaming", domain: "xbox.com/play", category_hint: "Gaming" },
  { name: "Shadow", domain: "shadow.tech", category_hint: "Gaming" },
  { name: "Boosteroid", domain: "boosteroid.com", category_hint: "Gaming" },
  { name: "Blacknut", domain: "blacknut.com", category_hint: "Gaming" },

  // --- Gaming Platforms ---
  { name: "Steam", domain: "store.steampowered.com", category_hint: "Gaming" },
  { name: "Epic Games Store", domain: "epicgames.com", category_hint: "Gaming" },
  { name: "GOG", domain: "gog.com", category_hint: "Gaming" },
  { name: "itch.io", domain: "itch.io", category_hint: "Gaming" },
  { name: "Green Man Gaming", domain: "greenmangaming.com", category_hint: "Gaming" },
  { name: "Fanatical", domain: "fanatical.com", category_hint: "Gaming" },

  // --- Game-specific / MMO ---
  { name: "World of Warcraft", domain: "worldofwarcraft.blizzard.com", category_hint: "Gaming" },
  { name: "Final Fantasy XIV", domain: "finalfantasyxiv.com", category_hint: "Gaming" },
  { name: "Elder Scrolls Online", domain: "elderscrollsonline.com", category_hint: "Gaming" },
  { name: "RuneScape", domain: "runescape.com", category_hint: "Gaming" },
  { name: "EVE Online", domain: "eveonline.com", category_hint: "Gaming" },
  { name: "Star Citizen", domain: "robertsspaceindustries.com", category_hint: "Gaming" },

  // --- Gaming Tools ---
  { name: "Discord Nitro", domain: "discord.com", category_hint: "Gaming" },
  { name: "Overwolf", domain: "overwolf.com", category_hint: "Gaming" },
  { name: "Medal.tv", domain: "medal.tv", category_hint: "Gaming" },
  { name: "Parsec", domain: "parsec.app", category_hint: "Gaming" },
  { name: "Guilded", domain: "guilded.gg", category_hint: "Gaming" },
  { name: "Roblox Premium", domain: "roblox.com", category_hint: "Gaming" },
  { name: "Fortnite Crew", domain: "fortnite.com", category_hint: "Gaming" },
  { name: "Xbox Live Gold", domain: "xbox.com/live", category_hint: "Gaming" },
  { name: "Twitch Turbo", domain: "twitch.tv/turbo", category_hint: "Gaming" },
  { name: "Genshin Impact Welkin Moon", domain: "genshin.hoyoverse.com", category_hint: "Gaming" },
  { name: "Antstream Arcade", domain: "antstream.com", category_hint: "Gaming" },
  { name: "Utomik", domain: "utomik.com", category_hint: "Gaming" },

  // ===========================================================================
  // AI Tools (~42)
  // ===========================================================================

  // --- AI Assistants & Chatbots ---
  { name: "ChatGPT Plus", domain: "chat.openai.com", category_hint: "AI Tools" },
  { name: "Claude Pro", domain: "claude.ai", category_hint: "AI Tools" },
  { name: "Google Gemini", domain: "gemini.google.com", category_hint: "AI Tools" },
  { name: "Microsoft Copilot Pro", domain: "copilot.microsoft.com", category_hint: "AI Tools" },
  { name: "Perplexity Pro", domain: "perplexity.ai", category_hint: "AI Tools" },
  { name: "Poe", domain: "poe.com", category_hint: "AI Tools" },
  { name: "Character.AI", domain: "character.ai", category_hint: "AI Tools" },
  { name: "You.com", domain: "you.com", category_hint: "AI Tools" },
  { name: "Inflection Pi", domain: "pi.ai", category_hint: "AI Tools" },
  { name: "Cohere", domain: "cohere.com", category_hint: "AI Tools" },

  // --- AI Image & Video Generation ---
  { name: "Midjourney", domain: "midjourney.com", category_hint: "AI Tools" },
  { name: "DALL-E", domain: "openai.com/dall-e", category_hint: "AI Tools" },
  { name: "Stable Diffusion (DreamStudio)", domain: "dreamstudio.ai", category_hint: "AI Tools" },
  { name: "Leonardo AI", domain: "leonardo.ai", category_hint: "AI Tools" },
  { name: "Runway", domain: "runwayml.com", category_hint: "AI Tools" },
  { name: "Synthesia", domain: "synthesia.io", category_hint: "AI Tools" },
  { name: "D-ID", domain: "d-id.com", category_hint: "AI Tools" },
  { name: "HeyGen", domain: "heygen.com", category_hint: "AI Tools" },
  { name: "Luma AI", domain: "lumalabs.ai", category_hint: "AI Tools" },
  { name: "Ideogram", domain: "ideogram.ai", category_hint: "AI Tools" },
  { name: "NightCafe", domain: "nightcafe.studio", category_hint: "AI Tools" },

  // --- AI Writing & Content ---
  { name: "Jasper AI", domain: "jasper.ai", category_hint: "AI Tools" },
  { name: "Copy.ai", domain: "copy.ai", category_hint: "AI Tools" },
  { name: "Writesonic", domain: "writesonic.com", category_hint: "AI Tools" },
  { name: "Rytr", domain: "rytr.me", category_hint: "AI Tools" },
  { name: "Sudowrite", domain: "sudowrite.com", category_hint: "AI Tools" },
  { name: "WordTune", domain: "wordtune.com", category_hint: "AI Tools" },
  { name: "Anyword", domain: "anyword.com", category_hint: "AI Tools" },
  { name: "Writer", domain: "writer.com", category_hint: "AI Tools" },

  // --- AI Coding ---
  { name: "GitHub Copilot", domain: "github.com/features/copilot", category_hint: "AI Tools" },
  { name: "Cursor", domain: "cursor.com", category_hint: "AI Tools" },
  { name: "Tabnine", domain: "tabnine.com", category_hint: "AI Tools" },
  { name: "Codeium", domain: "codeium.com", category_hint: "AI Tools" },
  { name: "Replit AI", domain: "replit.com", category_hint: "AI Tools" },
  { name: "Sourcegraph Cody", domain: "sourcegraph.com", category_hint: "AI Tools" },

  // --- AI Audio & Speech ---
  { name: "ElevenLabs", domain: "elevenlabs.io", category_hint: "AI Tools" },
  { name: "Murf AI", domain: "murf.ai", category_hint: "AI Tools" },
  { name: "Resemble AI", domain: "resemble.ai", category_hint: "AI Tools" },
  { name: "Descript", domain: "descript.com", category_hint: "AI Tools" },
  { name: "Otter.ai", domain: "otter.ai", category_hint: "AI Tools" },
  { name: "Fireflies.ai", domain: "fireflies.ai", category_hint: "AI Tools" },

  // --- AI Misc ---
  { name: "Grammarly", domain: "grammarly.com", category_hint: "AI Tools" },
  { name: "Notion AI", domain: "notion.so/product/ai", category_hint: "AI Tools" },
  { name: "Tome", domain: "tome.app", category_hint: "AI Tools" },
  { name: "Beautiful.ai", domain: "beautiful.ai", category_hint: "AI Tools" },
  { name: "Gamma", domain: "gamma.app", category_hint: "AI Tools" },
  { name: "Pictory", domain: "pictory.ai", category_hint: "AI Tools" },
  { name: "Photoroom", domain: "photoroom.com", category_hint: "AI Tools" },

  // ===========================================================================
  // Developer Tools (~55)
  // ===========================================================================

  // --- Hosting & Deployment ---
  { name: "Vercel", domain: "vercel.com", category_hint: "Developer Tools" },
  { name: "Netlify", domain: "netlify.com", category_hint: "Developer Tools" },
  { name: "Heroku", domain: "heroku.com", category_hint: "Developer Tools" },
  { name: "Render", domain: "render.com", category_hint: "Developer Tools" },
  { name: "Railway", domain: "railway.app", category_hint: "Developer Tools" },
  { name: "Fly.io", domain: "fly.io", category_hint: "Developer Tools" },
  { name: "DigitalOcean", domain: "digitalocean.com", category_hint: "Developer Tools" },
  { name: "Linode", domain: "linode.com", category_hint: "Developer Tools" },
  { name: "Cloudflare", domain: "cloudflare.com", category_hint: "Developer Tools" },
  { name: "AWS", domain: "aws.amazon.com", category_hint: "Developer Tools" },
  { name: "Google Cloud Platform", domain: "cloud.google.com", category_hint: "Developer Tools" },
  { name: "Microsoft Azure", domain: "azure.microsoft.com", category_hint: "Developer Tools" },

  // --- CI/CD & DevOps ---
  { name: "GitHub", domain: "github.com", category_hint: "Developer Tools" },
  { name: "GitLab", domain: "gitlab.com", category_hint: "Developer Tools" },
  { name: "Bitbucket", domain: "bitbucket.org", category_hint: "Developer Tools" },
  { name: "CircleCI", domain: "circleci.com", category_hint: "Developer Tools" },
  { name: "Travis CI", domain: "travis-ci.com", category_hint: "Developer Tools" },
  { name: "Jenkins X", domain: "jenkins-x.io", category_hint: "Developer Tools" },
  { name: "TeamCity", domain: "jetbrains.com/teamcity", category_hint: "Developer Tools" },
  { name: "Buildkite", domain: "buildkite.com", category_hint: "Developer Tools" },
  { name: "Semaphore", domain: "semaphoreci.com", category_hint: "Developer Tools" },

  // --- Monitoring & Observability ---
  { name: "Datadog", domain: "datadoghq.com", category_hint: "Developer Tools" },
  { name: "New Relic", domain: "newrelic.com", category_hint: "Developer Tools" },
  { name: "Sentry", domain: "sentry.io", category_hint: "Developer Tools" },
  { name: "PagerDuty", domain: "pagerduty.com", category_hint: "Developer Tools" },
  { name: "Grafana Cloud", domain: "grafana.com", category_hint: "Developer Tools" },
  { name: "LogRocket", domain: "logrocket.com", category_hint: "Developer Tools" },
  { name: "Honeycomb", domain: "honeycomb.io", category_hint: "Developer Tools" },
  { name: "Splunk", domain: "splunk.com", category_hint: "Developer Tools" },
  { name: "Dynatrace", domain: "dynatrace.com", category_hint: "Developer Tools" },

  // --- APIs & Backend Services ---
  { name: "Twilio", domain: "twilio.com", category_hint: "Developer Tools" },
  { name: "SendGrid", domain: "sendgrid.com", category_hint: "Developer Tools" },
  { name: "Stripe", domain: "stripe.com", category_hint: "Developer Tools" },
  { name: "Auth0", domain: "auth0.com", category_hint: "Developer Tools" },
  { name: "Algolia", domain: "algolia.com", category_hint: "Developer Tools" },
  { name: "Contentful", domain: "contentful.com", category_hint: "Developer Tools" },
  { name: "Sanity", domain: "sanity.io", category_hint: "Developer Tools" },
  { name: "Supabase", domain: "supabase.com", category_hint: "Developer Tools" },
  { name: "Firebase", domain: "firebase.google.com", category_hint: "Developer Tools" },
  { name: "Postman", domain: "postman.com", category_hint: "Developer Tools" },
  { name: "RapidAPI", domain: "rapidapi.com", category_hint: "Developer Tools" },

  // --- Databases ---
  { name: "MongoDB Atlas", domain: "mongodb.com", category_hint: "Developer Tools" },
  { name: "PlanetScale", domain: "planetscale.com", category_hint: "Developer Tools" },
  { name: "Neon", domain: "neon.tech", category_hint: "Developer Tools" },
  { name: "CockroachDB", domain: "cockroachlabs.com", category_hint: "Developer Tools" },
  { name: "Redis Cloud", domain: "redis.com", category_hint: "Developer Tools" },
  { name: "Fauna", domain: "fauna.com", category_hint: "Developer Tools" },
  { name: "Upstash", domain: "upstash.com", category_hint: "Developer Tools" },

  // --- IDEs & Dev Environments ---
  { name: "JetBrains All Products", domain: "jetbrains.com", category_hint: "Developer Tools" },
  { name: "Codespaces", domain: "github.com/codespaces", category_hint: "Developer Tools" },
  { name: "Gitpod", domain: "gitpod.io", category_hint: "Developer Tools" },
  { name: "CodeSandbox", domain: "codesandbox.io", category_hint: "Developer Tools" },
  { name: "StackBlitz", domain: "stackblitz.com", category_hint: "Developer Tools" },
  { name: "Snyk", domain: "snyk.io", category_hint: "Developer Tools" },
  { name: "SonarCloud", domain: "sonarcloud.io", category_hint: "Developer Tools" },
  { name: "LaunchDarkly", domain: "launchdarkly.com", category_hint: "Developer Tools" },
  { name: "Terraform Cloud", domain: "app.terraform.io", category_hint: "Developer Tools" },
  { name: "Pulumi", domain: "pulumi.com", category_hint: "Developer Tools" },
  { name: "Doppler", domain: "doppler.com", category_hint: "Developer Tools" },
  { name: "Retool", domain: "retool.com", category_hint: "Developer Tools" },
  { name: "Appsmith", domain: "appsmith.com", category_hint: "Developer Tools" },

  // ===========================================================================
  // Software (~40)
  // ===========================================================================

  // --- Security & Antivirus ---
  { name: "Norton 360", domain: "norton.com", category_hint: "Software" },
  { name: "McAfee", domain: "mcafee.com", category_hint: "Software" },
  { name: "Bitdefender", domain: "bitdefender.com", category_hint: "Software" },
  { name: "Kaspersky", domain: "kaspersky.com", category_hint: "Software" },
  { name: "Malwarebytes", domain: "malwarebytes.com", category_hint: "Software" },
  { name: "ESET", domain: "eset.com", category_hint: "Software" },
  { name: "Avast", domain: "avast.com", category_hint: "Software" },
  { name: "Trend Micro", domain: "trendmicro.com", category_hint: "Software" },
  { name: "Webroot", domain: "webroot.com", category_hint: "Software" },

  // --- Password Managers ---
  { name: "1Password", domain: "1password.com", category_hint: "Software" },
  { name: "LastPass", domain: "lastpass.com", category_hint: "Software" },
  { name: "Dashlane", domain: "dashlane.com", category_hint: "Software" },
  { name: "Bitwarden", domain: "bitwarden.com", category_hint: "Software" },
  { name: "Keeper", domain: "keepersecurity.com", category_hint: "Software" },
  { name: "NordPass", domain: "nordpass.com", category_hint: "Software" },
  { name: "RoboForm", domain: "roboform.com", category_hint: "Software" },

  // --- Office & Productivity Suites ---
  { name: "Microsoft 365", domain: "microsoft.com/microsoft-365", category_hint: "Software" },
  { name: "Google Workspace", domain: "workspace.google.com", category_hint: "Software" },
  { name: "LibreOffice (Enterprise)", domain: "libreoffice.org", category_hint: "Software" },
  { name: "Zoho One", domain: "zoho.com", category_hint: "Software" },

  // --- System Utilities ---
  { name: "CleanMyMac", domain: "macpaw.com", category_hint: "Software" },
  { name: "CCleaner", domain: "ccleaner.com", category_hint: "Software" },
  { name: "Parallels Desktop", domain: "parallels.com", category_hint: "Software" },
  { name: "VMware Fusion", domain: "vmware.com", category_hint: "Software" },
  { name: "Alfred", domain: "alfredapp.com", category_hint: "Software" },
  { name: "Bartender", domain: "macbartender.com", category_hint: "Software" },
  { name: "BetterTouchTool", domain: "folivora.ai", category_hint: "Software" },
  { name: "iStat Menus", domain: "bjango.com", category_hint: "Software" },
  { name: "TextExpander", domain: "textexpander.com", category_hint: "Software" },
  { name: "Setapp", domain: "setapp.com", category_hint: "Software" },

  // --- Email Clients ---
  { name: "Spark", domain: "sparkmailapp.com", category_hint: "Software" },
  { name: "Superhuman", domain: "superhuman.com", category_hint: "Software" },
  { name: "Hey", domain: "hey.com", category_hint: "Software" },
  { name: "Fastmail", domain: "fastmail.com", category_hint: "Software" },
  { name: "ProtonMail", domain: "proton.me", category_hint: "Software" },
  { name: "Tutanota", domain: "tutanota.com", category_hint: "Software" },
  { name: "Mailfence", domain: "mailfence.com", category_hint: "Software" },

  // --- Backup / Recovery ---
  { name: "Acronis", domain: "acronis.com", category_hint: "Software" },
  { name: "EaseUS", domain: "easeus.com", category_hint: "Software" },
  { name: "Disk Drill", domain: "cleverfiles.com", category_hint: "Software" },
  { name: "Cardhop", domain: "flexibits.com/cardhop", category_hint: "Software" },
  { name: "PDF Expert", domain: "pdfexpert.com", category_hint: "Software" },
  { name: "Ulysses", domain: "ulysses.app", category_hint: "Software" },
  { name: "Day One", domain: "dayoneapp.com", category_hint: "Software" },
  { name: "Paste", domain: "pasteapp.io", category_hint: "Software" },

  // ===========================================================================
  // Productivity (~42)
  // ===========================================================================

  // --- Project Management ---
  { name: "Jira", domain: "atlassian.com/software/jira", category_hint: "Productivity" },
  { name: "Asana", domain: "asana.com", category_hint: "Productivity" },
  { name: "Monday.com", domain: "monday.com", category_hint: "Productivity" },
  { name: "Trello", domain: "trello.com", category_hint: "Productivity" },
  { name: "ClickUp", domain: "clickup.com", category_hint: "Productivity" },
  { name: "Linear", domain: "linear.app", category_hint: "Productivity" },
  { name: "Basecamp", domain: "basecamp.com", category_hint: "Productivity" },
  { name: "Wrike", domain: "wrike.com", category_hint: "Productivity" },
  { name: "Smartsheet", domain: "smartsheet.com", category_hint: "Productivity" },
  { name: "Teamwork", domain: "teamwork.com", category_hint: "Productivity" },
  { name: "Height", domain: "height.app", category_hint: "Productivity" },
  { name: "Shortcut", domain: "shortcut.com", category_hint: "Productivity" },

  // --- Note-Taking & Knowledge ---
  { name: "Notion", domain: "notion.so", category_hint: "Productivity" },
  { name: "Obsidian Sync", domain: "obsidian.md", category_hint: "Productivity" },
  { name: "Evernote", domain: "evernote.com", category_hint: "Productivity" },
  { name: "Roam Research", domain: "roamresearch.com", category_hint: "Productivity" },
  { name: "Bear", domain: "bear.app", category_hint: "Productivity" },
  { name: "Craft", domain: "craft.do", category_hint: "Productivity" },
  { name: "Mem", domain: "mem.ai", category_hint: "Productivity" },
  { name: "Coda", domain: "coda.io", category_hint: "Productivity" },
  { name: "Logseq", domain: "logseq.com", category_hint: "Productivity" },
  { name: "Scrintal", domain: "scrintal.com", category_hint: "Productivity" },

  // --- Communication ---
  { name: "Slack", domain: "slack.com", category_hint: "Productivity" },
  { name: "Microsoft Teams", domain: "teams.microsoft.com", category_hint: "Productivity" },
  { name: "Zoom", domain: "zoom.us", category_hint: "Productivity" },
  { name: "Loom", domain: "loom.com", category_hint: "Productivity" },
  { name: "Krisp", domain: "krisp.ai", category_hint: "Productivity" },
  { name: "Calendly", domain: "calendly.com", category_hint: "Productivity" },
  { name: "Cal.com", domain: "cal.com", category_hint: "Productivity" },

  // --- Whiteboards & Collaboration ---
  { name: "Miro", domain: "miro.com", category_hint: "Productivity" },
  { name: "FigJam", domain: "figma.com/figjam", category_hint: "Productivity" },
  { name: "Mural", domain: "mural.co", category_hint: "Productivity" },
  { name: "Whimsical", domain: "whimsical.com", category_hint: "Productivity" },

  // --- Time Tracking & Focus ---
  { name: "Toggl", domain: "toggl.com", category_hint: "Productivity" },
  { name: "Clockify", domain: "clockify.me", category_hint: "Productivity" },
  { name: "RescueTime", domain: "rescuetime.com", category_hint: "Productivity" },
  { name: "Harvest", domain: "getharvest.com", category_hint: "Productivity" },
  { name: "Todoist", domain: "todoist.com", category_hint: "Productivity" },
  { name: "Any.do", domain: "any.do", category_hint: "Productivity" },
  { name: "Things 3", domain: "culturedcode.com", category_hint: "Productivity" },
  { name: "Fantastical", domain: "flexibits.com", category_hint: "Productivity" },
  { name: "Sunsama", domain: "sunsama.com", category_hint: "Productivity" },
  { name: "Akiflow", domain: "akiflow.com", category_hint: "Productivity" },
  { name: "Reclaim AI", domain: "reclaim.ai", category_hint: "Productivity" },
  { name: "Motion", domain: "usemotion.com", category_hint: "Productivity" },
  { name: "Tana", domain: "tana.inc", category_hint: "Productivity" },
  { name: "Capacities", domain: "capacities.io", category_hint: "Productivity" },
  { name: "Twist", domain: "twist.com", category_hint: "Productivity" },

  // ===========================================================================
  // Education (~42)
  // ===========================================================================

  // --- Learning Platforms ---
  { name: "Coursera", domain: "coursera.org", category_hint: "Education" },
  { name: "Udemy", domain: "udemy.com", category_hint: "Education" },
  { name: "edX", domain: "edx.org", category_hint: "Education" },
  { name: "LinkedIn Learning", domain: "linkedin.com/learning", category_hint: "Education" },
  { name: "Skillshare", domain: "skillshare.com", category_hint: "Education" },
  { name: "Pluralsight", domain: "pluralsight.com", category_hint: "Education" },
  { name: "Udacity", domain: "udacity.com", category_hint: "Education" },
  { name: "Khan Academy", domain: "khanacademy.org", category_hint: "Education" },
  { name: "Codecademy", domain: "codecademy.com", category_hint: "Education" },
  { name: "DataCamp", domain: "datacamp.com", category_hint: "Education" },
  { name: "Treehouse", domain: "teamtreehouse.com", category_hint: "Education" },
  { name: "freeCodeCamp (Donations)", domain: "freecodecamp.org", category_hint: "Education" },
  { name: "Frontend Masters", domain: "frontendmasters.com", category_hint: "Education" },
  { name: "Egghead.io", domain: "egghead.io", category_hint: "Education" },
  { name: "LeetCode", domain: "leetcode.com", category_hint: "Education" },
  { name: "HackerRank", domain: "hackerrank.com", category_hint: "Education" },
  { name: "AlgoExpert", domain: "algoexpert.io", category_hint: "Education" },
  { name: "Educative", domain: "educative.io", category_hint: "Education" },
  { name: "Brilliant", domain: "brilliant.org", category_hint: "Education" },

  // --- Language Learning ---
  { name: "Duolingo", domain: "duolingo.com", category_hint: "Education" },
  { name: "Babbel", domain: "babbel.com", category_hint: "Education" },
  { name: "Rosetta Stone", domain: "rosettastone.com", category_hint: "Education" },
  { name: "Busuu", domain: "busuu.com", category_hint: "Education" },
  { name: "Pimsleur", domain: "pimsleur.com", category_hint: "Education" },
  { name: "italki", domain: "italki.com", category_hint: "Education" },
  { name: "Lingoda", domain: "lingoda.com", category_hint: "Education" },
  { name: "Preply", domain: "preply.com", category_hint: "Education" },
  { name: "Memrise", domain: "memrise.com", category_hint: "Education" },
  { name: "FluentU", domain: "fluentu.com", category_hint: "Education" },

  // --- Reading & Research ---
  { name: "Kindle Unlimited", domain: "amazon.com/kindle-unlimited", category_hint: "Education" },
  { name: "Blinkist", domain: "blinkist.com", category_hint: "Education" },
  { name: "Headway", domain: "headway.com", category_hint: "Education" },
  { name: "Medium", domain: "medium.com", category_hint: "Education" },
  { name: "Substack", domain: "substack.com", category_hint: "Education" },

  // --- Kids / Family Education ---
  { name: "ABCmouse", domain: "abcmouse.com", category_hint: "Education" },
  { name: "Homer", domain: "learnwithhomer.com", category_hint: "Education" },
  { name: "Outschool", domain: "outschool.com", category_hint: "Education" },

  // --- Professional Certs & Training ---
  { name: "O'Reilly Learning", domain: "oreilly.com", category_hint: "Education" },
  { name: "A Cloud Guru", domain: "acloudguru.com", category_hint: "Education" },
  { name: "CBT Nuggets", domain: "cbtnuggets.com", category_hint: "Education" },
  { name: "MasterClass", domain: "masterclass.com", category_hint: "Education" },
  { name: "Domestika", domain: "domestika.org", category_hint: "Education" },
  { name: "Coursera for Business", domain: "coursera.org/business", category_hint: "Education" },
  { name: "Chegg", domain: "chegg.com", category_hint: "Education" },
  { name: "Quizlet Plus", domain: "quizlet.com", category_hint: "Education" },
  { name: "Wondrium", domain: "wondrium.com", category_hint: "Education" },

  // ===========================================================================
  // Cloud (~18) — Compute, Backup, Infrastructure
  // ===========================================================================

  { name: "Google One", domain: "one.google.com", category_hint: "Cloud" },
  { name: "iCloud+", domain: "icloud.com", category_hint: "Cloud" },
  { name: "Backblaze", domain: "backblaze.com", category_hint: "Cloud" },
  { name: "Carbonite", domain: "carbonite.com", category_hint: "Cloud" },
  { name: "IDrive", domain: "idrive.com", category_hint: "Cloud" },
  { name: "CrashPlan", domain: "crashplan.com", category_hint: "Cloud" },
  { name: "Wasabi", domain: "wasabi.com", category_hint: "Cloud" },
  { name: "Vultr", domain: "vultr.com", category_hint: "Cloud" },
  { name: "Hetzner Cloud", domain: "hetzner.com", category_hint: "Cloud" },
  { name: "Oracle Cloud", domain: "cloud.oracle.com", category_hint: "Cloud" },
  { name: "IBM Cloud", domain: "cloud.ibm.com", category_hint: "Cloud" },
  { name: "Alibaba Cloud", domain: "alibabacloud.com", category_hint: "Cloud" },
  { name: "OVHcloud", domain: "ovhcloud.com", category_hint: "Cloud" },
  { name: "Scaleway", domain: "scaleway.com", category_hint: "Cloud" },
  { name: "UpCloud", domain: "upcloud.com", category_hint: "Cloud" },
  { name: "Kamatera", domain: "kamatera.com", category_hint: "Cloud" },
  { name: "SpiderOak", domain: "spideroak.com", category_hint: "Cloud" },
  { name: "Arq Backup", domain: "arqbackup.com", category_hint: "Cloud" },
  { name: "Rackspace", domain: "rackspace.com", category_hint: "Cloud" },
  { name: "Backblaze B2", domain: "backblaze.com/b2", category_hint: "Cloud" },

  // ===========================================================================
  // Storage (~16) — File Storage & Sync
  // ===========================================================================

  { name: "Dropbox", domain: "dropbox.com", category_hint: "Storage" },
  { name: "Box", domain: "box.com", category_hint: "Storage" },
  { name: "OneDrive", domain: "onedrive.live.com", category_hint: "Storage" },
  { name: "Google Drive", domain: "drive.google.com", category_hint: "Storage" },
  { name: "pCloud", domain: "pcloud.com", category_hint: "Storage" },
  { name: "MEGA", domain: "mega.io", category_hint: "Storage" },
  { name: "Sync.com", domain: "sync.com", category_hint: "Storage" },
  { name: "Tresorit", domain: "tresorit.com", category_hint: "Storage" },
  { name: "Internxt", domain: "internxt.com", category_hint: "Storage" },
  { name: "Icedrive", domain: "icedrive.net", category_hint: "Storage" },
  { name: "Koofr", domain: "koofr.eu", category_hint: "Storage" },
  { name: "Nextcloud", domain: "nextcloud.com", category_hint: "Storage" },
  { name: "Egnyte", domain: "egnyte.com", category_hint: "Storage" },
  { name: "ShareFile", domain: "sharefile.com", category_hint: "Storage" },
  { name: "Hightail", domain: "hightail.com", category_hint: "Storage" },
  { name: "WeTransfer", domain: "wetransfer.com", category_hint: "Storage" },
  { name: "Filen", domain: "filen.io", category_hint: "Storage" },
  { name: "Degoo", domain: "degoo.com", category_hint: "Storage" },

  // ===========================================================================
  // Design Tools (~26)
  // ===========================================================================

  // --- Design & Prototyping ---
  { name: "Figma", domain: "figma.com", category_hint: "Design Tools" },
  { name: "Sketch", domain: "sketch.com", category_hint: "Design Tools" },
  { name: "Adobe Creative Cloud", domain: "adobe.com", category_hint: "Design Tools" },
  { name: "InVision", domain: "invisionapp.com", category_hint: "Design Tools" },
  { name: "Framer", domain: "framer.com", category_hint: "Design Tools" },
  { name: "Webflow", domain: "webflow.com", category_hint: "Design Tools" },
  { name: "Canva", domain: "canva.com", category_hint: "Design Tools" },
  { name: "Penpot", domain: "penpot.app", category_hint: "Design Tools" },
  { name: "Lunacy", domain: "icons8.com/lunacy", category_hint: "Design Tools" },
  { name: "Zeplin", domain: "zeplin.io", category_hint: "Design Tools" },

  // --- Photo & Video Editing ---
  { name: "Lightroom", domain: "lightroom.adobe.com", category_hint: "Design Tools" },
  { name: "Affinity Photo", domain: "affinity.serif.com", category_hint: "Design Tools" },
  { name: "Pixelmator Pro", domain: "pixelmator.com", category_hint: "Design Tools" },
  { name: "DaVinci Resolve Studio", domain: "blackmagicdesign.com", category_hint: "Design Tools" },
  { name: "Final Cut Pro", domain: "apple.com/final-cut-pro", category_hint: "Design Tools" },
  { name: "CapCut Pro", domain: "capcut.com", category_hint: "Design Tools" },
  { name: "Veed.io", domain: "veed.io", category_hint: "Design Tools" },

  // --- Icons, Fonts & Assets ---
  { name: "Noun Project", domain: "thenounproject.com", category_hint: "Design Tools" },
  { name: "Envato Elements", domain: "elements.envato.com", category_hint: "Design Tools" },
  { name: "Shutterstock", domain: "shutterstock.com", category_hint: "Design Tools" },
  { name: "Adobe Stock", domain: "stock.adobe.com", category_hint: "Design Tools" },
  { name: "iStock", domain: "istockphoto.com", category_hint: "Design Tools" },
  { name: "Unsplash+", domain: "unsplash.com", category_hint: "Design Tools" },
  { name: "Iconjar", domain: "geticonjar.com", category_hint: "Design Tools" },

  // --- 3D & Motion ---
  { name: "Spline", domain: "spline.design", category_hint: "Design Tools" },
  { name: "Rive", domain: "rive.app", category_hint: "Design Tools" },
  { name: "Lottiefiles", domain: "lottiefiles.com", category_hint: "Design Tools" },
  { name: "Principle", domain: "principleformac.com", category_hint: "Design Tools" },
  { name: "ProtoPie", domain: "protopie.io", category_hint: "Design Tools" },
  { name: "Maze", domain: "maze.co", category_hint: "Design Tools" },
  { name: "Creative Market", domain: "creativemarket.com", category_hint: "Design Tools" },

  // ===========================================================================
  // Fitness (~30)
  // ===========================================================================

  // --- Fitness Apps ---
  { name: "Peloton", domain: "onepeloton.com", category_hint: "Fitness" },
  { name: "Strava", domain: "strava.com", category_hint: "Fitness" },
  { name: "MyFitnessPal", domain: "myfitnesspal.com", category_hint: "Fitness" },
  { name: "Fitbit Premium", domain: "fitbit.com", category_hint: "Fitness" },
  { name: "Apple Fitness+", domain: "apple.com/apple-fitness-plus", category_hint: "Fitness" },
  { name: "Nike Training Club", domain: "nike.com", category_hint: "Fitness" },
  { name: "Beachbody", domain: "beachbodyondemand.com", category_hint: "Fitness" },
  { name: "Les Mills+", domain: "lesmills.com", category_hint: "Fitness" },
  { name: "Centr", domain: "centr.com", category_hint: "Fitness" },
  { name: "SWEAT", domain: "sweat.com", category_hint: "Fitness" },
  { name: "Freeletics", domain: "freeletics.com", category_hint: "Fitness" },
  { name: "Gymshark Training", domain: "gymshark.com", category_hint: "Fitness" },
  { name: "FitOn", domain: "fitonapp.com", category_hint: "Fitness" },
  { name: "Alo Moves", domain: "alomoves.com", category_hint: "Fitness" },
  { name: "Aaptiv", domain: "aaptiv.com", category_hint: "Fitness" },
  { name: "Zwift", domain: "zwift.com", category_hint: "Fitness" },
  { name: "TrainerRoad", domain: "trainerroad.com", category_hint: "Fitness" },
  { name: "Garmin Connect", domain: "connect.garmin.com", category_hint: "Fitness" },
  { name: "WHOOP", domain: "whoop.com", category_hint: "Fitness" },
  { name: "Oura Ring", domain: "ouraring.com", category_hint: "Fitness" },

  // --- Meditation & Wellness ---
  { name: "Headspace", domain: "headspace.com", category_hint: "Fitness" },
  { name: "Calm", domain: "calm.com", category_hint: "Fitness" },
  { name: "Waking Up", domain: "wakingup.com", category_hint: "Fitness" },
  { name: "Insight Timer", domain: "insighttimer.com", category_hint: "Fitness" },
  { name: "Ten Percent Happier", domain: "tenpercent.com", category_hint: "Fitness" },
  { name: "Meditopia", domain: "meditopia.com", category_hint: "Fitness" },
  { name: "Balance", domain: "balanceapp.com", category_hint: "Fitness" },

  // --- Nutrition ---
  { name: "Noom", domain: "noom.com", category_hint: "Fitness" },
  { name: "Cronometer", domain: "cronometer.com", category_hint: "Fitness" },
  { name: "Lose It!", domain: "loseit.com", category_hint: "Fitness" },
  { name: "Ladder", domain: "joinladder.com", category_hint: "Fitness" },
  { name: "Future", domain: "future.co", category_hint: "Fitness" },
  { name: "Tempo", domain: "tempo.fit", category_hint: "Fitness" },
  { name: "Tonal", domain: "tonal.com", category_hint: "Fitness" },

  // ===========================================================================
  // News (~32)
  // ===========================================================================

  // --- Newspapers ---
  { name: "The New York Times", domain: "nytimes.com", category_hint: "News" },
  { name: "The Washington Post", domain: "washingtonpost.com", category_hint: "News" },
  { name: "The Wall Street Journal", domain: "wsj.com", category_hint: "News" },
  { name: "Financial Times", domain: "ft.com", category_hint: "News" },
  { name: "The Guardian", domain: "theguardian.com", category_hint: "News" },
  { name: "The Economist", domain: "economist.com", category_hint: "News" },
  { name: "Bloomberg", domain: "bloomberg.com", category_hint: "News" },
  { name: "Reuters", domain: "reuters.com", category_hint: "News" },
  { name: "The Athletic", domain: "theathletic.com", category_hint: "News" },
  { name: "The Information", domain: "theinformation.com", category_hint: "News" },
  { name: "Barron's", domain: "barrons.com", category_hint: "News" },
  { name: "The Telegraph", domain: "telegraph.co.uk", category_hint: "News" },
  { name: "The Times", domain: "thetimes.co.uk", category_hint: "News" },
  { name: "Los Angeles Times", domain: "latimes.com", category_hint: "News" },
  { name: "USA Today", domain: "usatoday.com", category_hint: "News" },
  { name: "Boston Globe", domain: "bostonglobe.com", category_hint: "News" },

  // --- Magazines ---
  { name: "Wired", domain: "wired.com", category_hint: "News" },
  { name: "The New Yorker", domain: "newyorker.com", category_hint: "News" },
  { name: "The Atlantic", domain: "theatlantic.com", category_hint: "News" },
  { name: "Vanity Fair", domain: "vanityfair.com", category_hint: "News" },
  { name: "Vogue", domain: "vogue.com", category_hint: "News" },
  { name: "GQ", domain: "gq.com", category_hint: "News" },
  { name: "National Geographic", domain: "nationalgeographic.com", category_hint: "News" },
  { name: "Time", domain: "time.com", category_hint: "News" },
  { name: "Forbes", domain: "forbes.com", category_hint: "News" },

  // --- News Services & Aggregators ---
  { name: "Apple News+", domain: "apple.com/apple-news", category_hint: "News" },
  { name: "Google News", domain: "news.google.com", category_hint: "News" },
  { name: "Flipboard", domain: "flipboard.com", category_hint: "News" },
  { name: "Feedly", domain: "feedly.com", category_hint: "News" },
  { name: "Inoreader", domain: "inoreader.com", category_hint: "News" },
  { name: "The Skimm", domain: "theskimm.com", category_hint: "News" },
  { name: "Morning Brew", domain: "morningbrew.com", category_hint: "News" },
  { name: "Stratechery", domain: "stratechery.com", category_hint: "News" },
  { name: "The Dispatch", domain: "thedispatch.com", category_hint: "News" },
  { name: "Semafor", domain: "semafor.com", category_hint: "News" },
  { name: "Axios Pro", domain: "axios.com", category_hint: "News" },
  { name: "Politico Pro", domain: "politico.com", category_hint: "News" },
  { name: "The Daily Wire", domain: "dailywire.com", category_hint: "News" },
  { name: "Foreign Affairs", domain: "foreignaffairs.com", category_hint: "News" },

  // ===========================================================================
  // Business SaaS (~62)
  // ===========================================================================

  // --- CRM ---
  { name: "Salesforce", domain: "salesforce.com", category_hint: "Business SaaS" },
  { name: "HubSpot", domain: "hubspot.com", category_hint: "Business SaaS" },
  { name: "Pipedrive", domain: "pipedrive.com", category_hint: "Business SaaS" },
  { name: "Zoho CRM", domain: "zoho.com/crm", category_hint: "Business SaaS" },
  { name: "Freshsales", domain: "freshworks.com", category_hint: "Business SaaS" },
  { name: "Close", domain: "close.com", category_hint: "Business SaaS" },
  { name: "Copper", domain: "copper.com", category_hint: "Business SaaS" },
  { name: "Insightly", domain: "insightly.com", category_hint: "Business SaaS" },

  // --- Marketing & Email ---
  { name: "Mailchimp", domain: "mailchimp.com", category_hint: "Business SaaS" },
  { name: "ConvertKit", domain: "convertkit.com", category_hint: "Business SaaS" },
  { name: "ActiveCampaign", domain: "activecampaign.com", category_hint: "Business SaaS" },
  { name: "Constant Contact", domain: "constantcontact.com", category_hint: "Business SaaS" },
  { name: "Brevo (Sendinblue)", domain: "brevo.com", category_hint: "Business SaaS" },
  { name: "Drip", domain: "drip.com", category_hint: "Business SaaS" },
  { name: "Klaviyo", domain: "klaviyo.com", category_hint: "Business SaaS" },
  { name: "Beehiiv", domain: "beehiiv.com", category_hint: "Business SaaS" },
  { name: "MailerLite", domain: "mailerlite.com", category_hint: "Business SaaS" },

  // --- SEO & Analytics ---
  { name: "SEMrush", domain: "semrush.com", category_hint: "Business SaaS" },
  { name: "Ahrefs", domain: "ahrefs.com", category_hint: "Business SaaS" },
  { name: "Moz", domain: "moz.com", category_hint: "Business SaaS" },
  { name: "Google Analytics 360", domain: "analytics.google.com", category_hint: "Business SaaS" },
  { name: "Mixpanel", domain: "mixpanel.com", category_hint: "Business SaaS" },
  { name: "Amplitude", domain: "amplitude.com", category_hint: "Business SaaS" },
  { name: "Hotjar", domain: "hotjar.com", category_hint: "Business SaaS" },
  { name: "Heap", domain: "heap.io", category_hint: "Business SaaS" },
  { name: "Plausible", domain: "plausible.io", category_hint: "Business SaaS" },

  // --- E-Commerce ---
  { name: "Shopify", domain: "shopify.com", category_hint: "Business SaaS" },
  { name: "BigCommerce", domain: "bigcommerce.com", category_hint: "Business SaaS" },
  { name: "WooCommerce", domain: "woocommerce.com", category_hint: "Business SaaS" },
  { name: "Squarespace", domain: "squarespace.com", category_hint: "Business SaaS" },
  { name: "Wix", domain: "wix.com", category_hint: "Business SaaS" },
  { name: "Gumroad", domain: "gumroad.com", category_hint: "Business SaaS" },
  { name: "Lemonsqueezy", domain: "lemonsqueezy.com", category_hint: "Business SaaS" },
  { name: "Paddle", domain: "paddle.com", category_hint: "Business SaaS" },

  // --- HR & Payroll ---
  { name: "Gusto", domain: "gusto.com", category_hint: "Business SaaS" },
  { name: "Rippling", domain: "rippling.com", category_hint: "Business SaaS" },
  { name: "BambooHR", domain: "bamboohr.com", category_hint: "Business SaaS" },
  { name: "ADP", domain: "adp.com", category_hint: "Business SaaS" },
  { name: "Paylocity", domain: "paylocity.com", category_hint: "Business SaaS" },
  { name: "Deel", domain: "deel.com", category_hint: "Business SaaS" },
  { name: "Remote", domain: "remote.com", category_hint: "Business SaaS" },
  { name: "Lattice", domain: "lattice.com", category_hint: "Business SaaS" },

  // --- Customer Support ---
  { name: "Zendesk", domain: "zendesk.com", category_hint: "Business SaaS" },
  { name: "Intercom", domain: "intercom.com", category_hint: "Business SaaS" },
  { name: "Freshdesk", domain: "freshdesk.com", category_hint: "Business SaaS" },
  { name: "Help Scout", domain: "helpscout.com", category_hint: "Business SaaS" },
  { name: "Drift", domain: "drift.com", category_hint: "Business SaaS" },
  { name: "LiveChat", domain: "livechat.com", category_hint: "Business SaaS" },
  { name: "Front", domain: "front.com", category_hint: "Business SaaS" },

  // --- Accounting & Finance ---
  { name: "QuickBooks", domain: "quickbooks.intuit.com", category_hint: "Business SaaS" },
  { name: "Xero", domain: "xero.com", category_hint: "Business SaaS" },
  { name: "FreshBooks", domain: "freshbooks.com", category_hint: "Business SaaS" },
  { name: "Wave", domain: "waveapps.com", category_hint: "Business SaaS" },
  { name: "Brex", domain: "brex.com", category_hint: "Business SaaS" },
  { name: "Ramp", domain: "ramp.com", category_hint: "Business SaaS" },
  { name: "Mercury", domain: "mercury.com", category_hint: "Business SaaS" },

  // --- Document & E-Signature ---
  { name: "DocuSign", domain: "docusign.com", category_hint: "Business SaaS" },
  { name: "PandaDoc", domain: "pandadoc.com", category_hint: "Business SaaS" },
  { name: "HelloSign", domain: "hellosign.com", category_hint: "Business SaaS" },
  { name: "Proposify", domain: "proposify.com", category_hint: "Business SaaS" },

  // --- Forms & Surveys ---
  { name: "Typeform", domain: "typeform.com", category_hint: "Business SaaS" },
  { name: "SurveyMonkey", domain: "surveymonkey.com", category_hint: "Business SaaS" },
  { name: "Tally", domain: "tally.so", category_hint: "Business SaaS" },
  { name: "Jotform", domain: "jotform.com", category_hint: "Business SaaS" },

  // --- Automation & Integration ---
  { name: "Zapier", domain: "zapier.com", category_hint: "Business SaaS" },
  { name: "Make (Integromat)", domain: "make.com", category_hint: "Business SaaS" },
  { name: "n8n", domain: "n8n.io", category_hint: "Business SaaS" },
  { name: "Airtable", domain: "airtable.com", category_hint: "Business SaaS" },
  { name: "Notion (Teams)", domain: "notion.so/teams", category_hint: "Business SaaS" },
  { name: "Loom Business", domain: "loom.com/business", category_hint: "Business SaaS" },

  // ===========================================================================
  // VPN (~16)
  // ===========================================================================

  { name: "NordVPN", domain: "nordvpn.com", category_hint: "VPN" },
  { name: "ExpressVPN", domain: "expressvpn.com", category_hint: "VPN" },
  { name: "Surfshark", domain: "surfshark.com", category_hint: "VPN" },
  { name: "CyberGhost", domain: "cyberghostvpn.com", category_hint: "VPN" },
  { name: "Private Internet Access", domain: "privateinternetaccess.com", category_hint: "VPN" },
  { name: "ProtonVPN", domain: "protonvpn.com", category_hint: "VPN" },
  { name: "Mullvad VPN", domain: "mullvad.net", category_hint: "VPN" },
  { name: "Windscribe", domain: "windscribe.com", category_hint: "VPN" },
  { name: "IPVanish", domain: "ipvanish.com", category_hint: "VPN" },
  { name: "TunnelBear", domain: "tunnelbear.com", category_hint: "VPN" },
  { name: "Hotspot Shield", domain: "hotspotshield.com", category_hint: "VPN" },
  { name: "StrongVPN", domain: "strongvpn.com", category_hint: "VPN" },
  { name: "Atlas VPN", domain: "atlasvpn.com", category_hint: "VPN" },
  { name: "IVPN", domain: "ivpn.net", category_hint: "VPN" },
  { name: "Mozilla VPN", domain: "vpn.mozilla.org", category_hint: "VPN" },
  { name: "Tailscale", domain: "tailscale.com", category_hint: "VPN" },
  { name: "ZenMate", domain: "zenmate.com", category_hint: "VPN" },
  { name: "VyprVPN", domain: "vyprvpn.com", category_hint: "VPN" },
  { name: "hide.me VPN", domain: "hide.me", category_hint: "VPN" },
  { name: "Astrill VPN", domain: "astrill.com", category_hint: "VPN" },

];

// =============================================================================
// Deduplication Helper
// =============================================================================

/**
 * Filters duplicate services by normalizing their domain with `normalizeDomain()`
 * and keeping only the first occurrence of each unique domain.
 */
export function deduplicateSeedList(services: RawService[]): RawService[] {
  const seen = new Set<string>();
  return services.filter((service) => {
    const key = normalizeDomain(service.domain);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
