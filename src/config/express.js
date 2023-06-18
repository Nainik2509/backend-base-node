import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import methodOverride from 'method-override';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import envVars, { __dirname } from './env-vars.js';

import routes from '../api/routes/index.js';
import { JwtStr } from './passport.js';

const app = express();

app.enable('trust proxy');

/* `app.use(morgan(logs, morganConfig));` is setting up the Morgan middleware
in the Express application. Morgan is a popular HTTP request logger for
Node.js that logs incoming requests and their details such as the request
method, URL, status code, response time, and more. The `logs` parameter
specifies the format of the log messages, and the `morganConfig` parameter
is an optional configuration object that can be used to customize the
behavior of the logger. By using this middleware, the application can log
useful information about incoming requests, which can be helpful for
debugging and monitoring purposes. */
app.use(morgan(envVars.logs, envVars.morganConfig));

/* `app.use(express.json({}));` and `app.use(express.urlencoded({ extended: true }));` are middleware
functions in Express that parse incoming request bodies in different formats. */
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

/* `app.use(compression());` is enabling the compression middleware in the Node.js server. This
middleware compresses the response payloads before sending them to the client, which can reduce the
size of the data being transferred and improve the performance of the application. */
app.use(compression());

// PUT | DELETE => In places where the client doesn't support it
// Apply the method-override middleware
app.use(methodOverride()); // Specify the query parameter or header to check

// Static assets directory setup
app.use(express.static(path.join(__dirname, '../public')));

/* `app.use(helmet())` is enabling the Helmet middleware in the Express application. Helmet is a
collection of middleware functions that help secure the application by setting various HTTP headers.
These headers can help protect the application from common web vulnerabilities such as cross-site
scripting (XSS), clickjacking, and cross-site request forgery (CSRF). By using this middleware, the
application can automatically set these headers and improve its security posture. */
app.use(helmet());

/* `app.use(cors())` is enabling Cross-Origin Resource Sharing (CORS) middleware in the Express
application. CORS is a security feature implemented in web browsers that restricts web pages from
making requests to a different domain than the one that served the web page. By enabling CORS
middleware, the application is allowing cross-origin requests from any domain. */
app.use(cors());
app.options('*', cors());
// app.use(rateLimiter());

/* `app.use(cookieParser());` is a middleware function in Express that parses cookies attached to the
incoming request object. It populates the `req.cookies` object with key-value pairs of the parsed
cookies. This allows the application to access and manipulate cookies sent by the client, such as
session cookies or authentication tokens. The `cookie-parser` middleware is required to use cookies
in an Express application. */
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

app.use(passport.initialize());
passport.use('jwt', JwtStr);
app.use(passport.session());
app.use('/api/v1', routes);

// app.use(ConvertError);
// app.use(globalErrorHandler);
// app.use(ErrorHandler);
// app.use(NotFound);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

export default app;

