{
    "version": 2,
        "builds": [ { "src": "src/index.js", "use": "@now/node-server" } ],
        "routes": [ { "src": "/.*", "dest": "src/index.js" } ]
}
