//

//const apiendpointurl = "https://jl66fjfil5.execute-api.us-west-2.amazonaws.com/eng/playout"

//// LEAVE CODE BELOW THIS LINE /////

function mediaLiveControl(evt, controlName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(controlName).style.display = "block";
  evt.currentTarget.className += " active";

  // livestatic vodslate
  if ( controlName == "livestatic" ) {
    if ( pipSelector != "" ) {
      console.log("Selected tab is " + controlName + " need to run function to get available inputs/sources ")
      getLiveInputs(apiendpointurl)
    }
  } else if ( controlName == "vodslate" ) {
    console.log("Selected tab is " + controlName + " need to run function to get available inputs/sources ")
    // s3 api call
    s3getObjectsAPI(bucket, apiendpointurl)
  } else {
    console.log("Selected tab is " + controlName)
  }
}

function chstartstopcontrol(action_type){
  console.log("Running Channel Start/Stop function")
  if ( pipSelector == "" ) {
    console.log("Operator has not selected a channel thumbnail. Select a thumbnail first before an action can be performed")
    alert("Please select a channel thumbnail first!")
  } else {
  document.getElementById(action_type).classList.add('pressedbutton');
  console.log("action type: "+action_type+" for channel ID : "+live_event_map[pipSelector].primary_channel_id)
  // API Call to start/stop channel
  channelStartStop(action_type)

  // reset styling on the pip now that the action has been performed
  fadeAway(action_type)

  }
}

function chliveswitch() {
  console.log("Running Live input switch function")
  if ( pipSelector == "" ) {
    console.log("Operator has not selected a channel thumbnail. Select a thumbnail first before an action can be performed")
    alert("Please select a channel thumbnail first!")
  } else {
  document.getElementById('live').classList.add('pressedbutton');
  input = document.getElementById("live_source_dropdown_select").value
  console.log("Switching to input: "+input+" for channel ID : "+live_event_map[pipSelector].primary_channel_id)
  channelid = live_event_map[pipSelector].primary_channel_id + ":" + live_event_map[pipSelector].channel_region
  emlSwitchAction(input, channelid, "", "immediateSwitchLive", "", 200, "master", "immediateswitch")
  }

  // reset styling on the pip now that the action has been performed
  fadeAway('live')
}

function chvodswitch(){
  console.log("Running VOD input switch function")

  if ( pipSelector == "" ) {
    console.log("Operator has not selected a channel thumbnail. Select a thumbnail first before an action can be performed")
    alert("Please select a channel thumbnail first!")
  } else {
  document.getElementById('vod').classList.add('pressedbutton');
  input = document.getElementById("vod_source_dropdown_select").value
  console.log("Switching to input: "+input+" for channel ID : "+live_event_map[pipSelector].primary_channel_id)
  channelid = live_event_map[pipSelector].primary_channel_id + ":" + live_event_map[pipSelector].channel_region
  emlSwitchAction(input, channelid, bucket, "immediateSwitch", "", 200, "master", "immediateswitch")
  }

  fadeAway('vod')

}

function chpromoins(promo_number){
  console.log("Running promo insert function")

  if ( pipSelector == "" ) {
    console.log("Operator has not selected a channel thumbnail. Select a thumbnail first before an action can be performed")
    alert("Please select a channel thumbnail first!")
  } else {
    console.log("Selected Channel ID : "+live_event_map[pipSelector].primary_channel_id)
    console.log("Found " + live_event_map[pipSelector].promos.length + " promos in channnel map")

    if ( promo_number > live_event_map[pipSelector].promos.length ) {
      alert("Cannot play promo, it doesn't exist. You need to update the channel map via API with the promo URL")

    } else {
    document.getElementById('promo'+promo_number).classList.add('pressedbutton');
    promo_to_play = live_event_map[pipSelector].promos[promo_number-1]
    console.log("Sending an API call to MediaLive to start promo : " + promo_to_play)
    s3_url = new URL(promo_to_play.replace("s3://","https://"))
    promo_bucket = s3_url.hostname
    input = s3_url.pathname.replace(/^\/+/, '')
    console.log("Promo bucket : " + promo_bucket)
    console.log("Promo key : " + input)

    channelid = live_event_map[pipSelector].primary_channel_id + ":" + live_event_map[pipSelector].channel_region
    console.log("Submitting API Call to insert promo now")
    emlSwitchAction(input, channelid, promo_bucket, "immediateContinue", "", 200, "master", "")
    }
    // reset styling on the pip now that the action has been performed
    fadeAway('promo'+promo_number);
    fadeAway('prepare1');fadeAway('prepare2');fadeAway('prepare3');fadeAway('prepare4');
}

} // end chpromoins function

