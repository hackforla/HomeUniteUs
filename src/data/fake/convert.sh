#!/bin/sh

python py2ts.py fakehosts21_v3.json fakeguests101_v3.json

cat output/data-full.json \
    | sed 's/"ResponseMultiplicity\.ONE"/ResponseMultiplicity.ONE/g' \
    | sed 's/"HostHomeType\.Full"/HostHomeType\.Full/g' \
    | sed 's/"HostHomeType\.Both"/HostHomeType\.Both/g' \
    | sed 's/"HostHomeType\.Respite"/HostHomeType\.Respite/g' \
    | sed 's/"dateOfBirth": "\(.*\)"/"dateOfBirth": new Date("\1")/g' > output/data-full3.json

