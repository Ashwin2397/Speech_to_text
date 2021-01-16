
/* GLOBAL VARS */
var recorder; 
var mic;
var file_blob = new Blob();


document.querySelectorAll('.btn-start-recording').forEach(item => {
    
    item.addEventListener('click', event => {
        
        // Capture mic
        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(async function(stream) {
            
            mic = stream;
            
            // Instantiate recorder
            recorder = RecordRTC(stream, {
                type: 'audio'
            });
            
            // Start recording
            recorder.startRecording();
        });
    })

})

document.querySelectorAll('.btn-stop-recording').forEach(item => {

    item.addEventListener('click', event => {
        

        console.log("STOPPING RECORDING");
        // Initiates stop recording and saves file 
        recorder.stopRecording(function() {
            file_blob = recorder.getBlob();
            
            // Convert blob to a file
            file_blob = blobToFile(file_blob, "audio.wav");

            console.log(file_blob);
            
            // Creaets form data to be sent to server
            let fd = new FormData();
            fd.append("audio",file_blob);
            
            fd.append("engine",window.location.pathname);
            // This releases the mic
            mic.stop();

            axios({
                url:"/",
                method:"POST",
                data: fd
            }).then(
                res => {
                    
                    console.log(res);
                    sleep(2000);
                    window.location.href = window.location.href;
                });   

        });


    })
})


function blobToFile(theBlob, fileName){
/* 
* Converts blob to file but adding the necessary attributes.
*/
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    
    return theBlob;
}

function sleep(ms) {
/* 
* Simulates sleep
*/    
    return new Promise(resolve => setTimeout(resolve, ms));
 }