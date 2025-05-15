# 📬 Free Node Mailer API

A lightweight and production-ready Node.js-based email-sending API using SMTP (primarily Brevo / Sendinblue). Perfect for transactional emails in web and mobile apps.

---

## 🚀 Features

- Send emails via a REST API (`/api/send`)
- Uses Brevo (Sendinblue) SMTP by default
- Supports fallback SMTP provider
- Easy setup with `.env` configuration
- Well-documented and ready to deploy

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone git@github.com:priyeshjaiswal/free-node-mailer.git
cd free-node-mailer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory using the `.env.example` as reference:

```bash
cp .env.example .env
```

Update the values in `.env` with your Brevo SMTP credentials (see below).

### 4. Run the Project

```bash
npm start
```

The server will start on `http://localhost:3000`.

---

## 📘 API Usage

Once your server is running (`npm start`), your mailer API will be accessible via:

```
http://localhost:3000/api/send
```

### ➤ POST `/api/send`

Sends an email using the configured SMTP service (Brevo by default).

#### ✅ Request Headers:
```
Content-Type: application/json
```
### Body Parameters (JSON)

| Field     | Type     | Required | Description                                                                 |
|-----------|----------|----------|-----------------------------------------------------------------------------|
| `to`      | string   | ✅       | Recipient email address.                                                     |
| `subject` | string   | ✅       | Subject line for the email.                                                  |
| `html`    | string   | ✅       | HTML content of the email.                                                   |
| `sender`  | object   | ❌       | *(Optional)* Custom sender override (e.g., Gmail). Includes `name`, `email`. |

### Example Request Body

```json
{
  "to": "youremail@gmail.com",
  "subject": "Your OTP Code",
  "html": "<p>Your One-Time Password is: <strong>000000</strong>. It is valid for 5 minutes.</p>",
  "sender": {
    "name": "OTP Service",
    "email": "no-reply@yourcompany.com"
  }
}
```

#### 📝 Required Fields:
- `to` – Recipient's email address
- `subject` – Email subject line
- `text` OR `html` – Email body (you can send both)

#### 📥 Response Example:

- **Success (200 OK)**:
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

- **Error (400 or 500)**:
```json
{
  "success": false,
  "error": "Invalid email format" // or detailed error message
}
```

---

## 🔐 How to Register & Setup Brevo (Sendinblue) SMTP for This Mailer

### Step 1: Create a Brevo Account

- Visit [https://www.brevo.com/](https://www.brevo.com/)
- Click **Sign Up** and register with your email address.
- Confirm your email by clicking the verification link.

### Step 2: Access SMTP Settings

- Log in to the Brevo dashboard.
- Go to **SMTP & API** → **SMTP**
- Use the following SMTP server:

```
SMTP Server: smtp-relay.brevo.com
Port: 587 (STARTTLS) or 465 (SSL)
```

- Generate or copy your SMTP credentials (username/password)

### Step 3: Verify Your Sender Email or Domain

- Go to **Settings → Senders & Domains**
- Add and verify your sender email or domain.
- Brevo will send a verification email.

*(Optional but recommended)*: Add SPF, DKIM, and DMARC DNS records to your domain for better deliverability.

### Step 4: Check Sending Limits

- Free accounts can send up to **300 emails/day**.
- This app respects limits and can failover to secondary SMTP if configured.

---

## 📁 File Structure

```
.
├── .env.example
├── server.js
├── package.json
└── README.md
```

---

## 👨‍💻 Contributing

Feel free to fork the repo, make improvements, and open PRs!

---

## 📜 License

MIT License
