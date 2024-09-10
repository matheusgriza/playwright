import { test, expect } from '@playwright/test';
import exp from 'constants';

test('should create entitys', async ({ request }) => {
  const age = 1998;
  let req = await request.post('v1/endUsers', {
    data:{
      "firstName": "Matheus",
      "lastName": "Griza Est",
      "email": "mateuzinho@paycaddy.com",
      "telephone": "3496294733",
      "placeOfWork": "PayCaddy Inco",
      "pep": true,
      "salary": 1000,
      "address": {
        "addressLine1": "Calle Mayor",
        "addressLine2": "Calle Mayor",
        "homeNumber": "30",
        "city": "Murcia",
        "region": "Murcia",
        "postalCode": "30002",
        "country": "Spain"
      }
    }
  })
  // expecting a 201
  expect(req.status()).toBe(201 || 200);

  //building json from the response
  const reqJSON = await req.json();
  console.log(await reqJSON);
  expect(reqJSON).toHaveProperty('id');

  // gets the userId
  const userId = await reqJSON.id;

  // activate the user
    // declaring path to EPIGRAM
  const EPIGRAM = 'https://int.epigram.paycaddy.dev/'
  req = await request.post(`${EPIGRAM}v1/ActivateUser`,{
    headers:{
      'X-API-KEY': `${process.env.API_KEY_EPI}`
    },
    data:{
        "clientId": `${process.env.CLIENT_ID}`,
        "userId": `${userId}`,
        "age": age
    }
  });
  console.log(req.text());
  // expecting a 201 - success
  expect(req.status()).toBe(201);
  
  // endUser GET
  req = await request.get(`v1/endUsers/${userId}`);
  // expecting a 201 - success
  expect(req.status()).toBe(200);  
});
