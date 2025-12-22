# Micro Event Planner

A modern web application designed to help users plan and organize micro-events such as baby showers, birthday parties, proposals, and picnics. Built with Next.js and Supabase, it offers features for event management, budget tracking, invitation generation, and service add-ons.

## Features

- **Event Creation & Management**: Users can create drafts for various event types, set dates, times, and budgets.
- **Budget Tracking**: Monitor event budget and total costs.
- **Guest Management**: Track the number of guests.
- **Invitation System**: Generate invitations using templates or AI-powered customization.
- **Add-ons**: Browse and select services or items for events (e.g., catering, decorations).
- **Secure Sharing**: Share event details via unique, expirable tokens.
- **Payments**: Integrated Stripe payments for finalizing event bookings.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Auth**: Supabase Auth
- **Forms**: React Hook Form + Zod
- **Payments**: Stripe
- **AI Integration**: OpenAI (for text generation)
- **PDF/Printing**: `@react-pdf/renderer` & `react-to-print`

## Data Structure (Supabase)

This project uses Supabase as its backend connection. Below are the core tables:

### `events`
Stores the main event details.
- `id`: Unique identifier (UUID).
- `user_id`: Links to the authenticated user.
- `event_type`: Enum (`baby_shower`, `birthday_party`, etc.).
- `status`: Enum (`draft`, `ready`, `paid`).
- `budget`, `guest_count`, `date`, `time`: Event specifics.
- `total_price`: Calculated cost of the event.

### `invitations`
Handles event invitations.
- `event_id`: Links to the specific event.
- `template_slug`: Identifier for the chosen design template.
- `ai_generated_text`: JSONB field for storing AI-generated content.
- `custom_text`: JSONB field for user-customized text.

### `share_tokens`
Manages secure public access to specific events.
- `event_id`: Links to the event.
- `token`: Unique string for the share link.
- `expires_at`: Timestamp for when the link becomes invalid.

### `event_addons` & `addons` (Implied Schema)
- `addons`: Catalog of available services/items.
- `event_addons`: Junction table linking events to selected addons.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)
- **Docker is Required** for local Supabase development.
  - **Windows Users**: You MUST install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and ensure it is running in the background.
  - **Mac/Linux**: Ensure Docker is installed and the daemon is active.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd micro-event-planner
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory. You will need credentials for:
    - **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - **Stripe**: Publishable and Secret keys.
    - **OpenAI**: API Key (for invitation generation).

4.  **Database Migration:**
    Ensure your local or remote Supabase instance is running and apply the migrations located in the `supabase/migrations` folder.

    ```bash
    pnpm supabase migration up
    ```

### Running the Application

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase Configuration

The application relies closely on Supabase for data persistence and real-time features.
- **Row Level Security (RLS)** is enabled on tables to ensure users can only access their own data.
- **Triggers**: Automated database triggers may be used for actions like updating timestamps or handling status changes.
