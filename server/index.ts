import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import { Ticket as TicketType } from '../client/src/api';

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.get(APIPath, (req, res) => {

  // @ts-ignore
  const page: number = req.query.page || 1;
  const search = req.query.search || '';
  const sort = req.query.sort;

  const filteredTickets = tempData
  .filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(search as string));
  
  if(sort=='true'){ 
    filteredTickets.sort( (a: TicketType, b: TicketType) => {
      return (b.creationTime - a.creationTime)
    }); 
  }
  const paginatedData = filteredTickets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  res.send(paginatedData);
});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

