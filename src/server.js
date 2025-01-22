require('dotenv').config();

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Middleware = require('./middleware');
const Routes = require('./routes');

const app = new Koa();

app.use(bodyParser());

app.use(Middleware.RequestLoggerMiddleware);

app.use(Middleware.ResponseFormatterMiddleware);

// app.use(Routes.routes());

let port = process.env.SERVER_PORT || 3000;
app.listen(port);

console.log(`Server running on port ${port}`);
