#!/bin/bash

# Hotel Booking System - VPS Deployment Script
# This script automates deployment to a VPS

echo "🏨 Hotel Booking System - VPS Deployment"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running on VPS
if [ ! -d "/var/www" ]; then
    echo -e "${RED}Error: This doesn't appear to be a VPS environment${NC}"
    echo "This script should be run on your VPS server"
    exit 1
fi

echo -e "${BLUE}Step 1: Updating system...${NC}"
apt update && apt upgrade -y

echo -e "${BLUE}Step 2: Installing Node.js 18...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

echo -e "${BLUE}Step 3: Installing PM2...${NC}"
npm install -g pm2

echo -e "${BLUE}Step 4: Installing Nginx...${NC}"
apt install -y nginx
systemctl enable nginx
systemctl start nginx

echo -e "${BLUE}Step 5: Creating application directory...${NC}"
mkdir -p /var/www/hotel-booking
cd /var/www/hotel-booking

echo -e "${BLUE}Step 6: Installing dependencies...${NC}"
npm install --production

echo -e "${BLUE}Step 7: Building application...${NC}"
npm run build

echo -e "${BLUE}Step 8: Setting up database...${NC}"
npx prisma migrate deploy
npm run seed

echo -e "${BLUE}Step 9: Starting application with PM2...${NC}"
pm2 start npm --name "hotel-booking" -- start
pm2 save
pm2 startup

echo -e "${GREEN}=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Configure Nginx (see HOSTINGER_DEPLOYMENT.md)"
echo "2. Set up your domain"
echo "3. Install SSL certificate"
echo ""
echo "Application is running on: http://localhost:3000"
echo "Check status: pm2 status"
echo "View logs: pm2 logs hotel-booking"
echo -e "${NC}"
