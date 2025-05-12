import 'dotenv/config';
import pino from 'pino-http';
import cors from 'cors';
import express from 'express';
import initMongoConnection from "./db/initMongoConnection.js";
import { contactModel } from './services/contacts.js';
const app = express();

export default async function setupServer() {

console.log('setupServer is running...');

 app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

     app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
  });

    

  app.get('/contacts', async (req, res) => {
  const contacts = await contactModel.find();
  if (contacts.length === 0) {
    res.status(404).json({ message: 'Not found' });
  }

      
      
    res.json({
      status: 200,
          message: 'Successfully found contacts!',
          data: contacts
      });
  });


   app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await contactModel.findById(contactId);
 const allContacts = await contactModel.find();
  console.log('All contacts in DB:', allContacts);
    

      

        if (contact === null) {
             res.status(404).json({
            message: 'Not found'
        });
        };


      res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
   });
    
    app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});
    
//serv
    


    try {
    const PORT = process.env.PORT || 3000;
   await initMongoConnection();
    

    app.listen(PORT, (error) => {
        if (error) {
            throw error;
        }

        console.log(`Server is running on port ${PORT}`);
        
    }); 
} catch (error) {
    console.log(error);
    
}
    //serv
};



// export default app;