function chpromoprep(promo_number){
  console.log("Running promo prepare function")

  if ( pipSelector == "" ) {
    console.log("Operator has not selected a channel thumbnail. Select a thumbnail first before an action can be performed")
    alert("Please select a channel thumbnail first!")
  } else {
    console.log("Selected Channel ID : "+live_event_map[pipSelector].primary_channel_id)
    console.log("Found " + live_event_map[pipSelector].promos.length + " promos in channel map")

    if ( promo_number > live_event_map[pipSelector].promos.length ) {
      alert("Cannot play promo, it doesn't exist. You need to update the channel map via API with the promo URL")

    } else {
        document.getElementById('prepare1').classList.remove('pressedbutton');
        document.getElementById('prepare2').classList.remove('pressedbutton');
        document.getElementById('prepare3').classList.remove('pressedbutton');
        document.getElementById('prepare4').classList.remove('pressedbutton');
        document.getElementById('prepare'+promo_number).classList.add('pressedbutton');
        promo_to_play = live_event_map[pipSelector].promos[promo_number-1]
        console.log("Sending an API call to MediaLive to prep promo : " + promo_to_play)
        s3_url = new URL(promo_to_play.replace("s3://","https://"))
        promo_bucket = s3_url.hostname
        input = s3_url.pathname.replace(/^\/+/, '')
        console.log("Promo bucket : " + promo_bucket)
        console.log("Promo key : " + input)

        channelid = live_event_map[pipSelector].primary_channel_id + ":" + live_event_map[pipSelector].channel_region
        console.log("Submitting API Call to prepare promo now")
        emlSwitchAction(input, channelid, promo_bucket, "inputPrepare", "", 200, "master", "")
    }
    }
}


var fadeAway = function(buttonid) {
  setTimeout(function(){
  document.getElementById(buttonid).classList.remove('pressedbutton');
 }, 2000);
}

function channelDropdownPopulate(){

  let dropdown = document.getElementById('channel_selector');
  dropdown.length = 0;

  let defaultOption = document.createElement('option');
  defaultOption.text = 'Select Channel';

  dropdown.add(defaultOption);
  dropdown.selectedIndex = 0;

  for (channel in live_event_map){
    //live_event_map[channel][3]
    option = document.createElement('option');
    option.text = live_event_map[channel].channel_friendly_name;
    option.value = channel;
    dropdown.add(option)
  }

}

var sldpPlayers = [];

