var linear16 = require('linear16'), // Encodes supplied file to adhere to "LINEAR16" encoding
    dotenv   = require('dotenv').config(), 
    speech   = require('@google-cloud/speech'), // Imports the Google Cloud client library
    path     = require('path'),
    {exit}   = require('process'),
    fs       = require('fs'); // File system module

    
async function main(){
    
    // Constants
    const sampleRateHertz = 16000,
          languageCode    = 'en-US',
          filename        = path.join(__dirname,'public','uploads','output.raw'), //'Local path to audio file, e.g. /path/to/audio.raw';
          encoding        = 'LINEAR16';
    
    // Creates a client
    const client = new speech.SpeechClient();

    // The transcribed audio
    var transcription;
    
    
    await linear16(path.join(__dirname,'public','uploads','blob.wav'), filename)
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
                

        })
        .catch((err)=>{
           console.log("An error just occurred, either with google or with linear16 ");
        });
    
    return transcription;
    
}

module.exports = main;