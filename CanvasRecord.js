function CanvasRecorder(canvas, video_bits_per_sec) {
    this.start = startRecording;
    this.stop = stopRecording;
    this.save = download;

    var recordedBlobs = [];
    var supportedType = null;
    var mediaRecorder = null;

    var stream = canvas.captureStream();
    if (typeof stream == undefined || !stream) {
        return;
    }

    const video = document.createElement('video');
    video.style.display = 'none';

    function startRecording() {
        let types = [
            "video/webm",
            'video/webm,codecs=vp9',
            'video/vp8',
            "video/webm\;codecs=vp8",
            "video/webm\;codecs=daala",
            "video/webm\;codecs=h264",
            "video/mpeg"
        ];

        for (let i in types) {
            if (MediaRecorder.isTypeSupported(types[i])) {
                supportedType = types[i];
                break;
            }
        }
        if (supportedType == null) {
            console.log("No supported type found for MediaRecorder");
        }
        let options = { 
            mimeType: "video/webm",
            videoBitsPerSecond: video_bits_per_sec || 2500000 // 2.5Mbps
        };

        recordedBlobs = [];
        try {
            mediaRecorder = new MediaRecorder(stream, options);
        } catch (e) {
            alert('MediaRecorder is not supported by this browser.');
            console.error('Exception while creating MediaRecorder:', e);
            return;
        }

        mediaRecorder.onstop = handleStop;
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start(100); // collect 100ms of data blobs
    }

    function handleDataAvailable(event) {
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    }

    function handleStop(event) {
        const superBuffer = new Blob(recordedBlobs, { type: supportedType });
        video.src = window.URL.createObjectURL(superBuffer);
    }

    function stopRecording() {
        mediaRecorder.stop();
        video.controls = true;
    }
    function download(file_name, setting) {
        const name = file_name || 'recording.webm';
        const blob = new Blob(recordedBlobs, { type: supportedType });
        var url = window.URL.createObjectURL(blob);
        var ah = new FileReader();
        if (setting == "webm") {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = URL.createObjectURL(blob);;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(URL.createObjectURL(blob));
            }, 100);
            document.getElementById("download-final").classList.remove("download-active");
            document.getElementById("download-final").innerHTML = "Download";
        } else {
            convertStreams(blob, setting);
        }
    }
}