//document.getElementById("channel_selector").onclick = function () {
document.getElementById("channel_selector").addEventListener('change', (event) => {

  // log selected channel number and set to pipSelector variable
  pipSelector = document.getElementById("channel_selector").value
  console.log("Channel " + pipSelector + " has been selected from the dropdown menu")

  if ( pipSelector !== "" ) {
    channelState(pipSelector)
  }

  // Print channel information to channel info box
  // id to populate = channel_info
  document.getElementById("channel_info").innerHTML = '<p> Channel Name : '+live_event_map[pipSelector].channel_friendly_name+' </p>'
  document.getElementById("channel_info").innerHTML += '<p> Channel ID : '+live_event_map[pipSelector].primary_channel_id+' </p>'
  document.getElementById("channel_info").innerHTML += '<p> AWS Region : '+live_event_map[pipSelector].channel_region+' </p>'

  document.getElementById("channel_info").innerHTML += '<h3> Promo Videos </h3>'
  document.getElementById("channel_info").innerHTML += '<a href="#" onclick="inputPreview(1)" id="promo1link">Promo 1 Link</a></br>'
  document.getElementById("channel_info").innerHTML += '<a href="#" onclick="inputPreview(2)" id="promo2link">Promo 2 Link</a></br>'
  document.getElementById("channel_info").innerHTML += '<a href="#" onclick="inputPreview(3)" id="promo3link">Promo 3 Link</a></br>'
  document.getElementById("channel_info").innerHTML += '<a href="#" onclick="inputPreview(4)" id="promo4link">Promo 4 Link</a>'

  /*
  for (s3_promo in live_event_map[pipSelector].promos){
    s3_promo_url = new URL(live_event_map[pipSelector].promos[s3_promo].replace("s3://","https://"))
    promo_bucket = s3_promo_url.hostname
    promo_key = s3_promo_url.pathname.replace(/^\/+/, '')
    s3_https_url = 'https://'+promo_bucket+'.s3-'+promo_bucket_region+'.amazonaws.com/'+promo_key

    document.getElementById("channel_info").innerHTML += '<a href="'+s3_https_url+'" target="_blank"> Promo : '+ promo_key +'</a></br>'
  }
  */

  // initialize the low latency players
  function startPlayers () {
        console.log("starting sdlp players, checking to see if they are loaded already....")

        if ( sldpPlayers.length > 0 ) {
          console.log("players were already loaded, sending to restart function")
          restartPlayers();
        } else {
          console.log("players not initialized, doing now....")
          doStart();
        }
      }

      function restartPlayers () {
        var destroyCnt = 0;
        for (var i = 0; i < sldpPlayers.length; i++) {
          sldpPlayers[i].destroy(function () {
            console.log("destroying current instance of player")
            destroyCnt++;
            if (destroyCnt === sldpPlayers.length) {
              sldpPlayers = [];
              doStart();
            }
          });
        }
      console.log("old instances of players have been removed.")
      }

      function doStart () {
        console.log("initializing new sdlp players")
        for (var i = 0; i < 2; i++) {
          var streamurl;
          if ( i == 0) {
            streamurl = live_event_map[pipSelector].low_latency_url_source
          } else {
            streamurl = live_event_map[pipSelector].low_latency_url_medialive
          }

          var player = SLDP.init({
            container:          'player-wrp-' + (i + 1),
            stream_url:         streamurl,
            buffering:          250,
            autoplay:           true,
            muted:              true,
            height:             360,
            width:              640,
            vu_meter:           {type: 'input', mode: 'peak', container: 'vu-meter-' + (i + 1), rate: 10},
          });
          sldpPlayers[i] = player;
        }
      console.log("done initializing low latency players.")
      }
  startPlayers()
});

function inputPreview(promo_number){
  console.log("Going to create presign url for Promo " + promo_number)
  promo_s3uri = live_event_map[pipSelector]['promos'][promo_number-1]
  console.log("Promo S3 URI: " + promo_s3uri)

  var s3_promo_url = new URL(promo_s3uri.replace("s3://","https://"))
  var s3_promo_bucket = s3_promo_url.hostname
  var s3_promo_key = s3_promo_url.pathname.replace(/^\/+/, '')

  var presign_url = presignGenerator(s3_promo_bucket,s3_promo_key);
  console.log("opening s3 URL: " + presign_url)
  window.open(presign_url,'_blank')

}

function pageLoadFunction(){
  getConfig()
  console.log("channel map : " + JSON.stringify(live_event_map))
  //console.log("channel start slate: "+ channel_start_slate)
  console.log("vod bucket: " + bucket)
  console.log("dashboard name: " + deployment_name)
  // var s3_slate_url = new URL(channel_start_slate.replace("s3://","https://")) -- deprecated
  //window.slate_bucket = s3_slate_url.hostname -- deprecated
  //window.startup_slate_key = s3_slate_url.pathname.replace(/^\/+/, '') -- deprecated

  // write deployment title
  var deployment_name_pretty = deployment_name.toUpperCase().replace("_"," ")
  document.getElementById('deployment_title').innerHTML = '<h1 style="text-align:center">'+deployment_name_pretty+'</h1>'

  var total_channels = Object.keys(live_event_map).length;
    console.log("There are " + total_channels.toString() + " channels in this dashboard")
    window.thumbnail_size = 1
    if ( parseInt(total_channels) < 9 ) {
      window.thumbnail_size = 2
    } else {
      window.thumbnail_size = 1
    }



  channelDropdownPopulate()

  pipSelector = ""

}

setInterval(function() {

  if ( pipSelector !== "" ) {
    channelState(pipSelector)
  }

}, 5000);

setInterval(function() {

    var timenow = new Date().toTimeString()
    document.getElementById("clock").innerHTML = timenow

    //document.getElementById("clock").innerHTML = (hours + ":" + minutes + ":" + seconds + meridiem);

},1000)

