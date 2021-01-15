let channel = new URLSearchParams(location.search).get("c");
if (!channel) channel = "UCZa_FuWq_VvM53zwVkH6EdQ";

async function getWorkingKey() {
    console.log("key not found, checking keys.")
    let r = await fetch("keys"),
    allKeys = await r.text();
    allKeys = allKeys.split('\n');
    await allKeys.every(async (key, index) => {
        let r = await fetch("https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UC-lHJZR3Gqxm24_Vd_AJ5Yw&key=" + key);
        let status = r.status;
        if (status == 200) {
            localStorage.setItem("key", key);
            console.log(`found successful key (${key})! saving in localStorage.`);
            return false;
        } else {
            return true;
        }
    });
}

if (localStorage.getItem('key') === null) {
    document.getElementById("name").innerHTML = "Grabbing new key..."
    getWorkingKey()
}

function search() {
    let replaceUrl = document.getElementById('search').value.replace("%20", " ");
    if (replaceUrl != "") {
        $.getJSON(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=channel&fields=items%2Fsnippet%2FchannelId&q=${replaceUrl}&key=${localStorage.getItem('key')}`, data=>{
            location.href = '?c=' + data.items[0].snippet.channelId;
        })
    }
    document.getElementById("search").addEventListener("keyup", function(event) {
        if (event.key == "Enter") {
            event.preventDefault();
            search();
        }
    })
};

async function updateCount() {
    let r = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channel}&key=${localStorage.getItem('key')}`),
    json = await r.json();
    if (!json.error) {
        $('#odometer').html(json.items[0].statistics.subscriberCount);
    } else {
        localStorage.removeItem('key')
        console.log('key no longer working, running getWorkingKey()...');
        document.getElementById("name").innerHTML = "Grabbing new key..."
        getWorkingKey();
    };
}

$.getJSON(`https://www.googleapis.com/youtube/v3/channels?id=${channel}&part=snippet&key=${localStorage.getItem('key')}`, data=>{
        document.getElementById("name").innerHTML = data.items[0].snippet.title;
        var image = document.querySelector('#pic');
        image.src = data.items[0].snippet.thumbnails.default.url;
    });

let countInterval = setInterval(function() {
    updateCount()
}, 5000);

updateCount()