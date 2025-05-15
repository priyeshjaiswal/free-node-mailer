# 📬 Free Node.js Mailer API

A simple, reusable Node.js mailer API that:

- Sends transactional emails (e.g., OTPs) using Brevo (Sendinblue) SMTP (free up to 300 emails/day)
- Automatically falls back to a secondary SMTP (like Gmail) when Brevo's daily limit is reached
- Tracks daily sent email count and resets every day
- Supports customizable sender email per request
- Configured via environment variables for easy setup and deployment

---

## 🚀 Features

- Free tier transactional email support with Brevo (Sendinblue)
- Daily limit enforcement and fallback mechanism
- Easy API endpoint for sending emails
- Customizable sender address per email request
- Simple JSON-based API

---

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/free-node-mailer.git
cd free-node-mailer
```

## 📧 How to Register & Setup Brevo (Sendinblue) SMTP for This Mailer

### Step 1: Create a Brevo Account

- Visit [https://www.brevo.com/](https://www.brevo.com/) (formerly Sendinblue).
- Click **Sign Up** and register with your email address.
- Confirm your email by clicking the verification link sent to your inbox.

### Step 2: Access SMTP Settings

- Log in to your Brevo dashboard.
- Navigate to **SMTP & API** from the left sidebar.
- Under the **SMTP** tab, you will find the SMTP server details:
  - **SMTP Server:** `smtp-relay.brevo.com`
  - **Port:** Usually `587` (STARTTLS) or `465` (SSL)
- Create or copy your SMTP credentials (username and password). These will be used in your `.env` file.

### Step 3: Verify Your Sender Email or Domain

- In the dashboard, go to **Settings → Senders & Domains**.
- Add your sender email (e.g., `no-reply@yourdomain.com`) or your entire domain.
- You will receive a verification email—click the verification link to activate the sender.
- (Recommended) Add SPF, DKIM, and DMARC DNS records to your domain to improve deliverability and reduce spam chances. Brevo provides the exact DNS records required.

### Step 4: Check Your Sending Limits

- Free Brevo accounts allow sending up to **300 emails per day**.
- You can monitor usage and limits in your Brevo dashboard under **Statistics**.
- The mailer app respects these limits and automatically falls back to a secondary SMTP provider when the limit is reached.