/// API Calls
///
/// get Config START
function getConfig(){
  var json_data,
  current_url = window.location.href
  json_endpoint = current_url.substring(0,current_url.lastIndexOf("/")) + "/channel_map.json"

  var request = new XMLHttpRequest();
  request.open('GET', json_endpoint, false);

  request.onload = function() {

  if (request.status === 200) {
    const jdata = JSON.parse(request.responseText);
    console.log(jdata)
    window.live_event_map = jdata.channel_map
    //window.channel_start_slate = jdata.channel_start_slate // deprecated in this ui version
    window.deployment_name = jdata.dashboard_title
    window.bucket = jdata.vod_bucket
    window.promo_bucket_region = jdata.promo_bucket_region
    window.apiendpointurl = jdata.control_api_endpoint_url
    window.apiendpointhost = jdata.control_api_endpoint_host_header
    json_data = request.responseText
     } else {
    // Reached the server, but it returned an error
  }
}

request.onerror = function() {
  console.error('An error occurred fetching the JSON from ' + json_endpoint);
};

request.send();
return json_data
} // end

/// get Config END
///
/// presign Generator START
function presignGenerator(s3_promo_bucket,s3_promo_key){
    var presign_url;
    console.log("s3 presign generator api call: initializing")

    var param1 = "awsaccount=master";
    var param2 = "&functiontorun=presignGenerator"
    var param3 = "&channelid=0:x"; // this needs to be full list of channel id's and regions
    var param4 = "&maxresults=200";
    var param5 = "&bucket="+s3_promo_bucket;
    var param6 = "&input="+s3_promo_key;
    var param7 = "&follow=";
    var url = apiendpointurl+"?"+param1+param2+param3+param4+param5+param6+param7

    var request = new XMLHttpRequest();
    request.open('GET', url, false);

  request.onload = function() {

  if (request.status === 200) {
    var jdata = JSON.parse(request.responseText);

    console.log(jdata)
    presign_url = jdata.url

     } else {
    // Reached the server, but it returned an error
  }
}

request.onerror = function() {
  console.error('An error occurred fetching the JSON from ' + url);
  alert("Could not generate Presign S3 URL")
};

request.send();
return presign_url
} // end

/// presign Generator END
///
/// channel state START
function channelState() {
    console.log("channel state api call: initializing")
    var channellist = [];
    var channelid = live_event_map[pipSelector].primary_channel_id  + ":" + live_event_map[pipSelector].channel_region

    var param1 = "awsaccount=master";
    var param2 = "&functiontorun=describeChannelState"
    var param3 = "&channelid="+channelid; // this needs to be full list of channel id's and regions
    var param4 = "&maxresults=200";
    var param5 = "&bucket=";
    var param6 = "&input=";
    var param7 = "&follow=";
    var url = apiendpointurl+"?"+param1+param2+param3+param4+param5+param6+param7

    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
      if (request.status === 200) {
        const state_data = JSON.parse(request.responseText);
        console.log("channel state api call response : " + JSON.stringify(state_data))
        document.getElementById('channel_status').innerHTML = '<h3>Channel Status:</br>'+state_data.status+'</h3>'
       } else {
         error_message = "Unable to get channel status"
         document.getElementById('channel_status').innerHTML = '<h3>Channel Status:</br>'+error_message+'</h3>'
        // Reached the server, but it returned an error
      }
    }
    request.onerror = function() {
      console.error('An error occurred fetching the JSON from ' + url);
    };

    request.send();
}

/// channel state END
///
/// S3 GET OBJECT API CALL - START
function s3getObjectsAPI(bucket, apiendpointurl) {
    console.log("s3 get objects api call: initializing")
    var param1 = "awsaccount=master";
    var param2 = "&functiontorun=s3GetAssetList"
    var param3 = "&channelid=0:x";
    var param4 = "&maxresults=200";
    var param5 = "&bucket="+bucket;
    var param6 = "&input=";
    var param7 = "&follow=";
    var url = apiendpointurl+"?"+param1+param2+param3+param4+param5+param6+param7
    console.log("Executing API Call to get S3 assets: " +url )

    let dropdown = document.getElementById('vod_source_dropdown_select');
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Choose Asset';

    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;

    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
      if (request.status === 200) {
        const data = JSON.parse(request.responseText);
        console.log("s3 get objects api call response: " + data)
        let option;
        for (let i = 0; i < data.length; i++) {
          option = document.createElement('option');
          option.text = data[i].name;
          option.value = data[i].key;
          dropdown.add(option);
        }
       } else {
        // Reached the server, but it returned an error
      }
    }

    request.onerror = function() {
      console.error('An error occurred fetching the JSON from ' + url);
    };

    request.send();
}

