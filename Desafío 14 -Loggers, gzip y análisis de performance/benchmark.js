const autocannon = require('autocannon');
const { PassThrough } = require('stream');
function run(url) {
  const buf = [];
  const outputStream = new PassThrough();
  const inst = autocannon({
    url,
    connections: 50,
    duration: 20,
  });
  autocannon.track(inst, { outputStream });
  outputStream.on('data', (data) => buf.push(data));
  inst.on('done', function () {
    process.stdout.write(Buffer.concat(buf));
  });
}
console.log('Running all benchmarks in parallel ...');
run('http://localhost:8080/info');
