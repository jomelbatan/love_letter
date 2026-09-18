# Afterword

Afterword is an anonymous social feed platform inspired by the familiar experience of Facebook profiles and timelines, allowing users to share thoughts, memories, music, videos, and social media content in a more personal and expressive way.

Instead of traditional posting, users can contribute anonymously through direct messaging or by sharing links to the official Afterword Facebook page, creating a seamless social-to-social publishing experience.

---

## 🐾 Visual Identity

Afterword uses a **kawaii animal-inspired visual theme** throughout the website.

The interface revolves around cute animal characters, soft colors, playful typography, and a warm scrapbook-like atmosphere. The animal characters serve as the visual identity of the platform while keeping the anonymous nature of the feed playful and approachable.

The overall design combines:

- 🐰 Kawaii animal characters
- 🍑 Soft pastel and warm colors
- ✏️ Handwritten typography
- 📖 Scrapbook-inspired surfaces
- ☁️ Soft borders and rounded cards
- 💗 Playful accents and illustrations

The goal is to make the experience feel less like a traditional social network and more like a **cute personal memory book**.

---

## 🎨 Color Palette

Afterword uses a warm, pastel-inspired color system designed around cream, terracotta, peach, pink, and muted natural colors.

### Brand Colors

| Color          | Hex       | Usage                            |
| -------------- | --------- | -------------------------------- |
| Primary Orange | `#E0A36D` | Brand and primary accents        |
| Accent Pink    | `#F4C5CD` | Decorative and secondary accents |
| Text Brown     | `#5C4B40` | Warm supporting text             |
| Off White      | `#FFF6EA` | Soft backgrounds                 |

### UI Colors

| Color         | Hex       | Usage                |
| ------------- | --------- | -------------------- |
| Chalk Cream   | `#FAF5EF` | Page background      |
| Soft Dust     | `#E8DFD5` | Borders and dividers |
| Pure Chalk    | `#FFFFFF` | Cards and surfaces   |
| Deep Charcoal | `#3A2E2B` | Primary text         |
| Warm Dust     | `#786B62` | Muted text           |

### Accent Colors

| Color               | Hex       | Usage                           |
| ------------------- | --------- | ------------------------------- |
| Chalk Terracotta    | `#E58E6D` | Primary actions                 |
| Peach Milk          | `#FDEEE6` | Soft action backgrounds         |
| Dusty Pink          | `#F1BDC4` | Secondary actions               |
| Chalk Periwinkle    | `#5C7CFA` | Links and link accents          |
| Chalk Butter Yellow | `#F7E4A9` | Decorative accents              |
| Pastel Sage         | `#B8D8BA` | Natural/animal-inspired accents |
| Chalk Lavender      | `#DBC7E3` | Decorative accents              |
| Mint Foam           | `#C4E5E1` | Decorative accents              |

---

## ✍️ Typography

Afterword uses a combination of clean system typography and playful handwritten fonts.

### Yuyu

Used for the platform's playful and kawaii visual elements.

```css
--font-yuyu: var(--font-yuyu-family);
```

### Kalam

Used for handwritten-style content and expressive text.

```css
--font-kalam: var(--font-kalam-family);
--font-kalam-bold: var(--font-kalam-bold-family);
```

### Geist

Used for standard interface and technical text.

```css
--font-sans: var(--font-geist-sans);
--font-mono: var(--font-geist-mono);
```

The combination allows the interface to maintain readability while still giving Afterword its handwritten and playful personality.

---

## ✨ Features

### 📰 Anonymous Timeline Feed

- Facebook-inspired profile and news feed layout
- Chronological timeline of posts
- Anonymous author profiles
- Notes and status updates
- Friend and photo sections
- Profile-based timeline experience

### 🔗 Multi-Platform Embeds

Users can share content from various platforms, all displayed directly inside the feed:

- Facebook Posts / Reels / Videos
- Instagram Posts / Reels
- TikTok Videos
- Spotify Songs / Albums / Playlists
- YouTube Videos
- YouTube Music Tracks

Each platform is rendered using custom embed components to create a consistent experience while preserving the original content.

### 💬 Messenger-Based Posting

Afterword integrates with the **Meta Platform**, allowing users to submit content through the official Afterword Facebook page.

Users can:

