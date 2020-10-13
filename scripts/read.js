window.onload = function() {
    const storyFile = document.getElementById("story-file"); //Todo, make this object share between read and edit
    const navReset = document.getElementById("nav-reset");
    const navBack = document.getElementById("nav-back");
    storyBody = document.getElementById("story-body");
    fileLabel = document.getElementById("cur-file");
    var json_object={};
    var history = [];

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
            resetStory();
        }
    }

    storyBody.addEventListener("click", function(){
        const isButton = event.target.nodeName === 'BUTTON';
        if (isButton) {
            hideOldButtons();
            nextStoryNode(event.target.id);
        }
    })

    navReset.addEventListener("click", function() {
        resetStory();
    });

    navBack.addEventListener("click", function() {
        backStep();
    });

    function nextStoryNode(i) {
        history.push(i);
        if (typeof json_object[i] !== 'undefined') {
            storyBody.innerHTML += "<p><b>" + json_object[i]["title"] + "</b>";
            storyBody.innerHTML += "<p>" + json_object[i]["body"];
            json_object[i]["options"].forEach(function(opt){
                storyBody.innerHTML += "<button type='button' class'storybutton' id='"+opt.id+"'>" + opt.title + "</button>";
            });    
        } else {
            storyBody.innerHTML += "<p> Whoops! This story isn't finished yet! Try resetting";
        }
        window.scrollTo(0,document.body.scrollHeight);
    }

    function hideOldButtons() {
        var i =document.getElementsByTagName("button");
        for(var n in i){
            if(i[n].type == "button"){ 
                i[n].style.visibility = "hidden";    
            }
        }
    }

    function resetStory() {
        history = [];
        storyBody.innerHTML = "";
        nextStoryNode("0");
    }

    function backStep() {
        history.pop(); // Clear the current node
        prev = history.pop();
        if (typeof prev == 'undefined') {
            prev = "0";
        }
        nextStoryNode(prev);
    }
};