# 🚀 DEPLOY TO HOSTINGER - COMPLETE GUIDE

## 🎯 What You Have Built

✅ **Full Hotel Booking System**
✅ **Multi-Channel Notifications** (Email/SMS/WhatsApp)
✅ **Production Build Ready**
✅ **Database with 6 Sample Rooms**
✅ **Admin Panel**
✅ **100% FREE Services**

---

## 📋 Hostinger Deployment Options

Hostinger offers several hosting types. Choose based on your needs:

### Option 1: VPS Hosting (RECOMMENDED) ⭐
**Best for**: Full control, Node.js applications, custom setup
**Price**: ~$4-8/month
**Setup Time**: 30 minutes

### Option 2: Cloud Hosting
**Best for**: Managed Node.js hosting
**Price**: ~$10-15/month
**Setup Time**: 15 minutes

### Option 3: Shared Hosting with Node.js
**Best for**: Budget hosting
**Price**: ~$2-4/month
**Setup Time**: 20 minutes
**Note**: Limited Node.js support, may have restrictions

---

# 🔥 OPTION 1: VPS HOSTING (RECOMMENDED)

This gives you full control and best performance.

## Step 1: Purchase Hostinger VPS

1. Go to [Hostinger VPS Plans](https://www.hostinger.com/vps-hosting)
2. Choose a plan (KVM 1 or higher recommended)
3. Select Ubuntu 22.04 as your OS
4. Complete purchase

## Step 2: Access Your VPS

**Via Hostinger Control Panel:**
1. Log into Hostinger
2. Go to VPS → Access
3. Note your:
   - IP Address
   - SSH Port (usually 22)
   - Root password

**Via SSH:**
```bash
ssh root@YOUR_VPS_IP
# Enter password when prompted
```

## Step 3: Set Up Your VPS

### 3.1 Update System
```bash
apt update && apt upgrade -y
```

### 3.2 Install Node.js 18+
```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Verify installation
node --version  # Should show v18.x
npm --version
```

### 3.3 Install PM2 (Process Manager)
```bash
npm install -g pm2
```

### 3.4 Install Nginx (Web Server)
```bash
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

## Step 4: Upload Your Application

### Method A: Using Git (RECOMMENDED)

**On your VPS:**
```bash
# Install Git
apt install -y git

# Create directory
mkdir -p /var/www
cd /var/www

# Clone your repository
git clone https://github.com/YOUR_USERNAME/Hotel-Booking.git
cd Hotel-Booking/file\ 1

# Install dependencies
npm install --production

# Build the application
npm run build
```

### Method B: Using FileZilla/SFTP

1. **Download FileZilla**: https://filezilla-project.org
2. **Connect to your VPS:**
   - Host: sftp://YOUR_VPS_IP
   - Username: root
   - Password: YOUR_PASSWORD
   - Port: 22
3. **Upload files:**
   - Navigate to `/var/www/` on remote
   - Create folder `hotel-booking`
   - Upload entire `file 1` folder contents
4. **On VPS:**
```bash
cd /var/www/hotel-booking
npm install --production
npm run build
```

## Step 5: Configure Environment Variables

```bash
cd /var/www/hotel-booking
nano .env
```

**Paste this configuration:**
```env
# Database (Use PostgreSQL for production)
DATABASE_URL="file:./dev.db"

# Server
NEXTAUTH_SECRET="CHANGE_THIS_TO_A_LONG_RANDOM_STRING_12345"
NEXTAUTH_URL="http://YOUR_DOMAIN_OR_IP:3000"

# Notifications (Optional - works in demo mode without these)
RESEND_API_KEY="re_your_key_here"
TWILIO_ACCOUNT_SID="ACxxxx"
TWILIO_AUTH_TOKEN="your_token"
TWILIO_PHONE_NUMBER="+1234567890"
TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"

# Admin
ADMIN_EMAIL="admin@hotel.com"
ADMIN_PASSWORD="CHANGE_THIS_PASSWORD"
```

**Save**: Press `Ctrl+X`, then `Y`, then `Enter`

## Step 6: Set Up Database

```bash
cd /var/www/hotel-booking

# Run migrations
npx prisma migrate deploy

# Seed database
npm run seed
```

## Step 7: Start Application with PM2

```bash
cd /var/www/hotel-booking

# Start the app
pm2 start npm --name "hotel-booking" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Copy and run the command it shows
```

**Check if running:**
```bash
pm2 status
pm2 logs hotel-booking
```

## Step 8: Configure Nginx Reverse Proxy

```bash
nano /etc/nginx/sites-available/hotel-booking
```

**Paste this configuration:**
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Replace `YOUR_DOMAIN_OR_IP` with:**
- Your domain: `hotel.example.com`
- OR your VPS IP: `123.456.789.0`

**Activate configuration:**
```bash
# Enable site
ln -s /etc/nginx/sites-available/hotel-booking /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

## Step 9: Set Up SSL (HTTPS) - FREE

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate (only works with a domain)
certbot --nginx -d YOUR_DOMAIN.com

# Auto-renewal is set up automatically
```

## Step 10: Point Your Domain to VPS

**In Hostinger Domain Management:**
1. Go to Domains → DNS/Nameservers
2. Add A Record:
   - Type: A
   - Name: @ (or subdomain like `hotel`)
   - Points to: YOUR_VPS_IP
   - TTL: 3600
3. Wait 5-30 minutes for DNS propagation

## ✅ Step 11: Test Your Website

Visit: **http://YOUR_DOMAIN** or **http://YOUR_VPS_IP**

You should see your hotel booking system! 🎉

---

# 🌩️ OPTION 2: CLOUD HOSTING

Hostinger Cloud Hosting has Node.js support.

## Steps:

1. **Purchase Cloud Hosting** from Hostinger
2. **Access hPanel** (Hostinger control panel)
3. **Enable Node.js:**
   - Go to Advanced → Node.js Selector
   - Select Node.js version 18.x
   - Create application
4. **Upload via Git or File Manager**
5. **Set environment variables** in hPanel
6. **Run build commands** via SSH or terminal

*Detailed steps similar to VPS but managed through hPanel interface*

---

# 💻 OPTION 3: USING EXTERNAL SERVICES (EASIEST)

Instead of Hostinger directly, use these FREE services:

## Option 3A: Vercel (RECOMMENDED for Next.js) ⭐

**100% FREE forever**

### Steps:

1. **Push code to GitHub:**
```bash
cd /home/user/Hotel-Booking
git add .
git commit -m "Production ready"
git push origin main
```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "Import Project"
   - Select your repository
   - Vercel auto-detects Next.js
   - Add environment variables from `.env`
   - Deploy!

3. **Connect Custom Domain:**
   - Vercel gives you `your-project.vercel.app`
   - In Vercel → Settings → Domains
   - Add your Hostinger domain
   - Get DNS records
   - Add them in Hostinger DNS settings

**Result**: Professional hosting for FREE!

## Option 3B: Railway.app

**FREE tier available**

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Deploy from GitHub repo
4. Add environment variables
5. Get domain or use custom

## Option 3C: Render.com

**FREE tier available**

Similar to Railway, deploy from GitHub.

---

# 🗄️ PRODUCTION DATABASE

For production, switch from SQLite to PostgreSQL:

## Free PostgreSQL Options:

### 1. Neon.tech (RECOMMENDED)
- **FREE Plan**: 3GB storage
- Website: [neon.tech](https://neon.tech)
- Steps:
  1. Sign up
  2. Create database
  3. Copy connection string
  4. Update DATABASE_URL in .env

### 2. Supabase
- **FREE Plan**: 500MB storage
- Website: [supabase.com](https://supabase.com)

### 3. ElephantSQL
- **FREE Plan**: 20MB storage
- Website: [elephantsql.com](https://elephantsql.com)

### Update Your App for PostgreSQL:

**1. Update `prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "postgresql"  // Changed from sqlite
  url      = env("DATABASE_URL")
}
```

**2. Update `.env`:**
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
```

