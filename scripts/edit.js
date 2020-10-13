window.onload = function() {
    const storyFile = document.getElementById("story-file"); //Todo, make this object share between read and edit
    const downloadBtn = document.getElementById("download");
    storyBody = document.getElementById("story-body");
    fileLabel = document.getElementById("cur-file"); 
    var json_object={};

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