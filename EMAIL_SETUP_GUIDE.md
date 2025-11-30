# 📧 Email Setup Guide

## 🎯 Quick Start (Development Mode - No Setup Required!)

**Good news!** The system is now in development mode by default. Emails won't actually be sent, but you can test the entire flow.

### Current Settings (.env)
```env
EMAIL_DEVELOPMENT_MODE=true  # ← Emails logged but not sent
```

### How It Works
1. ✅ All email features work normally
2. ✅ Emails are logged to the database
3. ✅ Email preview appears in backend terminal
4. ✅ No SMTP credentials needed
5. ✅ Perfect for testing!

### Try It Now!
1. **Restart backend** (to load new settings):
   ```bash
   # Press Ctrl+C in backend terminal
   ./run-backend.sh
   ```

2. **Test send an email:**
   - Go to Templates tab
   - Click "Test Send" on any template
   - Enter any email address
   - Click "Send Test"

3. **Check backend terminal** - You'll see:
   ```
   ============================================================
   📧 DEVELOPMENT MODE - Email Preview
   ============================================================
   From: User Management System <your@email.com>
   To: test@example.com
   Subject: Welcome to Our Platform
   ============================================================
   Body Preview:
   <html>
     <body>
       <h1>Hello John Doe!</h1>
       ...
   ============================================================
   ```

4. **Result:** ✅ Success message without actually sending!

---

## 🚀 Production Mode (Send Real Emails)

### Option 1: Gmail (Recommended)

#### Step 1: Enable 2-Factor Authentication
1. Go to: https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow the setup wizard

#### Step 2: Create App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select:
   - **App:** Mail
   - **Device:** Other (Custom name) → "User Management System"
3. Click "Generate"
4. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

#### Step 3: Update .env
```env
# Change this to false
EMAIL_DEVELOPMENT_MODE=false

# Use your Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your.actual.email@gmail.com
SMTP_PASSWORD=abcdefghijklmnop  # ← Paste app password (no spaces)
SMTP_FROM_EMAIL=your.actual.email@gmail.com
SMTP_FROM_NAME=Your Company Name
```

#### Step 4: Restart Backend
```bash
# Press Ctrl+C in backend terminal
./run-backend.sh
```

#### Step 5: Test Real Email
- Send test email to your own email
- Check your inbox!

---

### Option 2: Mailtrap (Development Testing)

Mailtrap catches all emails in a safe inbox - perfect for testing!

#### Step 1: Sign Up
1. Go to: https://mailtrap.io
2. Create free account
3. Go to "Email Testing" → "Inboxes" → "My Inbox"

#### Step 2: Get Credentials
Copy from the "SMTP Settings" section:
```
Host: sandbox.smtp.mailtrap.io
Port: 2525
Username: your_mailtrap_username
Password: your_mailtrap_password
```

#### Step 3: Update .env
```env
EMAIL_DEVELOPMENT_MODE=false

SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USERNAME=your_mailtrap_username
SMTP_PASSWORD=your_mailtrap_password
SMTP_FROM_EMAIL=test@example.com
SMTP_FROM_NAME=User Management System
```

#### Step 4: Test
- Send test email
- Check Mailtrap inbox (not your real email!)

---

### Option 3: SendGrid (Production)

For high-volume production use:

#### Step 1: Sign Up
1. Go to: https://sendgrid.com
2. Create account (free tier: 100 emails/day)

#### Step 2: Create API Key
1. Settings → API Keys → Create API Key
2. Copy the API key

#### Step 3: Update .env
```env
EMAIL_DEVELOPMENT_MODE=false

SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your_sendgrid_api_key
SMTP_FROM_EMAIL=verified@yourdomain.com
SMTP_FROM_NAME=Your Company
```

---

## 🔍 Troubleshooting

### Error: "Username and Password not accepted"
**Causes:**
- Using regular Gmail password instead of App Password
- 2FA not enabled
- Typo in credentials

**Solution:**
1. Make sure 2FA is enabled
2. Generate new App Password
3. Copy it without spaces
4. Restart backend

---

### Error: "Connection timeout"
**Causes:**
- Firewall blocking port 587
- Wrong SMTP host

**Solution:**
1. Check .env has correct SMTP_HOST
2. Try port 465 instead of 587
3. Disable VPN/Firewall temporarily

---

### Emails not appearing
**In Development Mode:**
- ✅ Check backend terminal for preview
- ✅ Check database with `GET /email/logs`

**In Production Mode:**
- Check spam folder
- Verify SMTP credentials
- Check email logs: `GET /email/logs`

---

## 📊 Current Configuration

### Development Mode (Default)
```env
EMAIL_DEVELOPMENT_MODE=true
```
- ✅ No credentials needed
- ✅ Emails logged but not sent
- ✅ Preview in terminal
- ✅ Perfect for testing

### Production Mode
```env
EMAIL_DEVELOPMENT_MODE=false
```
- ⚠️ Requires valid SMTP credentials
- ✅ Sends real emails
- ✅ Use for production

---

## 🧪 Testing Checklist

### Development Mode Test
- [ ] Restart backend
- [ ] Create email template with `{{username}}`
- [ ] Click "Test Send"
- [ ] Enter test@example.com
- [ ] Add variable: `{"username": "John"}`
- [ ] Click send
- [ ] ✅ Check backend terminal for preview
- [ ] ✅ Check success message in UI

### Production Mode Test
- [ ] Update .env with real credentials
- [ ] Set `EMAIL_DEVELOPMENT_MODE=false`
- [ ] Restart backend
- [ ] Send test email to your own email
- [ ] ✅ Check inbox
- [ ] ✅ Verify variables rendered correctly

---

## 📝 Example Templates

### Welcome Email
```html
<html>
  <body style="font-family: Arial, sans-serif;">
    <h1>Welcome {{username}}!</h1>
    <p>Thanks for joining {{company_name}}.</p>
    <p>Click here to get started:</p>
    <a href="{{dashboard_link}}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      Go to Dashboard
    </a>
  </body>
</html>
```

**Variables:**
```json
{
  "username": "John Doe",
  "company_name": "Acme Corp",
  "dashboard_link": "https://example.com/dashboard"
}
```

### Password Reset
```html
<html>
  <body>
    <h2>Password Reset Request</h2>
    <p>Hi {{username}},</p>
    <p>Click the link below to reset your password:</p>
    <a href="{{reset_link}}">Reset Password</a>
    <p>This link expires in {{expiry_hours}} hours.</p>
    <p>If you didn't request this, please ignore.</p>
  </body>
</html>
```

---

## 🎯 Quick Reference

| Mode | EMAIL_DEVELOPMENT_MODE | Emails Sent? | Use Case |
|------|----------------------|--------------|----------|
| **Development** | `true` | ❌ No | Local testing |
| **Production** | `false` | ✅ Yes | Real emails |

| Service | Free Tier | Best For |
|---------|-----------|----------|
| **Gmail** | N/A | Personal projects |
| **Mailtrap** | 100 emails | Testing |
| **SendGrid** | 100/day | Production |

---

## ✨ Current Status

✅ Development mode enabled (default)
✅ No SMTP setup required
✅ Test emails work immediately
✅ Email preview in terminal
✅ All features functional

**To send real emails:** Update .env and set `EMAIL_DEVELOPMENT_MODE=false`

**Happy Testing! 🚀**
