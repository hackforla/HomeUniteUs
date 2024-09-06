#!/bin/bash
ls
echo "installing backend deps"
pushd ./api
    python3 -m pip install .
popd

echo "installing frontend deps"
pushd ./app
    npm install
popd