**3. Migrate database:**
```bash
npx prisma migrate deploy
npm run seed
```

---

# 📧 SET UP FREE NOTIFICATIONS

## Email (Resend - FREE)

1. **Sign up**: [resend.com](https://resend.com)
2. **Get API key**: Dashboard → API Keys
3. **Update .env**:
```env
RESEND_API_KEY="re_your_actual_key_here"
```
4. **Verify domain** (optional for production):
   - Add DNS records in Hostinger
   - Improves deliverability

**FREE TIER**: 100 emails/day

## SMS & WhatsApp (Twilio - FREE TRIAL)

1. **Sign up**: [twilio.com](https://twilio.com)
2. **Get $15 free credits**
3. **Get credentials**:
   - Account SID
   - Auth Token
   - Phone number
4. **WhatsApp Sandbox**:
   - Console → Messaging → WhatsApp
   - Use: `whatsapp:+14155238886`
5. **Update .env**:
```env
TWILIO_ACCOUNT_SID="ACyour_sid"
TWILIO_AUTH_TOKEN="your_token"
TWILIO_PHONE_NUMBER="+1234567890"
TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"
```

---

# 🔧 USEFUL COMMANDS

## On Your VPS:

```bash
# View application logs
pm2 logs hotel-booking

# Restart application
pm2 restart hotel-booking

# Stop application
pm2 stop hotel-booking

# Check status
pm2 status

# Update application
cd /var/www/hotel-booking
git pull
npm install --production
npm run build
pm2 restart hotel-booking

# View Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

# 🎯 QUICK DEPLOYMENT CHECKLIST

- [ ] VPS or hosting purchased
- [ ] Node.js 18+ installed
- [ ] Application files uploaded
- [ ] npm install completed
- [ ] npm run build successful
- [ ] Environment variables configured
- [ ] Database migrated and seeded
- [ ] Application started with PM2
- [ ] Nginx configured
- [ ] Domain pointed to server
- [ ] SSL certificate installed
- [ ] Test booking flow
- [ ] Set up real notification APIs (optional)

---

# 🆘 TROUBLESHOOTING

## Application won't start:

```bash
# Check PM2 logs
pm2 logs hotel-booking

# Check if port 3000 is in use
lsof -i:3000

# Restart everything
pm2 restart hotel-booking
systemctl restart nginx
```

## Database errors:

```bash
# Reset and reseed
cd /var/www/hotel-booking
npx prisma migrate reset --force
npm run seed
pm2 restart hotel-booking
```

## Nginx errors:

```bash
# Test configuration
nginx -t

# Check logs
tail -f /var/log/nginx/error.log

# Restart
systemctl restart nginx
```

---

# 🎊 RECOMMENDED SETUP

**For best results:**

1. ✅ **Hosting**: Vercel (FREE) or Hostinger VPS ($4/month)
2. ✅ **Database**: Neon PostgreSQL (FREE)
3. ✅ **Email**: Resend (FREE 100/day)
4. ✅ **SMS/WhatsApp**: Twilio (FREE $15 trial)
5. ✅ **Domain**: Hostinger domain you already own

**Total Cost**: $0-4/month (domain cost)

---

# 📞 SUPPORT

If you need help:
1. Check PM2 logs: `pm2 logs`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Test locally first: `npm run dev`
4. Check database: `npx prisma studio`

---

**Your hotel booking system is production-ready!** 🚀

Choose your deployment method and follow the steps above.
