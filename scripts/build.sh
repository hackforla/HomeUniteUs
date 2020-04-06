#!/bin/sh

rm -rf build dist
cd app && npm run build
cd ..
cp hosthome.py build/
# scp \
#     -r build/* \
#     -i "/c/Users/tyler/.ssh/tyler-home-pc.pem" \
#     ubuntu@ec2-3-17-61-216.us-east-2.compute.amazonaws.com:/home/ubuntu/hosthome/