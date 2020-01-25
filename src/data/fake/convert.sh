#!/bin/sh

python py2ts.py fakehosts21_v2.json fakeguests101_v2.json

cat output/data-full.json | sed 's/"ResponseMultiplicity\.ONE"/ResponseMultiplicity.ONE/g' > output/data-full2.json
cat output/data-full2.json | sed 's/"dateOfBirth": "\(.*\)"/"dateOfBirth": new Date("\1")/g' > output/data-full3.json

