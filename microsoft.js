const { ConversationTranscriptionCanceledEventArgs } = require('microsoft-cognitiveservices-speech-sdk'),
      { TranscriptionServiceRecognizer }             = require('microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common.speech/Exports'),
      linear16                                       = require('linear16'), // Encodes supplied file to adhere to "LINEAR16" encoding
      dotenv                                         = require('dotenv').config(),
      path                                           = require("path"),
      sdk                                            = require("microsoft-cognitiveservices-speech-sdk"),
      fs                                             = require('fs');
      

// Create a speech config object
const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.MICROSOFT_KEY, process.env.MICROSOFT_REGION);

let file = path.join(__dirname,'public','uploads','output.raw');

async function main() { 
    
    // File name after encoding conversion
    let res = "";

    await linear16(path.join(__dirname,'public','uploads','blob.wav'), file)
        .then(async () => {

            res = await transcribe();

        })
        .catch((err) =>{
            console.log(err);
        });
    

    console.log(`RESULT: ${res}`);
   

    return res;

}
function transcribe() {
/* 
Returns a promise that sends a request to speech recognition API
*/
    return new Promise((resolve, reject) => {

        let recognizer = create_recognizer(file);
    
        recognizer.recognizeOnceAsync(result => {
            
            recognizer.close();
    
            resolve(result.text);
        });

    })

}

function create_recognizer(filename){
/* 
* Creates a recognizer object to use to make api calls for speech recognition.
*/  
    let pushStream = sdk.AudioInputStream.createPushStream();
    
    fs.createReadStream(filename).on('data', function(arrayBuffer) {
        pushStream.write(arrayBuffer.slice());
    }).on('end', function() {
        pushStream.close();
    });
    
    let audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);

    return new sdk.SpeechRecognizer(speechConfig, audioConfig);
    
}

module.exports = main;
