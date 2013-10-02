g33k-webhooks
=============

Update Git repositary via WebHooks Server


## Init Script
cd /var/www/g33k-webhooks
foreman export upstart /etc/init -a webhooks -u g33k -c webhooks=1