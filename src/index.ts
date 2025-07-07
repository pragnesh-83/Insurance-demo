import express, { Request, Response, NextFunction} from 'express';
import policyRoutes from './routes/PolicyRoute';
import userRoutes from './routes/UserRoute';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Add this line to enable JSON parsing in the request body
app.use('/policies', policyRoutes); // Add this line to mount the policy API routes
app.use('/user', userRoutes); // Add this line to mount the user API routes
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to DL Insurance and Policy Portal!');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong. Please contact administrator.');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
})
.on('error', function (err) {
    console.log(err);
});

export default app;