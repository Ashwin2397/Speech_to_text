// var express = require("express"),
//     dotenv  = require('dotenv').config(),
//     app     = express();

// // Imports the Google Cloud client library
// const speech = require('@google-cloud/speech');
// const recorder = require('node-record-lpcm16');

// // Creates a client
// const client = new speech.SpeechClient();

// /**
//  * TODO(developer): Uncomment the following lines before running the sample.
//  */
// const encoding = 'LINEAR16'; // Encoding of the audio file
// const sampleRateHertz = 16000;
// const languageCode = 'en-US'; // BCP-47 language code

// const request = {
//   config: {
//     encoding: encoding,
//     sampleRateHertz: sampleRateHertz,
//     languageCode: languageCode,
//   },
//   interimResults: false, // If you want interim results, set this to true
// };

// // Create a recognize stream
// const recognizeStream = client
//   .streamingRecognize(request)
//   .on('error', console.error)
//   .on('data', data =>
//     process.stdout.write(
//       data.results[0] && data.results[0].alternatives[0]
//         ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
//         : '\n\nReached transcription time limit, press Ctrl+C\n'
//     )
//   );

// // Start recording and send the microphone input to the Speech API.
// // Ensure SoX is installed, see https://www.npmjs.com/package/node-record-lpcm16#dependencies
// recorder
//   .record({
//     sampleRateHertz: sampleRateHertz,
//     threshold: 0,
//     // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
//     verbose: false,
//     recordProgram: 'rec', // Try also "arecord" or "sox"
//     silence: '10.0',
//   })
//   .stream()
//   .on('error', console.error)
//   .pipe(recognizeStream);

// console.log('Listening, press Ctrl+C to stop.');
// // // Creates a client
// // const client = new speech.SpeechClient();

// // async function quickstart() {
// //   // The path to the remote LINEAR16 file
// //   const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';

// //   // The audio file's encoding, sample rate in hertz, and BCP-47 language code
// //   const audio = {
// //     uri: gcsUri,
// //   };
// //   const config = {
// //     encoding: 'LINEAR16',
// //     sampleRateHertz: 16000,
// //     languageCode: 'en-US',
// //   };
// //   const request = {
// //     audio: audio,
// //     config: config,
// //   };

// //   // Detects speech in the audio file
// //   const [response] = await client.recognize(request);
// //   const transcription = response.results
// //     .map(result => result.alternatives[0].transcript)
// //     .join('\n');
// //   console.log(`Transcription: ${transcription}`);
// // }
// // quickstart();


/* // Configure with ejs
app.set("view engine","ejs");

app.get("/",function(req,res){

    res.render("landing",{recorded:false, output:""});

});

app.listen(1234,"localhost",function(){

    console.log("[STARTING] Server is starting ...");
    console.log("[LISTENING] Server is listening ...");

});
 */


const fs = require('fs');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const { exit } = require('process');

async function main(){

    // const linear16 = require('linear16');
 
    // (async () => {
    
    // const outPath = await linear16('./resources/audio.wav', './resources/output2.raw');
    // console.log(outPath); // Returns the output path, ex: ./output.wav
    
    // })();


    // Creates a client
    const client = new speech.SpeechClient();

    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    const filename = "./resources/output2.raw"; //'Local path to audio file, e.g. /path/to/audio.raw';
    const encoding = 'LINEAR16';
    const sampleRateHertz = 16000;
    const languageCode = 'en-US';

    const file = fs.readFileSync(filename);
    const audioBytes = file.toString('base64');  

    const audio = {
        content: audioBytes
    };

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
    console.log(response);
    const transcription = response.results.map(result => 
        result.alternatives[0].transcript).join('\n');
        console.log(`Transcription: ${transcription}`);


    /* 
    // Stream the audio to the Google Cloud Speech API
    const recognizeStream = client
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', data => {
        console.log(
            `Transcription: ${data.results[0].alternatives[0].transcript}`
            );
        });
        
        // Stream an audio file from disk to the Speech API, e.g. "./resources/audio.raw"
    fs.createReadStream(filename).pipe(recognizeStream); */

    console.log("HI");

    
}
 
main().catch(console.error);