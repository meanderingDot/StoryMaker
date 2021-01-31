window.onload = function() {
    /*** Set up our variables ***/
    const storyFile = document.getElementById("story-file"); 
    const navReset = document.getElementById("nav-reset");
    const navBack = document.getElementById("nav-back");
    storyBody = document.getElementById("story-body");
    fileLabel = document.getElementById("cur-file");
    var json_object = {};
    var history = [];

    // If we previously loaded a story, lets keep it active
    if (null != localStorage.getItem("story-title") && localStorage.getItem("story-text") != null) {
        fileLabel.innerHTML = "Current File: " + localStorage.getItem("story-title");
        json_object = JSON.parse(localStorage.getItem("story-text"));
        resetStory();
    }

    /*** Set up event listeners ***/

    storyFile.addEventListener("change", handleFiles, false);
    function handleFiles() {
        storyRaw = this.files[0];
        fileLabel.innerHTML = "Current File: " + storyRaw.name;

        read = new FileReader();
        read.readAsBinaryString(storyRaw);
        read.onload = function(){
            // This is sketchy cause its async and there's no gaurentee how long it'll take...
            try {
                var read_text = read.result;
                json_object = JSON.parse(read_text);
                localStorage.setItem("story-title", storyRaw.name);
                localStorage.setItem("story-text", read_text);
            }
            catch (err) {
                alert("I couldn't load the story!\n" + err.message);
                // Trying to load a new file failed so clear the old one
                storyFile.value = "";
                fileLabel.value = "";
                storyBody.value = "";
                json_object = {};
                history = [];
            }
            resetStory();

        }
    }

    storyBody.addEventListener("click", function() {
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

    /*** Define the functions we'll use ***/

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