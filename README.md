g33k-webhooks
=============

Update Git repositary via WebHooks Server


Install on Server
-----------------

### Clone Repo
```
cd /var/www
git clone git@github.com:G33kLabs/g33k-webhooks.git
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


InitScript with foreman (optional)
----------------------------------

### Create .env

If you want to use foreman to run this package, you can specify listening port here.

```
echo "PORT=9090" > /var/www/g33k-webhooks/.env
```

### Create Init Script
```
cd /var/www/g33k-webhooks
sudo foreman export upstart /etc/init -a webhooks -u g33k -c webhooks=1
```

### Allow a user to restart the service without password
```
export EDITOR=vi
sudo visudo
%user ALL=(ALL) NOPASSWD: /usr/sbin/service webhooks restart, /usr/sbin/service webhooks stop, /usr/sbin/service webhooks start
```

### Start service 
```
sudo service webhooks start
```

### Watch logs
```
tail -f /var/log/webhooks/*
```


Create post-commit hook
-----------------------

Actually the webhooks server listen to all messages.

In order to execute a post-commit script, you have to build directory into '/repos/' folder.

By example, for https://github.com/G33kLabs/g33k-webhooks, you will have to create the folders '/repos/G33kLabs/g33k-webhooks' (case sensitive).

And in this folder, copy the sampled file 'post-commit' and customize it.

You'll find below the sample file: 

```
#!/bin/sh
cd /var/www/g33k-webhooks
unset GIT_DIR

#@ Make a npm update
echo "Update npm packages..."
npm update > /dev/null 2>&1 

#@ Refresh repo
echo "Refresh repo..."
git pull

#@ Restart app
echo "Restart webhook server..."
sudo service webhooks restart
```