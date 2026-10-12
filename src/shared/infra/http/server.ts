import 'reflect-metadata';

import dataSource from '@shared/infra/typeorm';
import app from './app';

const port = Number(process.env.PORT || 3333);

dataSource
  .initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed', err);
    process.exit(1);
  });
