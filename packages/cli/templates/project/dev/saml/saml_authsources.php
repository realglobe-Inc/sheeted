<?php

$config = array(

    'admin' => array(
        'core:AdminPassword',
    ),

    'example-userpass' => array(
        'exampleauth:UserPass',
        'demo:demo' => array(
            'uid' => array('1'),
            'email' => 'demo@example.com',
        ),
        'admin:admin' => array(
            'uid' => array('1'),
            'email' => 'admin@example.com',
        )
    ),
);
