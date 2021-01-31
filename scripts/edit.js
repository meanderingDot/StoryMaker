window.onload = function() {
    const storyFile = document.getElementById("story-file");
    const downloadBtn = document.getElementById("download");
    storyBody = document.getElementById("story-body");
    fileLabel = document.getElementById("cur-file"); 
    var json_object={};

    // We previously loaded a story, lets keep it active
    if (null != localStorage.getItem("story-title") && localStorage.getItem("story-text") != null) {
        fileLabel.innerHTML = "Current File: " + localStorage.getItem("story-title");
        json_object = JSON.parse(localStorage.getItem("story-text"));
    }

    storyFile.addEventListener("change", handleFiles, false);
    function handleFiles() {
        storyRaw = this.files[0];
        fileLabel.innerHTML = "Current File:" + storyRaw.name;

        read = new FileReader();
        read.readAsBinaryString(storyRaw);
        read.onload = function(){
            //This is sketchy cause its async and there's no gaurentee how long it'll take...
            var read_text = read.result;
            json_object=JSON.parse(read_text);
        }
    }

    downloadBtn.addEventListener("click", function() {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json_object));
        downloadBtn.setAttribute("href", dataStr);
        downloadBtn.setAttribute("download", "story.json");
    });
}