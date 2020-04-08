#!/bin/sh
echo "starting mongo daemon.."

mongod --bind_ip 0.0.0.0 &

# sleep 7

mongo localhost:27017/hosthome initMongo.js

echo "seeding database..."
echo "- inserting guestQuestions..."
mongoimport -c=guestQuestions -d=hosthome --jsonArray --file=/var/tmp/guestQuestions.json
echo "- inserting hosts..."
mongoimport -c=hosts -d=hosthome --jsonArray --file=/var/tmp/hosts.json
echo "- inserting guests..."
mongoimport -c=guests -d=hosthome --jsonArray --file=/var/tmp/guests.json
echo "- inserting responseValues..."
mongoimport -c=responseValues -d=hosthome --jsonArray --file=/var/tmp/responseValues.json
echo "- inserting hostResponses..."
mongoimport -c=hostResponses -d=hosthome --jsonArray --file=/var/tmp/hostResponses.json
echo "- inserting guestResponses..."
mongoimport -c=guestResponses -d=hosthome --jsonArray --file=/var/tmp/guestResponses.json
echo "- inserting hostQuestions..."
mongoimport -c=hostQuestions -d=hosthome --jsonArray --file=/var/tmp/hostQuestions.json
echo "- inserting restrictions..."
mongoimport -c=restrictions -d=hosthome --jsonArray --file=/var/tmp/restrictions.json

echo "starting hosthome.."



cd /app
gunicorn --log-level=debug --bind=0.0.0.0:80 wsgi