- Send a message to the official Facebook Page
- Share supported social media links
- Submit text or media through Messenger
- Have shared content processed automatically
- Publish supported content to the Afterword timeline

This allows users to interact with Afterword without needing to directly access the application's posting interface.

---

## 🛠 Tech Stack

### Frontend

- **Next.js**
- **TypeScript**
- **Tailwind CSS**

### Backend

- **Convex**
  - Real-time database
  - Queries and mutations
  - Serverless backend functions

### Integrations

- **Meta Graph API**
- **Facebook Messenger Platform**
- **Instagram Messaging API**
- **Facebook SDK**
- **Instagram Embed API**
- **Spotify oEmbed**
- **YouTube IFrame API**

---

## 🏗 Architecture

```text
                         ┌──────────────────┐
                         │      User        │
                         └────────┬─────────┘
                                  │
                     Message / Shared Link
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Meta Platform  │
                         │ Facebook / IG    │
                         └────────┬─────────┘
                                  │
                              Webhooks
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    Next.js API   │
                         │      Routes      │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │      Convex      │
                         │ Database/Backend │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Afterword Feed  │
                         └────────┬─────────┘
                                  │
               ┌──────────────────┼──────────────────┐
               │                  │                  │
               ▼                  ▼                  ▼
           Facebook          Instagram            TikTok
               │                  │                  │
               └──────────────────┼──────────────────┘
                                  │
                       Spotify / YouTube
```

---

## 📂 Main Features

### Profiles

Afterword presents posts through a familiar profile-based interface inspired by social networking platforms.

- Custom profile pages
- Cover photos
- Animal avatars
- Friend lists
- Photo galleries
- Profile tabs
- Personal details

### Timeline Posts

The timeline supports multiple types of content:

- Text posts
- Letters
- Images
- Social media embeds

Supported embeds are automatically identified from submitted URLs and rendered using the appropriate provider.

### Notes

Users can have temporary profile notes that automatically expire after a defined period.

### Real-Time Updates

Convex provides real-time database synchronization, allowing timeline content and other application data to update without requiring a traditional polling-based backend.

---

## 🐻 Anonymous Animal Identity

Instead of relying on traditional usernames and profile identities, Afterword uses **kawaii animal characters** as part of its visual language.

Animal characters are used across:

- Profile avatars
- Illustrations
- Empty states
- Decorative elements
- UI interactions
- Branding

This reinforces the anonymous nature of the platform while giving each profile a recognizable and playful identity.

---

## 🔗 Content Flow

A typical post can start outside Afterword:

```text
User finds content
       │
       ▼
Shares link to
Afterword Facebook Page
       │
       ▼
Meta Messenger API
       │
       ▼
Webhook
       │
       ▼
Content parsing
       │
       ▼
Platform detection
       │
       ▼
Convex database
       │
       ▼
Afterword Timeline
       │
       ▼
Custom platform embed
```

The application detects the submitted URL and determines which provider should render the content.

For example:

```text
facebook.com      → Facebook
instagram.com     → Instagram
tiktok.com        → TikTok
spotify.com       → Spotify
youtube.com       → YouTube
music.youtube.com → YouTube Music
```

---

## 🎯 Project Goal

Afterword aims to create a digital space where memories, thoughts, music, videos, and shared moments from different social platforms can exist in one unified timeline.

Rather than attempting to replace existing social media platforms, Afterword acts as a **personalized collection layer** where content from different platforms can be brought together into one familiar social-feed experience.

Its visual identity combines this concept with kawaii animal characters, soft pastel colors, handwritten typography, and playful UI elements to create an experience that feels like a **social feed mixed with a digital scrapbook**.

---

## 🚀 Getting Started

Install dependencies:

```bash
npm install
```

Run the Next.js development server:

```bash
npm run dev
```

Start Convex:

```bash
npx convex dev
```

---

## 🔐 Environment Variables

The application requires environment variables for the Next.js and Convex environments as well as Meta integrations.

Example:

```env
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=

META_APP_SECRET=
META_VERIFY_TOKEN=
META_PAGE_ACCESS_TOKEN=

IG_PAGE_ACCESS_TOKEN=
```

Development-specific Meta credentials may also be configured separately.

---

## 📜 License

This project is for educational and personal development purposes.