/// S3 GET OBJECT API CALL - END
///
/// EML GET ATTACHED INPUTS - START

function getLiveInputs(apiendpointurl) {
    console.log("get live inputs api call: initializing")
    var channelid = live_event_map[pipSelector].primary_channel_id + ":" + live_event_map[pipSelector].channel_region;
    var input = document.getElementById("live_source_dropdown_select").value;

    var param1 = "awsaccount=master";
    var param2 = "&functiontorun=getAttachedInputs"
    var param3 = "&channelid="+channelid;
    var param4 = "&maxresults=200";
    var param5 = "&bucket=";
    var param6 = "&input="+input;
    var param7 = "&follow=";

    var url = apiendpointurl+"?"+param1+param2+param3+param4+param5+param6+param7
    console.log("Executing API call to get attached inputs to MediaLive Channel " + channelid )

    let dropdown = document.getElementById('live_source_dropdown_select');
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Choose Live Source';

    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;

    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
      if (request.status === 200) {
        const data = JSON.parse(request.responseText);
        console.log("get live inputs api call response : " + data)
        let option;
        for (let i = 0; i < data.length; i++) {
          option = document.createElement('option');
          option.text = data[i].name;
          option.value = data[i].name;
          dropdown.add(option);
        }
       } else {
        // Reached the server, but it returned an error
      }
    }
    request.onerror = function() {
      console.error('An error occurred fetching the JSON from ' + url);
    };

    request.send();
}

/// EML GET ATTACHED INPUTS - END

/// EML SWITCH - START

function emlSwitchAction(file, channelid, bucket, takeType, follow, maxresults, awsaccount, scte){
    console.log("eml switch action api call: initializing")
    console.log("Executing API PUT action for switch type "+takeType)

    var param1 = "awsaccount="+awsaccount;
    var param2 = "&functiontorun="+takeType
    var param3 = "&channelid="+channelid;
    var param4 = "&maxresults="+maxresults;
    var param5 = "&bucket="+bucket;
    var param6 = "&input="+file;
    var param7 = "&follow="+follow;
    var param8 = "&duration="+scte;
    var url = apiendpointurl+"?"+param1+param2+param3+param4+param5+param6+param7+param8
    console.log("eml switch action api call - executing : "+url)

    var putReq = new XMLHttpRequest();
    putReq.open("PUT", url, false);
    putReq.setRequestHeader("Accept","*/*");
    putReq.send();
}

/// EML SWITCH - END

/// EML SWITCH VOD - START

/// EML SWITCH VOD - END

/// EML CHANNEL START/STOP - START

function channelStartStop(startstop){

    if (pipSelector.length < 1){
      alert("Select a channel first...");
      return;
    }

    channels = [ live_event_map[pipSelector].primary_channel_id , live_event_map[pipSelector].proxy_gen_channel ]

    for ( i in channels ) {

        console.log("channel start-stop action api call: initializing")
        console.log("performing api action on channel id : " + channels[i])
        channelid = channels[i] + ":" + live_event_map[pipSelector].channel_region;

        var param1 = "awsaccount=master";
        var param2 = "&functiontorun=channelStartStop"
        var param3 = "&channelid="+channelid;
        var param4 = "&maxresults=200";
        var param5 = "&bucket=bucket:path/key.mp4";
        var param6 = "&input="+startstop;
        var param7 = "&follow=";
        var param8 = "&duration=";
        var url = apiendpointurl+"?"+param1+param2+param3+param4+param5+param6+param7+param8
        console.log("channel start-stop action api call - executing : " + channelid)

        var putReq = new XMLHttpRequest();
        putReq.open("PUT", url, false);
        putReq.setRequestHeader("Accept","*/*");
        putReq.send();

    }
    alert("Channel state is changing, please be patient. This may take 60-90 seconds")
}

/// EML CHANNEL START/STOP - END
///
