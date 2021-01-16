
var recorder; // globally accessible
var mic;

var start_btn = document.getElementById("btn-start-recording");
var end_btn = document.getElementById("btn-stop-recording");

var file = document.getElementById("file");

var file_blob = new Blob();

start_btn.onclick = function(){


    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(async function(stream) {
        
        mic = stream;
        
        recorder = RecordRTC(stream, {
            type: 'audio'
        });
        recorder.startRecording();

    
});
};


end_btn.onclick = function(){
    
    // Initiates stop recording and saves file 
    recorder.stopRecording(function() {
        file_blob = recorder.getBlob();
        
        // Convert blob to a file
        file_blob = blobToFile(file_blob, "audio.wav");

        console.log(file_blob);

        // invokeSaveAsDialog(blob,"audio.wav");
        
        // Goes to the route but does not send file as expected
        // fetch("http://localhost:1234/", { 
        //     method: 'POST', 
        //     body:{
        //         "audio":file_blob
        //         } 
        //     })
        //     .then(results => console.log(results.json))
        
        let fd = new FormData();
        fd.append("audio",file_blob);

        
        
        // This releases the mic
        mic.stop();

        axios({
            url:"/",
            method:"POST",
            data: fd
        }).then(
            res => {console.log(res);}
        );

    });


}

function blobToFile(theBlob, fileName){

    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    
    return theBlob;
}