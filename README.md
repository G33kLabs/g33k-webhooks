g33k-webhooks
=============

Update Git repositary via WebHooks Server

## Install on Server

### Clone Repo
```
cd /var/www
git clone 
```

### Update NPM
```
cd /var/www/g33k-webhooks
npm update
```

### Open Firewall
```
sudo iptables -t filter -A INPUT -p tcp --dport 9090 -j ACCEPT
```

### Usage
```
node src/app.js -h
```

### Test
```
node src/app.js -p 9090
```

## InitScript with foreman (optional)

### Create .env

If you want to use foreman to run this package, you can specify listening port here.

```
cat "PORT=9090" > /var/www/g33k-webhooks/.env
```

### Create Init Script
```
cd /var/www/g33k-webhooks
sudo foreman export upstart /etc/init -a webhooks -u g33k -c webhooks=1
```

### Start service 
```
sudo service webhooks start
```

## Watch logs
```
tail -f /var/log/webhooks/*
```