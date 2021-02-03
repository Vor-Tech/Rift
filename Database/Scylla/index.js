// TESTING OF SCYLLA NODE

import * as cassandra from 'cassandra-driver';
import async from 'async';

const client = new cassandra.Client({
    contactPoints: ['scylla-node1', 'scylla-node2', 'scylla-node3'],
    localDataCenter: 'DC1',
    keyspace: 'test',
});

async.series([
    //Connect to the Scylla cluster
    connection = (next) => {
        console.log(`Connecting to ${next}`);
        client.connect(next);
    },
    select = (next) => {
        const query = 'SELECT JSON * FROM test';
        client.execute(query, (err, result) => {
            //Return any error
            if(err) return next(err);

            //print data
            console.log('Initial Data:');
            for(let row of result) {
                console.log(row.first_name, row.last_name);
            };

            next();
        });
    },
    
    insert = (next) => {
        console.log(`Inserting user`);
        const query = 'INSERT INTO users (id, email, password, display_name, icon, discriminator, blocked_users, friend_requests, friends, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const params = ['1', 'admin@rift.works', 'insertChecksum', 'Riftmaster', 'insertUrl', '0000', [], [], [], Date.now()];
        client.execute(query, params, next)
    },

    del = (next) => {
        console.log('Removing user');
        const query = 'DELETE FROM users WHERE id = ? and email = ? and display_name = ?';
        const params = ['1', 'admin@rift.works', 'Riftmaster'];
        client.execute(query, params, next);
    },

    client.shutdown(() => {
        console.log('Shutting down');
        if (err) {
            throw err;
        }
    })
])