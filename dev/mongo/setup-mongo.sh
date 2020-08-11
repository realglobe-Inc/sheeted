#!/bin/sh

set -eux

until (mongo admin --host mongo:27017 --eval "rs.initiate({'_id':'$MONGO_REPLICA_SET', members:[{_id:0, host:'mongo:27017'}]})"); do
  echo 'Waiting for mongo to be ready...'
  sleep 2
done
