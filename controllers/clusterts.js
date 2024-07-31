const cluster = require('node:cluster');
const http = require('node:http');
const process = require('node:process');
const numCpu = require('node:os').availableParallelism();

if(cluster.isPrimary) {
    console.log(`Process ${process.pid} is running`);
    for(i=0;i<numCpu;i++){
        cluster.fork()
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died.`);
    })

} else {

    http.createServer((req, res) => {
        res.writeHead(200);
        res.end('hello world\n');
    }).listen(8000);

    console.log(`Worker ${process.pid} started.`)
}