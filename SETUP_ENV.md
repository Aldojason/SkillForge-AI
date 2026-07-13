# 🔑 SkillForge AI — Environment Variables Setup Guide

This guide explains how to get and add the integration keys to your `server/.env` file to unlock the full potential of the platform's AI, payments, email, and storage features.

---

## 1. AI features (Gemini API)
Required for AI resume reviews, mock interviews, AI study coach suggestions, and company preparation roadmaps.

1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Click **Get API key** and generate a new API key.
3. Copy the key.
4. Paste it into your `server/.env` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

---

## 2. Cloudinary File Uploads
Required to persist uploaded resume PDFs and user avatars rather than storing them in-memory.

1. Sign up/log in to [Cloudinary](https://cloudinary.com/) (free tier is enough).
2. Go to your **Cloudinary Dashboard**.
3. Copy the following credentials from the **Product Environment Credentials** panel:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
4. Add them to your `server/.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

---

## 3. Razorpay Subscriptions & Payments
Required to allow students to upgrade from the Free tier to Premium SDE Prep.

1. Sign up/log in to the [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Toggle the **Test Mode** switch in the side menu.
3. Go to **Account & Settings > API Keys** (under Website Settings).
4. Click **Generate Key** to receive your API keys. Copy them.
5. Paste them into your `server/.env` file:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxx
   ```

---

## 4. SMTP Email Configuration (using Resend)
Required to send transactional emails (like email verification and password resets).

1. Sign up/log in to [Resend](https://resend.com/).
2. Create an **API Key** (e.g., `re_xxxxxxxxxxxxxx`).
3. Add the following SMTP details to your `server/.env` file:
   ```env
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=587
   SMTP_USER=resend
   SMTP_PASS=your_resend_api_key_here
   EMAIL_FROM="SkillForge AI <onboarding@resend.dev>"
   ```
   *(Note: Once you verify your custom domain in Resend, you can change `onboarding@resend.dev` to `no-reply@yourdomain.com`)*
