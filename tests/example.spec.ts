import { test, expect } from '@playwright/test';

let userId: string;
let newWalletId: string;
let debitCardId: string;
let  mainWalletId: string;

test('should create entitys', async ({ request }) => {
  const AGE = 26;
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
  let reqJSON = await req.json();
  expect(reqJSON).toHaveProperty('id');

  // gets the userId
  userId = await reqJSON.id;
  mainWalletId = await reqJSON.walletId;

  // activate the user
    // declaring path to EPIGRAM
  const EPIGRAM = `${process.env.API_KEY_EPI}`
  req = await request.post(`${EPIGRAM}v1/ActivateUser`, {
    headers:{
      'X-API-KEY': `${process.env.API_KEY_EPI}`
    },
    data:{
        "clientId": `${process.env.CLIENT_ID}`,
        "userId": `${userId}`,
        "age": AGE
    }
  });
  
  
  // expecting a 201 - success
  expect(req.status()).toBe(201 || 200);
  
  // create debit wallet
  req = await request.post('v1/wallets', {
    data:{
      "userId": `${userId}`,
      "currency": "USD",
      "description": "Auto test",
      "walletType": "001"
    }
  });

  reqJSON = await req.json();
  newWalletId = await reqJSON.id;

  // expecting a 201 - success
  expect(req.status()).toBe(201 || 200);
  
  req = await request.post('v1/debitCards', {
    data:{
      "userId": `${userId}`,
      "walletId": `${newWalletId}`,
      "physicalCard": true,
      "code": "001"
    }
  });
  // expecting a 201 - success
  expect(req.status()).toBe(201);
  
  
  reqJSON = await req.json();
  debitCardId = await reqJSON.id;
  
  //[EPIGRAM] ACK verification / Validate card method 
  req = await request.post(`${EPIGRAM}v1/cardOperations/validateCard`, {
    headers:{
      'X-API-KEY': `${process.env.API_KEY_EPI}`
    },
    data:{
      "cardId": `${debitCardId}`,
      "clientId": `${process.env.CLIENT_ID}`
    }
  });

  // expecting a 201 - success
  expect(req.status()).toBe(201 || 200);
  
  console.log("userId:" + userId);
  console.log("walletId:" + newWalletId);
  console.log("debitCard:" + debitCardId);
});

test('Card Operation Test', async ({ request }) => {
   let req = await request.post('v1/cardOperations/ackReception', {
    data:{
      "cardId": `${debitCardId}`
    }
  });
  // ACK Reception
  expect(req.status()).toBe(200 || 201 || 422);
  
  req = await request.post('v1/cardOperations/checkPan', {
   data:{
     "cardId": `${debitCardId}`
   }
 });
 // checkPan Reception
 expect(req.status()).toBe(200 || 201);
 
 req = await request.post('v1/cardOperations/checkCvv', {
  data:{
    "cardId": `${debitCardId}`
  }
});
// checkCvv Reception
expect(req.status()).toBe(200 || 201);

req = await request.post('v1/cardOperations/checkPin', {
   data:{
     "cardId": `${debitCardId}`
   }
 });
 // checkPin Reception
 expect(req.status()).toBe(200 || 201);

 req = await request.post('v1/cardOperations/changePin', {
   data:{
     "cardId": `${debitCardId}`,
     "pin": "1234"
   }
 });
 // changePin Reception
 expect(req.status()).toBe(200 || 201);

 req = await request.post('v1/cardOperations/unblockPin', {
   data:{
     "cardId": `${debitCardId}`
   }
 });
 // unblockPin Reception
 expect(req.status()).toBe(200 || 201 || 422);

 req = await request.post('v1/cardOperations/blockCard', {
   data:{
     "cardId": `${debitCardId}`
   }
 });
 // blockCard Reception
 expect(req.status()).toBe(200 || 201);

 req = await request.post('v1/cardOperations/unblockCard', {
   data:{
     "cardId": `${debitCardId}`
   }
 });
 // unblockCard Reception
 expect(req.status()).toBe(200 || 201);

 req = await request.post('v1/cardOperations/checkDueDate', {
   data:{
     "cardId": `${debitCardId}`
   }
 });
 // checkDueDate Reception
 expect(req.status()).toBe(200 || 201);

});


// test('should test PayIn / PayOut / Transfer in / transfer out', async ({ request }) => {

// });