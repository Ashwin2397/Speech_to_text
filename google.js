var linear16 = require('linear16'), // Encodes supplied file to adhere to "LINEAR16" encoding
    dotenv   = require('dotenv').config(), 
    speech   = require('@google-cloud/speech'), // Imports the Google Cloud client library
    {exit}   = require('process'),
    fs       = require('fs'); // File system module

    // if(process.env.NODE_ENV !== "production"){

    //     require('dotenv').config(); 
    // }
async function main(){
    
    // Constants
    const sampleRateHertz = 16000,
          languageCode    = 'en-US',
          filename        = "./public/uploads/output2.raw", //'Local path to audio file, e.g. /path/to/audio.raw';
          encoding        = 'LINEAR16';
    
    // Creates a client
    const client = new speech.SpeechClient();

    // The transcribed audio
    var transcription;
    
    
    // (async () => {
        
    await linear16('./public/uploads/blob.wav', './public/uploads/output2.raw')
        .then(   async function(){
            
            // Read file and convert to base64 string
            const file = fs.readFileSync(filename);
            const audioBytes = file.toString('base64');  
        
            const audio = {
                content: audioBytes
            };
        
            // Request object to be used by the client
            const request = {
                audio: audio,
                config: {
                    encoding: encoding,
                    sampleRateHertz: sampleRateHertz,
                    languageCode: languageCode,
                }
        
                //interimResults: false, // If you want interim results, set this to true
            };

           
                const [response] = await client.recognize(request);

                transcription = response.results.map(result => 
                result.alternatives[0].transcript).join('\n');
                

        });
        
    return transcription;
    
}

module.exports = main;