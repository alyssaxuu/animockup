$(document).ready(function(){
  var db = firebase.firestore();
  isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)
  if (isSafari) {
    $("#safari-disclaimer").css({display:"block"});
  }

  // Initialize dropdowns
  $(".select").html("");
  mockups.forEach(function(mockup){
    var prolabel = "";
    if (mockup.pro) {
      prolabel = "<span class='pro-label'>PRO</span>";
    }
    if (mockup.name == "iphone-13") {
      $(".select").append("<div class='option cool-option selected' value='"+mockup.name+"'><img class='mockup-img' src='"+mockup.thumb+"'><div class='mockup-info'><div class='mockup-name'>"+mockup.label+prolabel+"</div><div class='mockup-details'>"+mockup.width+" x "+mockup.height+"</div></div></div>")
    } else {
      $(".select").append("<div class='option cool-option' value='"+mockup.name+"'><img class='mockup-img' src='"+mockup.thumb+"'><div class='mockup-info'><div class='mockup-name'>"+mockup.label+prolabel+"</div><div class='mockup-details'>"+mockup.width+" x "+mockup.height+"</div></div></div>")
    }
  });
  $(".select").niceSelect();
  $(".select-2").niceSelect();
  $(".select-3").niceSelect();
  $(".select-4").niceSelect();
  $(".select-5").niceSelect();
  $(".select-6").niceSelect();
  $(".select-7").niceSelect();
  $(".select-8").niceSelect();
  $(".select-9").niceSelect();
  $(".select-10").niceSelect();
  $(".select-2 .list").append("<div id='custom-dimensions'><div id='wrap-inputs'><div class='dimensions' data-label='W'><input id='canvas-width' value='1200'></div><div class='dimensions' data-label='H'><input id='canvas-height' value='675'></div></div></div>");

  background_color.hide();

  // Color picker events
  text_color.on('init', instance => {
    text_color.hide();
  }).on('change', instance => {
    canvas.getActiveObject().set("fill", text_color.getColor().toRGBA().toString());
    canvas.renderAll();
    $("#color-choose").css({background:text_color.getColor().toRGBA().toString()});
  }).on('hide', instance => {
    updateRecordCanvas();
  })

  // Color picker events
  background_color.on('init', instance => {
    background_color.hide();
  }).on('change', instance => {
    artboard.set("fill", background_color.getColor().toRGBA().toString());
    canvas.renderAll();
  }).on('hide', instance => {
    updateRecordCanvas();
  })

  // Success checkout
  function checkoutComplete(data) {
		console.log(data);
    premiumuser = true;
		$(".pro-label").addClass("premium-on");
		$(".pro-label").css({display:"none"});
		$("#watermark input").attr("disabled", false);
		$("#watermark input").attr("checked", true);
		$("#copy").css({display:"none"});
		if (canvasrecord.getItemById("watermark")) {
			canvasrecord.getItemById("watermark").set({opacity: 0});
			canvasrecord.renderAll();
		}
		window.setTimeout(function(){
			$.ajax({
				type:"GET",
				crossDomain: true,
				dataType: 'jsonp',
				url:"https://checkout.paddle.com/api/1.0/order?checkout_id="+data.eventData.checkout.id,
				success: function(newdata){
					console.log(newdata)
					saveSubscription(newdata.order.subscription_id);
				}
			})
		}, 10000);
  }

  // Cancel checkout
  function checkoutClosed(data) {
    hideUpgradePopup();
  }

  function checkSubscription(id) {
    if (id == undefined) {
      return;
    }
    $.post("api.php", {request:"check-subscription", id:id}, function(data){
      if (data == "active") {
				window.setTimeout(function(){
					premiumuser = true;
					$(".pro-label").addClass("premium-on");
					$(".pro-label").css({display:"none"});
					$("#watermark input").attr("disabled", false);
					$("#watermark input").attr("checked", true);
					$("#copy").css({display:"none"});
					if (canvasrecord.getItemById("watermark")) {
						canvasrecord.getItemById("watermark").set({opacity: 0});
						canvasrecord.renderAll();
					}
				}, 100);
      }
    })
  }

  function saveSubscription(subscription) {
     $.post("api.php", {request:"get-subscription", id:subscription}, function(data){
        data = JSON.parse(data);
        var updateurl = data[0];
        var cancelurl = data[1];
        db.collection("users").doc(uid).set({
            subscription:subscription,
            cancelurl:cancelurl,
            updateurl:updateurl
        });
     });
  }

  Paddle.Setup({
    vendor: 137741,
    eventCallback: function(data) {
      // The data.event will specify the event type
      if (data.event === "Checkout.PaymentComplete") {
        checkoutComplete(data);
      }
      else if (data.event === "Checkout.Close") {

      }
    }
  });

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      uid = user.uid;
      db.collection("users").doc(uid).get().then((doc) => {
        signedin = true;
        if (doc.exists) {
          cancelurl = doc.data().cancelurl;
          updateurl = doc.data().updateurl;
          checkSubscription(doc.data().subscription);
        }
      })
    } else {
      signedin = false;
    }
  });

  // Google sign in
  function googleSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
      var credential = result.credential;
      var token = credential.accessToken;
      uid = result.user.uid;
      hideUpgradePopup();
      db.collection("users").doc(uid).get().then((doc) => {
        signedin = true;
        if (doc.exists) {
          cancelurl = doc.data().cancelurl;
          updateurl = doc.data().updateurl;
          checkSubscription(doc.data().subscription);
        } else {
          Paddle.Checkout.open({
          	product: 743638,
          	passthrough: '{"user_id": '+uid+'}',
            successCallback: "checkoutComplete",
            closeCallback: "checkoutClosed"
          });
        }
      })
    })
  }

  // Log out
  function logOut(){
    hideUserDropdown();
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
    })
  }

  // Resize the canvas
  function resizeCanvas() {
      canvas.discardActiveObject();
      canvas.setHeight($("#canvas-area").height());
      canvas.setWidth($("#canvas-area").width());
      canvas.getItemById("artboard").set({left:(canvas.get("width")/2)-(artboard.get("width")/2),top:(canvas.get("height")/2)-(canvas.getItemById("artboard").get("height")/2)});
      canvas.renderAll();
      objects.forEach(function(object){
        if (object.id == "screen" && !rearranging) {
          return;
        }
        if (object.id == "mockup_img" || object.id == "clip") {
          return;
        }
        canvas.getItemById(object.id).set({left:object.x+canvas.getItemById("artboard").get("left"), top:object.y+canvas.getItemById("artboard").get("top"), scaleX:object.scaleX, scaleY:object.scaleY, opacity:1});
        canvas.renderAll();
      })
      initLines();
  }
  window.addEventListener('resize', resizeCanvas, false);
  resizeCanvas();

  // Enable tools
  function enableTool(switchto) {
    canvas.discardActiveObject().renderAll();
    if ($(".tool-active").length) {
      var type = $(".tool-active").attr("id");
      if (type == "cursor") {
        $(".tool-active img").attr("src", "assets/cursor.png");
      } else if (type == "text") {
        $(".tool-active img").attr("src", "assets/text.png");
      } else if (type == "image") {
        $(".tool-active img").attr("src", "assets/image.png");
      } else if (type == "video") {
        $(".tool-active img").attr("src", "assets/video.png");
      } else if (type == "shape") {
        $(".tool-active img").attr("src", "assets/shape.png");
      } else if (type == "hand") {
        $(".tool-active img").attr("src", "assets/hand.png");
      }
      $(".tool-active").removeClass("tool-active");
    }
    var type = $(this).attr("id");
    if (type == "cursor") {
      $(this).find("img").attr("src", "assets/cursor-active.png");
    } else if (type == "text") {
      $(this).find("img").attr("src", "assets/text-active.png");
    } else if (type == "image") {
      $(this).find("img").attr("src", "assets/image-active.png");
    } else if (type == "video") {
      $(this).find("img").attr("src", "assets/video-active.png");
    } else if (type == "shape") {
      $(this).find("img").attr("src", "assets/shape-active.png");
    } else if (type == "hand") {
      $(this).find("img").attr("src", "assets/hand-active.png");
    }
    $(this).addClass("tool-active");
    tool = type;
  }

  function resetTool() {
    if ($(".tool-active").length) {
      var type = $(".tool-active").attr("id");
      if (type == "cursor") {
        $(".tool-active img").attr("src", "assets/cursor.png");
      } else if (type == "text") {
        $(".tool-active img").attr("src", "assets/text.png");
      } else if (type == "image") {
        $(".tool-active img").attr("src", "assets/image.png");
      } else if (type == "video") {
        $(".tool-active img").attr("src", "assets/video.png");
      } else if (type == "shape") {
        $(".tool-active img").attr("src", "assets/shape.png");
      } else if (type == "hand") {
        $(".tool-active img").attr("src", "assets/hand.png");
      }
      $(".tool-active").removeClass("tool-active");
    }
    $("#cursor").find("img").attr("src", "assets/cursor-active.png");
    $("#cursor").addClass("tool-active");
    tool = "cursor";
  }

  // Create an image
  function newImage(image, src) {
    var newimage = new fabric.Image(image,{
      left: 0,
      top: 0,
      originX: "center",
      originY: "center",
      source: src,
      typeThing: "image",
      lockUniScaling: true,
      objectCaching: true,
      absolutePositioned: true,
      id: ids
    });
    canvas.add(newimage);
    newimage.scaleToWidth(300);
    canvas.setActiveObject(newimage);
    canvas.bringToFront(newimage);
    canvas.renderAll();
    centerObject(newimage, canvas);
    resetTool();
    newLayer(newimage);
    updateRecordCanvas();
  }

  // Create a textbox
  function newTextbox(x, y) {
    var newtext = new fabric.Textbox("", {
      left: x,
      top: y,
      originX: "center",
      originY: "center",
      fontFamily: 'Inter',
      fill: "#000",
      textAlign: "center",
      cursorWidth: 1,
      stroke: "#000",
      strokeWidth: 0,
      cursorDuration: 1,
      paintFirst: "stroke",
      typeThing: "none",
      objectCaching: true,
      strokeUniform: true,
      inGroup: false,
      cursorDelay: 250,
      id: ids,
      strokeDashArray: false,
      absolutePositioned: true,
      shadow: {
          color: "#000",
          offsetX: 0,
          offsetY: 0,
          blur: 0,
          opacity: 0
      }
    });
    newtext.setControlsVisibility({
        mt: false,
        mb: false
    })
    canvas.add(newtext);
    canvas.setActiveObject(newtext);
    canvas.bringToFront(newtext);
    newtext.enterEditing();
    newtext.selectAll();
    canvas.renderAll();
    resetTool();
    newLayer(newtext);
    updateRecordCanvas();
  }

  // Automatically increase textbox width (do not break words)
  canvas.on(("text:changed"),function()  {
      var linewidth = canvas.getActiveObject().__lineWidths[canvas.getActiveObject().__lineWidths.length-1];
      if (!isNaN(linewidth) && linewidth+40 > canvas.getActiveObject().width) {
          canvas.getActiveObject().set("width",(linewidth+40));
          canvas.renderAll();
      }
  })

  function centerObject(object, canvas) {
    if (canvas == canvasrecord) {
      object.set({top:(canvasrecord.getWidth())/2, left:(canvasrecord.getHeight())/2});
    } else {
      object.set("top", artboard.get("top")+(artboard.get("height")/2));
      object.set("left", artboard.get("left")+(artboard.get("width")/2));
    }
    //canvas.renderAll();
  }

  // Switch to a different mockup
  function switchMockup(e) {
    if ($(this).find(".mockup-name").children(".pro-label").length > 0 && !premiumuser) {
      e.preventDefault();
      e.stopPropagation();
      showUpgradePopup();
    } else {
      currentmockup = $(this).attr("data-value");
      newMockup(source, currenttype, actual, canvas);
    }
  }

  // Update the upload box with a preview + button to crop
  function updateScreenInput(src, type) {
    $("#upload-icon").remove();
    $("#crop").remove();
    if (type == "image") {
      $("#upload").html('<img id="upload-thumb"src="'+src+'"><div id="dragndrop">Drag and drop to replace</div><div id="extra">Add a video or an image</div>');
    } else if (type == "video") {
      $("#upload").html('<video id="upload-thumb" autoplay muted loop><source src="'+src+'"></video><div id="dragndrop">Drag and drop to replace</div><div id="extra">Add a video or an image</div>');
    }
    $("#screen-section").append("<div id='crop'><img src='assets/crop.png'><span>Adjust screen cropping</span></div>");
  }

  // Crop the screen in the mockup
  function crop() {
    if (!rearranging) {
      $("#crop span").html("Stop adjusting screen");
      $("#crop img").attr("src", "assets/crop.png");
      $("#crop").css({background:"#1D1E37", color:"#A0A5D0"});
      $("#crop img").attr("src", "assets/crop-active.png");
      $("#crop").css({background:"#4AA0EA", color:"#FFF"});
      rearranging = true;
      canvas.setActiveObject(canvas.getItemById("mockup"));
      var activeObject = canvas.getActiveObject();
      var items = activeObject._objects;
      activeObject._restoreObjectsState();
      canvas.remove(activeObject);
      for(var i = 0; i < items.length; i++) {
        canvas.add(items[i]);
        canvas.item(canvas.size()-1).hasControls = true;
      }
      canvas.renderAll();
      canvas.setActiveObject(canvas.getItemById("screen"));
      canvas.bringToFront(canvas.getItemById("screen"));
      canvas.renderAll();
    } else {
      $("#crop span").html("Adjust screen cropping");
      $("#crop img").attr("src", "assets/crop.png");
      $("#crop").css({background:"#1D1E37", color:"#A0A5D0"});
      reGroup();
    }
  }

  // Regroup the mockup
  function reGroup() {
    canvas.discardActiveObject();
    canvas.renderAll();
    rearranging = false;
    var temp1 = canvas.getItemById("mockup_img");
    var temp2 = canvas.getItemById("screen");
    var temp3 = canvas.getItemById("clip");
    canvas.remove(canvas.getItemById("mockup_img"));
    canvas.remove(canvas.getItemById("screen"));
    canvas.remove(canvas.getItemById("clip"));
    canvas.renderAll();
    group = new fabric.Group([temp1, temp2, temp3],{
      id: "mockup",
      typeThing: "group",
      selectable: true,
      lockUniScaling: true
    });
    group.setControlsVisibility({
        mt: false,
        mb: false,
        ml: false,
        mr: false
    })
    canvas.add(group);
    canvas.renderAll();
  }

  // Update the mockup
  function newMockup(src, type, actual2, canvas) {
    if (canvas != canvasrecord) {
      actual = actual2;
      objects = $.grep(objects, function(e){
           return e.id != "mockup" && e.id != "mockup_img" && e.id != "screen" && e.id != "clip";
      });
      source = src;
      currenttype = type;
    }
    if (group != false) {
      canvas.remove(canvas.getItemById("clip"));
      canvas.remove(canvas.getItemById("screen"));
      canvas.remove(canvas.getItemById("mockup_img"));
      canvas.remove(canvas.getItemById("mockup"));
      canvas.renderAll();
    }
    var mockup = mockups.find(x => x.name == currentmockup);
    fabric.Image.fromURL(mockup.src, function(img) {
      oImg = img.set({
        left: 0,
        top: 0,
        originX: "center",
        originY: "center",
        id: "mockup_img",
        typeThing: "image",
        source: mockup.src,
        objectCaching: false,
        absolutePositioned: true,
        selectable: false
      }).scale(0.1);
      centerObject(oImg, canvas);
      canvas.renderAll();
      if (canvas != canvasrecord) {
        newLayer(oImg);
      }
      var width = mockup.width;
      var height = mockup.height;
      clip = new fabric.Rect({
        width: width,
        height: height,
        originX: "center",
        originY: "center",
        id: "clip",
        typeThing: "none",
        absolutePositioned: true,
        fill: "rgba(0,0,0,0)",
        selectable: false
      }).scale(0.1);
      centerObject(clip, canvas);
      canvas.renderAll();
      if (canvas != canvasrecord) {
        newLayer(clip);
      }
      scr = new fabric.Image(src,{
        left: 0,
        top: 0,
        originX: "center",
        originY: "center",
        objectCaching: false,
        source: actual2,
        id: "screen",
        fill: "#000",
        typeThing: type,
        absolutePositioned: true,
        clipPath: clip
      });
      if (type == "video") {
        scr.getElement().play();
        scr.getElement().loop = true;
      }
      screen_area = scr;
      if (scr.get("width")*scr.get("scaleX") > scr.get("height")*scr.get("scaleY")) {
        scr.scaleToHeight(clip.get("height")*clip.get("scaleY"));
      } else {
        scr.scaleToWidth(clip.get("width")*clip.get("scaleX"));
      }
      canvas.bringToFront(scr);
      centerObject(scr, canvas);
      canvas.renderAll();
      if (canvas != canvasrecord) {
        newLayer(scr);
      }
      group = new fabric.Group([oImg, scr, clip],{
        id: "mockup",
        originX: "center",
        originY: "center",
        typeThing: "group",
        uniformScaling: true,
        lockUniScaling: true
      });
      canvas.add(group);
      canvas.renderAll();
      group.setControlsVisibility({
          mt: false,
          mb: false,
          ml: false,
          mr: false
      })
      if (canvas != canvasrecord) {
        centerObject(group, canvas);
        canvas.renderAll();
        newLayer(group);
      } else {
        group.set({left:objects.find(x => x.id == "mockup").x, top:objects.find(x => x.id == "mockup").y,scaleX:objects.find(x => x.id == "mockup").scaleX, scaleY:objects.find(x => x.id == "mockup").scaleY});
        canvas.renderAll();
        canvas.bringToFront(canvas.getItemById("watermark"));
        canvas.renderAll();
      }
      if (canvas != canvasrecord) {
        updateRecordCanvas();
      }
    });
  }

  // Replace the source of an object when reloading the canvas (since Fabric needs a DOM reference for the objects)
  function replaceSource(object, canvas) {
    if (object.get("typeThing") == "video") {
      var vidObj = document.createElement("video");
      var vidSrc = document.createElement("source");
      vidSrc.src = object.get("source");
      vidObj.appendChild(vidSrc);
      vidObj.addEventListener("loadeddata", function(){
        vidObj.width = this.videoWidth;
        vidObj.height = this.videoHeight;
        vidObj.currentTime = 0;
        vidObj.muted = true;
        vidObj.autoplay = true;
        vidObj.loop = true;
        function waitLoad() {
          if (vidObj.readyState >= 3) {
            newMockup(vidObj, "video", object.get("source"), canvasrecord);
          } else {
            window.setTimeout(function(){
                waitLoad()
            },100)
          }
        }
        window.setTimeout(function(){
          waitLoad()
        },100)
      });
      vidObj.currentTime = 0;
    } else if (object.get("typeThing") == "image") {
      var img = new Image();
      img.onload = function(){
          object.setElement(img);
          canvas.renderAll();
          if (object.get("id") == "screen") {
            canvasrecord.remove("mockup");
            newMockup(img, "image", object.get("source"), canvasrecord);
          }
      }
      img.src = object.get("source");
    }
  }

  // Keep record canvas up to date
  function updateRecordCanvas() {
      canvasrecord.setWidth(10000);
      canvasrecord.setHeight(10000);
      canvasrecord.width = 10000;
      canvasrecord.height = 10000;
      canvas.clipPath = null;
      canvas.getItemById("screen").clipPath = null;
      var templeft = artboard.left;
      var temptop = artboard.top;
      const canvassave = canvas.toJSON(["top", "left", "width", "height", "scaleX", "scaleY", "flipX", "flipY", "originX", "originY", "transformMatrix", "stroke", "strokeWidth", "strokeDashArray", "strokeLineCap", "strokeDashOffset", "strokeLineJoin", "strokeMiterLimit", "angle", "opacity", "fill", "globalCompositeOperation", "shadow", "clipTo", "visible", "backgroundColor", "skewX", "skewY", "fillRule", "paintFirst", "clipPath", "strokeUniform", "rx", "ry", 'selectable', 'hasControls', 'subTargetCheck', 'id', 'hoverCursor', 'defaultCursor', 'isEditing', 'source', 'assetType', 'duration', 'inGroup', 'typeThing']);
      canvas.clipPath = artboard;
      canvas.getItemById("screen").clipPath = canvas.getItemById("clip");
      canvasrecord.loadFromJSON(canvassave, function(){
          if (canvasrecord.getItemById("center_h")) {
              canvasrecord.remove(canvasrecord.getItemById("center_h"));
              canvasrecord.remove(canvasrecord.getItemById("center_v"));
          }
          if (canvasrecord.getItemById("line_h")) {
              canvasrecord.remove(canvasrecord.getItemById("line_h"));
              canvasrecord.remove(canvasrecord.getItemById("line_v"));
          }
          canvasrecord.getItemById("screen").clipPath = canvasrecord.getItemById("clip");
          canvasrecord.getItemById("artboard").set({left:-1, top:-1, width:artboard.width+1, height:artboard.height+1});
          canvasrecord.renderAll();
          canvasrecord.setWidth(artboard.width);
          canvasrecord.setHeight(artboard.height);
          canvasrecord.width = artboard.width;
          canvasrecord.height = artboard.height;
          canvasrecord.renderAll();
          objects.forEach(function(object) {
            replaceSource(canvasrecord.getItemById(object.id), canvasrecord);
            if (object.id == "mockup_img" || object.id == "clip" || object.id == "screen" || object.id == "mockup") {
              return;
            }
            canvasrecord.getItemById(object.id).set({left:object.x, top:object.y, visible:true, dirty:true});
            if (!canvasrecord.getItemById(object.id).isOnScreen()) {
              canvasrecord.getItemById(object.id).setCoords();
              canvasrecord.renderAll();
            }
            canvasrecord.renderAll();
          });
          fabric.Image.fromURL("assets/watermark.png", function(img) {
            var watermark = img.set({
              left: 5,
              top: canvasrecord.getHeight()-45,
              id: "watermark",
              typeThing: "temp",
              objectCaching: false,
              absolutePositioned: true,
              selectable: false
            });
            canvasrecord.add(watermark);
            if ($("#watermark input").is(":checked")) {
              canvasrecord.getItemById("watermark").set({opacity: 0});
              canvasrecord.renderAll();
            }
          });
      });
  }

  // Download recording
  function downloadRecording(chunks) {
    var exporttype = $(".select-6 .current").html();
    $("#download-button span").html("Downloading...");
    if (exporttype == "WEBM video") {
      ysFixWebmDuration(new Blob(chunks,{type: "video/webm"}), duration, {logger: false}).then(function(blob){
        var url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;;
        a.download = "animockup.webm";
        document.body.appendChild(a);
        a.click();
        $("#download-button").removeClass("downloading");
        $("#download-button span").html("Download");
      });
    } else if (exporttype == "MP4 video") {
      $("#download-button span").html("Downloading...");
      convertStreams(new Blob(chunks,{type: "video/webm"}), "mp4");
    } else if (exporttype == "Animated GIF") {
      $("#download-button span").html("Downloading...");
      convertStreams(new Blob(chunks,{type: "video/webm"}), "gif");
    }
  }

  // Record canvas
  function record() {
    if (!recording) {
      $("#download-button").addClass("downloading");
      $("#download-button span").html("Rendering...");
      var fpstype = $(".select-10 .current").html();
      var fps = 30;
      if (fpstype == "24 FPS") {
        fps = 24;
      } else if (fpstype == "30 FPS") {
        fps = 30;
      } else if (fpstype == "60 FPS" && premiumuser) {
        fps = 60;
      }
      var bitrate = $(".select-9 .current").html();
      if (bitrate == "360p") {
        bitrate = 1000000;
      } else if (bitrate == "480p") {
        bitrate = 2500000;
      } else if (bitrate == "720p") {
        bitrate = 5000000;
      } else if (bitrate == "1080p" && premiumuser) {
        bitrate = 8000000;
      }
      recording = true;
      var multiplier = 1;
      var aCtx = new AudioContext();
      function audioTimerLoop(callback, frequency) {
        var freq = frequency / 1000;
        var silence = aCtx.createGain();
        silence.gain.value = 0;
        silence.connect(aCtx.destination);
        onOSCend();
        var stopped = false;
        function onOSCend() {
          osc = aCtx.createOscillator();
          osc.onended = onOSCend;
          osc.connect(silence);
          osc.start(0);
          osc.stop(aCtx.currentTime + freq);
          callback(aCtx.currentTime);
          if (stopped) {
            osc.onended = function() {
                return;
            };
          }
        };
        return function() {
        stopped = true;
        };
      }
      var stopAnim = audioTimerLoop(renderAnim, 1000/(fps));
      var stream = document.getElementById("canvasrecord").captureStream(fps*multiplier);
      let chunks = [];
      var recorder = new MediaRecorder(stream, {
        videoBitsPerSecond: bitrate,
        mimeType: "video/webm",
        audioBitsPerSecond: 0
      });
      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = e => {
        downloadRecording(chunks)
      }
      clearAnimation();
      var temp = {
        value: 0
      }
      var video_instance = anime({
        targets: temp,
        duration: parseFloat($("#video-duration-3").val())*1000,
        delay: parseFloat($("#video-duration").val())*1000,
        easing: "linear",
        autoplay: true,
        update: function() {
          canvasrecord.renderAll();
        }
      });
      window.setTimeout(function(){
        recorder.start();
      }, 100)

      setTimeout(function() {
        recording = false;
        recorder.stop();
        clearAnimation();
        updateRecordCanvas();
        window.setTimeout(function(){
          animate(canvasrecord, true, canvasrecord.getItemById("artboard"));
        }, 100);
      }, duration/multiplier);

      function renderAnim(time) {
        animateManual(time*1000, false, canvasrecord.getItemById("artboard"));
        canvasrecord.renderAll();
      }
    }
  }

  // Animation stuff
  function toggleAnimation() {
    animate(canvas, false, artboard);
  }

  function clearAnimation() {
    if (typeof instance !== "undefined") {
      instance.pause();
      instance2.pause();
      if (typeof instance3 !== "undefined") {
        instance3.pause();
      }
      if (typeof instance4 !== "undefined") {
        instance4.pause();
      }
    }
  }

  function animateManual(time, loop, artboard) {
    duration = parseFloat($("#video-duration-3").val())*1000;
    if (rearranging) {
      reGroup();
    }
    // Initiate the animation (in)
    var type = $(".select-3 .current").html();
    var easing1 = $(".select-4 .current").html();
    if (easing1 == "Linear") {
      easing1 = "linear";
    } else if (easing1 == "Ease-in") {
      easing1 = "easeInCubic";
    } else if (easing1 == "Ease-out") {
      easing1 = "easeOutCubic";
    } else if (easing1 == "Ease-in-out") {
      easing1 = "easeInOutCubic";
    } else if (easing1 == "Ease-in-bounce") {
      easing1 = "easeInBounce";
    } else if (easing1 == "Ease-out-bounce") {
      easing1 = "easeOutBounce";
    } else if (easing1 == "Ease-in-out-bounce") {
      easing1 = "easeInOutBounce";
    }
    var animation;
    var endvalue;
    var scaleX = 0;
    var scaleY = 0;
    if (type == "Fade in left") {
      animation = {
        value: artboard.left - (canvas.getItemById("mockup").width * canvas.getItemById("mockup").scaleX)
      }
      endvalue = objects.find(x => x.id == "mockup").x+artboard.left;
    } else if (type == "Fade in top") {
      animation = {
        value: artboard.top - (canvas.getItemById("mockup").height * canvas.getItemById("mockup").scaleY)
      }
      endvalue = objects.find(x => x.id == "mockup").y+artboard.top;
    } else if (type == "Fade in right") {
      animation = {
        value: artboard.left + (artboard.width*artboard.scaleX) + (canvas.getItemById("mockup").width * canvas.getItemById("mockup").scaleX)
      }
      endvalue = objects.find(x => x.id == "mockup").x+artboard.left;
    } else if (type == "Fade in bottom") {
      animation = {
        value: artboard.top + (artboard.height*artboard.scaleY) + (canvas.getItemById("mockup").height * canvas.getItemById("mockup").scaleY)
      }
      endvalue = objects.find(x => x.id == "mockup").y+artboard.top;
    } else if (type == "Scale") {
      animation = {
        value: 0,
        scaleX: 0,
        scaleY: 0
      }
      endvalue = 0;
      scaleX = canvas.getItemById("mockup").scaleX;
      scaleY = canvas.getItemById("mockup").scaleY;
    }
    var instancenum1 = anime({
      targets: animation,
      value: endvalue,
      scaleX: scaleX,
      scaleY: scaleY,
      duration: parseFloat($("#video-duration").val())*1000,
      easing: easing1,
      autoplay: false
    });
    if (time <= parseFloat($("#video-duration").val())*1000) {
      instancenum1.seek(time);
      if (type == "Fade in left" || type == "Fade in right") {
        canvasrecord.getItemById("mockup").set({left:animation.value});
      } else if (type == "Fade in top" || type == "Fade in bottom") {
        canvasrecord.getItemById("mockup").set({top:animation.value});
      } else if (type == "Scale") {
        canvasrecord.getItemById("mockup").set({scaleX:animation.scaleX, scaleY:animation.scaleY});
      }
      canvasrecord.renderAll();
    }

    // Check if fade in is necessary
    if (type != "None") {
      var tempduration2 = 2000;
      if (type == "Fade in") {
        tempduration2 = parseFloat($("#video-duration").val())*1000;
      }
      var animation4 = {
        value: 0
      }
      var instancenum4 = anime({
        targets: animation4,
        value: 1,
        duration: tempduration2,
        easing: "easeInOutCubic",
        autoplay: false
      });
      if (time <= tempduration2) {
        instancenum4.seek(time);
        canvasrecord.getItemById("mockup").set({opacity:animation4.value});
        canvasrecord.renderAll();
      }
    } else {
      canvasrecord.getItemById("mockup").set({opacity:1});
      canvasrecord.renderAll();
    }

    // Initiate the animation (out)
    var type2 = $(".select-5 .current").html();
    var easing2 = $(".select-4 .current").html();
    if (easing2 == "Linear") {
      easing2 = "linear";
    } else if (easing2 == "Ease-in") {
      easing2 = "easeInCubic";
    } else if (easing2 == "Ease-out") {
      easing2 = "easeOutCubic";
    } else if (easing2 == "Ease-in-out") {
      easing2 = "easeInOutCubic";
    } else if (easing2 == "Ease-in-bounce") {
      easing2 = "easeInBounce";
    } else if (easing2 == "Ease-out-bounce") {
      easing2 = "easeOutBounce";
    } else if (easing2 == "Ease-in-out-bounce") {
      easing2 = "easeInOutBounce";
    }
    var animation2;
    var endvalue2;
    var scaleX2= 0;
    var scaleY2 = 0;
    if (type2 == "Fade out left") {
      animation2 = {
        value: objects.find(x => x.id == "mockup").x+artboard.left
      }
      endvalue2 = artboard.left - (canvas.getItemById("mockup").width * canvas.getItemById("mockup").scaleX);
    } else if (type2 == "Fade out top") {
      animation2 = {
        value: objects.find(x => x.id == "mockup").y+artboard.top
      }
      endvalue2 = artboard.top - (canvas.getItemById("mockup").height * canvas.getItemById("mockup").scaleY);
    } else if (type2 == "Fade out right") {
      animation2 = {
        value: objects.find(x => x.id == "mockup").x+artboard.left
      }
      endvalue2 = artboard.left + (artboard.width*artboard.scaleX) + (canvas.getItemById("mockup").width * canvas.getItemById("mockup").scaleX);
    } else if (type2 == "Fade out bottom") {
      animation2 = {
        value: objects.find(x => x.id == "mockup").y+artboard.top
      }
      endvalue2 = artboard.top + (artboard.height*artboard.scaleY) + (canvas.getItemById("mockup").height * canvas.getItemById("mockup").scaleY);
    } else if (type2 == "Scale") {
      animation2 = {
        value: 0,
        scaleX: canvas.getItemById("mockup").scaleX,
        scaleY: canvas.getItemById("mockup").scaleY
      }
      endvalue2 = 0;
      scaleX2 = 0;
      scaleY2 = 0;
    }
    var start = false;
    var instancenum2 = anime({
      targets: animation2,
      value: endvalue2,
      scaleX: scaleX2,
      scaleY: scaleY2,
      duration: parseFloat($("#video-duration-2").val())*1000,
      easing: easing2,
      autoplay: false
    });
    if (time > duration-(parseFloat($("#video-duration-2").val())*1000)) {
      instancenum2.seek(time-(duration-(parseFloat($("#video-duration-2").val())*1000)));
      if (type2 == "Fade out left" || type2 == "Fade out right") {
        canvasrecord.getItemById("mockup").set({left:animation2.value});
      } else if (type2 == "Fade out top" || type2 == "Fade out bottom") {
        canvasrecord.getItemById("mockup").set({top:animation2.value});
      } else if (type2 == "Scale") {
        canvasrecord.getItemById("mockup").set({scaleX:animation2.scaleX, scaleY:animation2.scaleY});
      }
      canvasrecord.renderAll();
    }

    // Check if fade in is necessary
    if (type2 != "None") {
      var tempduration = 2000;
      if (type2 == "Fade out") {
        tempduration = parseFloat($("#video-duration-2").val())*1000;
      }
      var start2 = false;
      var animation3 = {
        value: 1
      }
      var instancenum3 = anime({
        targets: animation3,
        value: 0,
        duration: tempduration,
        easing: "easeInOutCubic",
        autoplay: false
      });
      if (time > duration-2000) {
        instancenum3.seek(time-(duration-2000));
        canvasrecord.getItemById("mockup").set({opacity:animation3.value});
        canvasrecord.renderAll();
      }
    } else {
      canvasrecord.getItemById("mockup").set({opacity:1});
      canvasrecord.renderAll();
    }
  }

  function animate(canvas, loop, artboard) {
    if (loop && recording) {
      return;
    }
    if (canvas.getItemById("screen").get("getType") == "video") {
      $(canvas.getItemById("screen").getElement())[0].loop = false;
      $(canvas.getItemById("screen").getElement())[0].currentTime = 0;
      $(canvas.getItemById("screen").getElement())[0].paused = false;
      $(canvas.getItemById("screen").getElement())[0].play();
    }
    var temp = {
      value: 0
    }
    duration = parseFloat($("#video-duration-3").val())*1000;
    var video_instance = anime({
      targets: temp,
      duration: duration,
      delay: parseFloat($("#video-duration").val())*1000,
      easing: "linear",
      autoplay: true,
      update: function() {
        canvas.renderAll();
      }
    });
    if (recording) {
      clearAnimation();
      loop = false;
    }
    if (!downloadpopup) {
      loop = false;
      $("#play span").html("Playing...");
      $("#play").css({opacity:.6,pointerEvents:"none"});
    }
    if (rearranging) {
      reGroup();
    }
    // Initiate the animation (in)
    var type = $(".select-3 .current").html();
    var easing1 = $(".select-4 .current").html();
    if (easing1 == "Linear") {
      easing1 = "linear";
    } else if (easing1 == "Ease-in") {
      easing1 = "easeInCubic";
    } else if (easing1 == "Ease-out") {
      easing1 = "easeOutCubic";
    } else if (easing1 == "Ease-in-out") {
      easing1 = "easeInOutCubic";
    } else if (easing1 == "Ease-in-bounce") {
      easing1 = "easeInBounce";
    } else if (easing1 == "Ease-out-bounce") {
      easing1 = "easeOutBounce";
    } else if (easing1 == "Ease-in-out-bounce") {
      easing1 = "easeInOutBounce";
    }
    var animation;
    var endvalue;
    var scaleX = 0;
    var scaleY = 0;
    if (type == "Fade in left") {
      animation = {
        value: artboard.left - (canvas.getItemById("mockup").width * canvas.getItemById("mockup").scaleX)
      }
      endvalue = objects.find(x => x.id == "mockup").x+artboard.left;
    } else if (type == "Fade in top") {
      animation = {
        value: artboard.top - (canvas.getItemById("mockup").height * canvas.getItemById("mockup").scaleY)
      }
      endvalue = objects.find(x => x.id == "mockup").y+artboard.top;
    } else if (type == "Fade in right") {
      animation = {
        value: artboard.left + (artboard.width*artboard.scaleX) + (canvas.getItemById("mockup").width * canvas.getItemById("mockup").scaleX)
      }
      endvalue = objects.find(x => x.id == "mockup").x+artboard.left;
    } else if (type == "Fade in bottom") {
      animation = {
        value: artboard.top + (artboard.height*artboard.scaleY) + (canvas.getItemById("mockup").height * canvas.getItemById("mockup").scaleY)
      }
      endvalue = objects.find(x => x.id == "mockup").y+artboard.top;
    } else if (type == "Scale") {
      animation = {
        value: 0,
        scaleX: 0,
        scaleY: 0
      }
      endvalue = 0;
      scaleX = canvas.getItemById("mockup").scaleX;
      scaleY = canvas.getItemById("mockup").scaleY;
    }
    instance = anime({
      targets: animation,
      value: endvalue,
      scaleX: scaleX,
      scaleY: scaleY,
      duration: parseFloat($("#video-duration").val())*1000,
      easing: easing1,
      autoplay: true,
      update: function() {
        if (type == "Fade in left" || type == "Fade in right") {
          canvas.getItemById("mockup").set({left:animation.value});
        } else if (type == "Fade in top" || type == "Fade in bottom") {
          canvas.getItemById("mockup").set({top:animation.value});
        } else if (type == "Scale") {
          canvas.getItemById("mockup").set({scaleX:animation.scaleX, scaleY:animation.scaleY});
        }
        canvas.renderAll();
      }
    });

    // Check if fade in is necessary
    if (type != "None") {
      var tempduration2 = 2000;
      if (type == "Fade in") {
        tempduration2 = parseFloat($("#video-duration").val())*1000;
      }
      var animation4 = {
        value: 0
      }
      instance4 = anime({
        targets: animation4,
        value: 1,
        duration: tempduration2,
        easing: "easeInOutCubic",
        autoplay: true,
        update: function() {
          canvas.getItemById("mockup").set({opacity:animation4.value});
          canvas.renderAll();
        }
      });
    } else {
      canvas.getItemById("mockup").set({opacity:1});
      canvas.renderAll();
    }

    // Initiate the animation (out)
    var type2 = $(".select-5 .current").html();
    var easing2 = $(".select-4 .current").html();
    if (easing2 == "Linear") {
      easing2 = "linear";
    } else if (easing2 == "Ease-in") {
      easing2 = "easeInCubic";
    } else if (easing2 == "Ease-out") {
      easing2 = "easeOutCubic";
    } else if (easing2 == "Ease-in-out") {
      easing2 = "easeInOutCubic";
    } else if (easing2 == "Ease-in-bounce") {
      easing2 = "easeInBounce";
    } else if (easing2 == "Ease-out-bounce") {
      easing2 = "easeOutBounce";
    } else if (easing2 == "Ease-in-out-bounce") {
      easing2 = "easeInOutBounce";
    }
    var animation2;
    var endvalue2;
    var scaleX2= 0;
    var scaleY2 = 0;
    if (type2 == "Fade out left") {
      animation2 = {
        value: objects.find(x => x.id == "mockup").x+artboard.left
      }
      endvalue2 = artboard.left - (canvas.getItemById("mockup").width * canvas.getItemById("mockup").scaleX);
    } else if (type2 == "Fade out top") {
      animation2 = {
        value: objects.find(x => x.id == "mockup").y+artboard.top
      }
      endvalue2 = artboard.top - (canvas.getItemById("mockup").height * canvas.getItemById("mockup").scaleY);
    } else if (type2 == "Fade out right") {
      animation2 = {
        value: objects.find(x => x.id == "mockup").x+artboard.left
      }
      endvalue2 = artboard.left + (artboard.width*artboard.scaleX) + (canvas.getItemById("mockup").width * canvas.getItemById("mockup").scaleX);
    } else if (type2 == "Fade out bottom") {
      animation2 = {
        value: objects.find(x => x.id == "mockup").y+artboard.top
      }
      endvalue2 = artboard.top + (artboard.height*artboard.scaleY) + (canvas.getItemById("mockup").height * canvas.getItemById("mockup").scaleY);
    } else if (type2 == "Scale") {
      animation2 = {
        value: 0,
        scaleX: canvas.getItemById("mockup").scaleX,
        scaleY: canvas.getItemById("mockup").scaleY
      }
      endvalue2 = 0;
      scaleX2 = 0;
      scaleY2 = 0;
    }
    var start = false;
    instance2 = anime({
      targets: animation2,
      value: endvalue2,
      scaleX: scaleX2,
      scaleY: scaleY2,
      delay: duration-(parseFloat($("#video-duration-2").val())*1000),
      duration: parseFloat($("#video-duration-2").val())*1000,
      easing: easing2,
      autoplay: true,
      update: function() {
        if (start) {
          if (type2 == "Fade out left" || type2 == "Fade out right") {
            canvas.getItemById("mockup").set({left:animation2.value});
          } else if (type2 == "Fade out top" || type2 == "Fade out bottom") {
            canvas.getItemById("mockup").set({top:animation2.value});
          } else if (type2 == "Scale") {
            canvas.getItemById("mockup").set({scaleX:animation2.scaleX, scaleY:animation2.scaleY});
          }
          canvas.renderAll();
        }
      },
      changeBegin: function() {
        start = true;
      }
    });

    // Check if fade in is necessary
    if (type2 != "None") {
      var tempduration = 2000;
      if (type2 == "Fade out") {
        tempduration = parseFloat($("#video-duration-2").val())*1000;
      }
      var start2 = false;
      var animation3 = {
        value: 1
      }
      instance3 = anime({
        targets: animation3,
        value: 0,
        duration: tempduration,
        delay: duration-2000,
        easing: "easeInOutCubic",
        autoplay: true,
        update: function() {
          if (start2) {
            canvas.getItemById("mockup").set({opacity:animation3.value});
            canvas.renderAll();
          }
        },
        changeBegin: function() {
          start2 = true;
        }
      });
    } else {
      canvas.getItemById("mockup").set({opacity:1});
      canvas.renderAll();
    }

    window.setTimeout(function(){
      $(canvas.getItemById("screen").getElement())[0].loop = true;
      if (loop && downloadpopup && !recording) {
        animate(canvas, loop, artboard);
      } else if (!recording) {
        $("#play span").html("Play")
        $("#play").css({opacity:1,pointerEvents:"auto"});
        canvas.getItemById("mockup").set({left:objects.find(x=>x.id=="mockup").x+artboard.left,top:objects.find(x=>x.id=="mockup").y+artboard.top, opacity:1, scaleX:objects.find(x => x.id == "mockup").scaleX, scaleY:objects.find(x => x.id == "mockup").scaleY});
        canvas.renderAll();
      }
    }, duration);
  }
  const fps = 25;
  fabric.util.requestAnimFrame(function render() {
     canvas.renderAll();
      setTimeout(() => {
        fabric.util.requestAnimFrame(render);
      }, 1000 / fps);
  });

  // Create a new layer, keeping track of position for window resize
  function newLayer(object) {
    objects.push({id:object.get("id"), x:object.get("left")-artboard.get("left"), y:object.get("top")-artboard.get("top"), scaleX:object.get("scaleX"), scaleY:object.get("scaleY")});
    ids++;
  }

  // Triggers for input type file
  function uploadTrigger() {
    $("#upload-screen").click();
  }
  function uploadImageTrigger() {
    $("#upload-image").click();
  }

  // Load video for the mockup screen
  function loadVideo(src, preview) {
      var vidObj = document.createElement("video");
      var vidSrc = document.createElement("source");
      vidSrc.src = src;
      vidObj.appendChild(vidSrc);
      vidObj.addEventListener("loadeddata", function(){
          vidObj.width = this.videoWidth;
          vidObj.height = this.videoHeight;
          vidObj.currentTime = 0;
          vidObj.muted = true;
          vidObj.autoplay = true;
          vidObj.loop = true;
          duration = vidObj.duration*1000;
          $("#video-duration-3").val(vidObj.duration.toFixed(2));
          if (duration < 4) {
            duration = 4000;
          }
          function waitLoad() {
              if (vidObj.readyState >= 3) {
                  newMockup(vidObj, "video", src, canvas);
                  if (preview) {
                    updateScreenInput(src, "video");
                  }
                  return;
              } else {
                  window.setTimeout(function(){
                      waitLoad()
                  },100)
              }
          }
          window.setTimeout(function(){
              waitLoad()
          },100)
      });
      vidObj.currentTime = 0;
  }

  loadVideo("assets/example.mp4", false);

  // Load image for the mockup screen
  function loadImage(src) {
    var image = new Image();
    image.onload = function(img) {
      duration = 4000;
      newMockup(image, "image", src, canvas);
      updateScreenInput(src, "image");
    }
    image.src = src;
  }

  // Upload an image to the canvas
  function uploadImageCanvas(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(file) {
      var image = new Image();
      image.onload = function(img) {
        newImage(image, file.target.result);
      }
      image.src = file.target.result;
    }
    reader.readAsDataURL(file);
  }

  // Check uploaded media
  function upload(e) {
    var wip = this.files[0]
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function(file) {
      if (wip["type"] == "image/png" || wip["type"] == "image/jpg" || wip["type"] == "image/jpeg" || wip["type"] == "image/gif") {
        loadImage(file.target.result);
      } else if (wip["type"] == "video/mp4" || wip["type"] == "video/webm") {
        loadVideo(file.target.result, true);
      }
    }
    reader.readAsDataURL(file);
  }

  // Switch artboard background
  function switchBackgroundFill() {
    $(".color-active").removeClass("color-active");
    $(this).addClass("color-active");
    artboard.set('fill', eval($(this).attr("id")));
    canvas.renderAll();
    updateRecordCanvas();
  }

  // Change font
  function changeFont() {
    WebFont.load({
      google: {
          families: [$("#font-picker").val()]
      },
      active: () => {
          canvas.getActiveObject().set("fontFamily", $("#font-picker").val());
          canvas.renderAll();
      }
    });
  }

  // Change text format
  function changeTextFormat() {
    canvas.getActiveObject().enterEditing();
    canvas.getActiveObject().selectAll();
    if ($(this).hasClass("format-text-active")) {
      if ($(this).attr("id") == "bold") {
          $(this).find("img").attr("src", "assets/text-bold.svg");
          canvas.getActiveObject().setSelectionStyles({fontWeight: "normal"});
      } else if ($(this).attr("id") == "italic") {
          $(this).find("img").attr("src", "assets/text-italic.svg");
          canvas.getActiveObject().setSelectionStyles({fontStyle: "normal"});
      } else if ($(this).attr("id") == "underline") {
          $(this).find("img").attr("src", "assets/text-underline.svg");
          canvas.getActiveObject().setSelectionStyles({underline: false});
      } else {
          $(this).find("img").attr("src", "assets/text-strikethrough.svg");
          canvas.getActiveObject().setSelectionStyles({linethrough: false});
      }
      $(this).removeClass("format-text-active");
    } else {
      $(this).addClass("format-text-active");
      if ($(this).attr("id") == "bold") {
          $(this).find("img").attr("src", "assets/text-bold-active.svg");
          canvas.getActiveObject().setSelectionStyles({fontWeight: "bold"});
      } else if ($(this).attr("id") == "italic") {
          $(this).find("img").attr("src", "assets/text-italic-active.svg");
          canvas.getActiveObject().setSelectionStyles({fontStyle: "italic"});
      } else if ($(this).attr("id") == "underline") {
          $(this).find("img").attr("src", "assets/text-underline-active.svg");
          canvas.getActiveObject().setSelectionStyles({underline: true});
      } else {
          $(this).find("img").attr("src", "assets/text-strike-active.svg");
          canvas.getActiveObject().setSelectionStyles({linethrough: true});
      }
    }
    canvas.getActiveObject().exitEditing();
    canvas.renderAll();
  }

  // Change text alignment
  function alignText() {
      var textalign;
      if ($(".align-text-active").attr("id") == "align-text-left") {
          $(".align-text-active").find("img").attr("src", "assets/align-left.svg");
      } else if ($(".align-text-active").attr("id") == "align-text-center") {
          $(".align-text-active").find("img").attr("src", "assets/align-center.svg");
      } else if ($(".align-text-active").attr("id") == "align-text-right") {
          $(".align-text-active").find("img").attr("src", "assets/align-right.svg");
      } else {
          $(".align-text-active").find("img").attr("src", "assets/justify.svg");
      }
      $(".align-text-active").removeClass("align-text-active");
      $(this).addClass("align-text-active");
      if ($(this).attr("id") == "align-text-left") {
          textalign = "left";
          $(this).find("img").attr("src", "assets/align-left-active.svg");
      } else if ($(this).attr("id") == "align-text-center") {
          textalign = "center";
          $(this).find("img").attr("src", "assets/align-center-active.svg");
      } else if ($(this).attr("id") == "align-text-right") {
          textalign = "right";
          $(this).find("img").attr("src", "assets/align-right-active.svg");
      } else {
          textalign = "justify";
          $(this).find("img").attr("src", "assets/justify-active.svg");
      }
      canvas.getActiveObject().set({textAlign: textalign});
      canvas.renderAll();
  }

  // Check text options on selection
  function checkText() {
    if (canvas.getActiveObject().type == "textbox") {
      var object = canvas.getActiveObject();
      if (object.get("textAlign") == "left") {
          $("#align-text-left").addClass("align-text-active");
          $("#align-text-left img").attr("src", "assets/align-left-active.svg");
      } else if (object.get("textAlign") == "center") {
          $("#align-text-center").addClass("align-text-active");
          $("#align-text-center img").attr("src", "assets/align-center-active.svg");
      } else if (object.get("textAlign") == "right") {
          $("#align-text-right").addClass("align-text-right-active");
          $("#align-text-right img").attr("src", "assets/align-right-active.svg");
      } else {
          $("#align-text-justify").addClass("align-text-justify-active");
          $("#align-text-justify img").attr("src", "assets/align-justify-active.svg");
      }
      if (object.get("fontWeight") == "bold" || object.get("fontWeight") == 700) {
          $("#format-bold").addClass("format-text-active");
          $("#format-bold img").attr("src", "assets/bold-active.svg");
      }
      if (object.get("fontStyle") == "italic") {
          $("#format-italic").addClass("format-text-active");
          $("#format-italic img").attr("src", "assets/italic-active.svg");
      }
      if (object.get("underline") == true) {
          $("#format-underline").addClass("format-text-active");
          $("#format-underline img").attr("src", "assets/underline-active.svg");
      }
      if (object.get("linethrough") == true) {
          $("#format-strike").addClass("format-text-active");
          $("#format-strike img").attr("src", "assets/strikethrough-active.svg");
      }
      $("#color-choose").css({background:canvas.getActiveObject().fill});
      text_color.setColor(canvas.getActiveObject().fill);
      var p = {x: canvas.getActiveObject().left, y: canvas.getActiveObject().top};
      var pos = fabric.util.transformPoint(p, canvas.viewportTransform);
      var x = pos.x-($("#text-options").width()/2)+350;
      var y = pos.y-50-canvas.getActiveObject().height;
      $("#text-options").css({left:x, top:y});
      $("#text-options").addClass("show-text");
      if (y < 300) {
        $(".textpicker").css({top:"53px"});
      } else {
        $(".textpicker").css({top:"-227px"});
      }
    } else {
      $("#text-options").removeClass("show-text");
    }
  }

  // Delete object
  function deleteObject() {
    canvas.remove(canvas.getActiveObject());
    canvas.renderAll();
  }

  // Toggle color picker
  function toggleColorPicker() {
    if (background_color.isOpen()) {
      background_color.hide();
    } else {
      background_color.show();
    }
    $(".color-active").removeClass("color-active");
    $(this).addClass("color-active");
    artboard.set("fill", background_color.getColor().toRGBA().toString());
    canvas.renderAll();
  }

  // Toggle color picker
  function toggleTextPicker() {
    if (text_color.isOpen()) {
      text_color.hide();
    } else {
      text_color.show();
    }
  }

  // Go up a layer
  function upLayer() {
    canvas.bringForward(canvas.getActiveObject());
    canvas.renderAll();
  }

  // Go down a layer
  function downLayer() {
    canvas.sendBackwards(canvas.getActiveObject());
    canvas.renderAll();
  }

  // Change canvas size
  function changeCanvasSize() {
    artboard.set({
        width: dimensions.find(x => x.name == $(this).attr("data-value")).width,
        height: dimensions.find(x => x.name == $(this).attr("data-value")).height
    });
    $("#canvas-width").val(dimensions.find(x => x.name == $(this).attr("data-value")).width);
    $("#canvas-height").val(dimensions.find(x => x.name == $(this).attr("data-value")).height);
    canvas.renderAll();
    resizeCanvas();
    var zoomLevel = 0.6;
    var objectLeft = artboard.left+(artboard.width/2);
    var objectTop  = artboard.top+(artboard.height/2);
    var newLeft = (-objectLeft * zoomLevel) + canvas.width  / 2;
    var newTop  = (-objectTop  * zoomLevel) + canvas.height / 2;
    canvas.setViewportTransform([zoomLevel, 0, 0, zoomLevel, newLeft, newTop]);
    canvas.renderAll();
  }

  // Change dimensions input
  function changeDimensionsInput() {
    artboard.set({
        width: parseFloat($("#canvas-width").val()),
        height: parseFloat($("#canvas-height").val())
    });
    canvas.renderAll();
    resizeCanvas();
    var zoomLevel = 0.6;
    var objectLeft = artboard.left+(artboard.width/2);
    var objectTop  = artboard.top+(artboard.height/2);
    var newLeft = (-objectLeft * zoomLevel) + canvas.width  / 2;
    var newTop  = (-objectTop  * zoomLevel) + canvas.height / 2;
    canvas.setViewportTransform([zoomLevel, 0, 0, zoomLevel, newLeft, newTop]);
    canvas.renderAll();
    $(".select-2 .current img").attr("src", "assets/custom-dimensions.png");
    $(".select-2 .current .mockup-name").html("Custom dimensions");
    $(".select-2 .current .mockup-details").html($("#canvas-width").val()+" x "+$("#canvas-height").val());
  }

  function showDownloadPopup() {
    downloadpopup = true;
    $("#download-popup").addClass("show-download");
    window.setTimeout(function(){
      animate(canvasrecord, true, canvasrecord.getItemById("artboard"));
    }, 100);
  }

  function hideDownloadPopup() {
    downloadpopup = false;
    $("#download-popup").removeClass("show-download");
  }

  function showSignIn() {
    $("#upgrade-modal").html('<img id="close-upgrade" src="assets/close.svg"><div id="upgrade-emoji">&#128075;</div><div id="upgrade-title">Log in or create an account</div><div id="upgrade-subtitle">Create an account to upgrade to PRO.</div><div id="sign-in-button"><img src="assets/google-logo.svg">Sign in with Google</div><div id="sign-in-already">By signing up you accept our <a href="https://necessary-duke-5f6.notion.site/Terms-of-Service-dbac14eccc264448aff6be96f027733d" target="_blank">Terms of Service</a>, <a href="https://necessary-duke-5f6.notion.site/Privacy-Policy-e95417ed50b3403a8bd8a534b9cb2b72" target="_blank">Privacy Policy</a>, and <a href="https://www.notion.so/Refund-Policy-1444632146cb4ab6853b29ecf2572238" target="_blank">Refund Policy</a></div>');
    $("#upgrade-popup").addClass("show-upgrade");
    hideUserDropdown();
  }

  function showUpgradePopup() {
    $("#upgrade-modal").html('<img id="close-upgrade" src="assets/close.svg"><div id="upgrade-emoji">&#10024;</div><div id="upgrade-title">Go PRO</div><div id="upgrade-subtitle">Make the most out of Animockup.</div><div id="upgrade-price">$10<span>/month</span></div><hr><div id="upgrade-items"><div class="upgrade-item"><img src="assets/check.svg"> Remove the watermark</div><div class="upgrade-item"><img src="assets/check.svg"> Access more device mockups</div><div class="upgrade-item"><img src="assets/check.svg"> MP4 and GIF export</div><div class="upgrade-item"><img src="assets/check.svg"> High quality export</div><div class="upgrade-item"><img src="assets/check.svg"> Support the developer</div></div><div id="upgrade-button" class="paddle_button" data-product="743638" data-theme="none">Upgrade</div><div id="sign-in-already">Already have an account? <span id="sign-in-2">Sign in</span></div>');
    $("#upgrade-popup").addClass("show-upgrade");
    hideUserDropdown();
  }

  function hideUpgradePopup() {
    $("#upgrade-popup").removeClass("show-upgrade");
  }

  function showUserDropdown() {
    if (!signedin) {
      $("#user-settings-dropdown").html('<div class="user-option" id="upgrade-dropdown">Upgrade to PRO</div><div class="user-option" id="log-in">Log in</div>');
    } else if (signedin && !premiumuser) {
      $("#user-settings-dropdown").html('<div class="user-option" id="upgrade-dropdown">Upgrade to PRO</div><div class="user-option" id="log-out">Log out</div>');
    } else if (signedin && premiumuser) {
      $("#user-settings-dropdown").html('<a href="'+updateurl+'" class="user-option">Update details</a><a href="'+cancelurl+'" class="user-option">Cancel subscription</a><div class="user-option" id="log-out">Log out</div>');
    }
    $("#user-settings-dropdown").addClass("show-user-settings");
  }

  function hideUserDropdown() {
    $("#user-settings-dropdown").removeClass("show-user-settings");
  }

  function showHelp() {
    $("#help-dropdown").addClass("help-show");
  }

  function hideHelp() {
    $("#help-dropdown").removeClass("help-show");
  }

  function toggleWatermark(e) {
    if (!premiumuser) {
      e.preventDefault();
      e.stopPropagation();
      showUpgradePopup();
    } else {
      if (!$(this).is(":checked")) {
        canvasrecord.getItemById("watermark").set({opacity: 1});
        canvasrecord.renderAll();
      } else {
        canvasrecord.getItemById("watermark").set({opacity: 0});
        canvasrecord.renderAll();
      }
    }
  }

  // Zoom in/out of the canvas
  canvas.on('mouse:wheel', function(opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    $("#zoom-level span").html((zoom*100).toFixed(0)+"%");
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    if (canvas.getActiveObject()) {
      checkText();
    }
    opt.e.preventDefault();
    opt.e.stopPropagation();
  });

  // Start panning if space is down or hand tool is enabled
  canvas.on('mouse:down', function(opt) {
    var e = opt.e;
    if (spaceDown || tool == "hand") {
      this.isDragging = true;
      this.selection = false;
      this.lastPosX = e.clientX;
      this.lastPosY = e.clientY;
    }
    if (opt.target) {
        opt.target.hasControls = true;
    }
    var pointer = canvas.getPointer(opt.e);
    var x = pointer.x;
    var y = pointer.y;
    if (tool == "text") {
      newTextbox(x, y);
    }
  });

  // Pan while dragging mouse
  canvas.on('mouse:move', function(opt) {
      var pointer = canvas.getPointer(opt.e);
      canvasx = pointer.x;
      canvasy = pointer.y;
      if (this.isDragging) {
        var e = opt.e;
        var vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
  });

  // Stop panning on mouse up
  canvas.on('mouse:up', function(opt) {
    this.setViewportTransform(this.viewportTransform);
    this.isDragging = false;
    line_h.opacity = 0;
    line_v.opacity = 0;
  });

  // Mouse over on the canvas
  canvas.on("mouse:over", function(e){
    if (tool == "cursor") {
      canvas.defaultCursor = "default";
    } else if (tool == "text") {
      canvas.defaultCursor = "crosshair";
    }
  });

  // An object is being moved in the canvas
  canvas.on("object:moving", function(e){
    checkText();
    e.target.hasControls = false;
    centerLines(e);
  });

  // An object has been modified
  canvas.on("object:modified", function(e){
    if (canvas.getActiveObject() && e.target) {
      objects.find(x => x.id == canvas.getActiveObject().get("id")).x = canvas.getActiveObject().get("left") - artboard.left;
      objects.find(x => x.id == canvas.getActiveObject().get("id")).y = canvas.getActiveObject().get("top") - artboard.top;
      objects.find(x => x.id == canvas.getActiveObject().get("id")).scaleX = canvas.getActiveObject().get("scaleX");
      objects.find(x => x.id == canvas.getActiveObject().get("id")).scaleY = canvas.getActiveObject().get("scaleY");
    }
    e.target.hasControls = true;
    canvas.renderAll();
    updateRecordCanvas();
  });

  // A selection has been updated in the canvas
  canvas.on("selection:updated", function(e){
    if (canvas.getActiveObject().type == "textbox") {
      var p = {x: canvas.getActiveObject().left, y: canvas.getActiveObject().top};
      var pos = fabric.util.transformPoint(p, canvas.viewportTransform);
      var x = pos.x-($("#text-options").width()/2)+350;
      var y = pos.y-50-canvas.getActiveObject().height;
      $("#text-options").css({left:x, top:y});
      $("#text-options").addClass("show-text");
    } else {
      $("#text-options").removeClass("show-text");
    }
  })

  // A selection has been made in the canvas
  canvas.on("selection:created", function(opt){
    checkText();
    $(".stacking-off").removeClass("stacking-off");
  });

  // A selection has been cleared in the canvas
  canvas.on("selection:cleared", function(e){
    $("#text-options").removeClass("show-text");
    $("#stacking").addClass("stacking-off");
    if (rearranging) {
      //reGroup();
    }
  });

  // Key event handling
  $(document).keyup(function(e) {
    // Space bar (panning)
    if (e.keyCode == 32) {
        spaceDown = false;
        canvas.defaultCursor = "default";
        canvas.renderAll();
    }
    // Delete object/keyframe
    if ((e.keyCode == 46 || e.key == 'Delete' || e.code == 'Delete' || e.key == 'Backspace')) {
      if (canvas.getActiveObject()) {
        if (canvas.getActiveObject().isEditing || canvas.getActiveObject().id == "mockup") {
          return;
        }
        deleteObject();
      }
    }
  }).keydown(function(e){
    // Space bar (panning)
    if (e.keyCode == 32) {
        spaceDown = true;
        canvas.defaultCursor = "grab";
        canvas.renderAll();
    }
  });

  function globalClickHandler(e) {
    // Hide color picker
    if (!$("#color14").is(e.target) && $("#color14").has(e.target).length === 0 && !$(".pcr-app").is(e.target) && $(".prc-app").has(e.target).length === 0 && !$(".pcr-selection").is(e.target) && $(".pcr-selection").has(e.target).length === 0 && !$(".pcr-swatches").is(e.target) && $(".pcr-swatches").has(e.target).length === 0 && !$(".pcr-interaction").is(e.target) && $(".pcr-interaction").has(e.target).length === 0) {
        background_color.hide();
    }
    if (!$("#color-choose").is(e.target) && $("#color-choose").has(e.target).length === 0 && !$(".pcr-app").is(e.target) && $(".prc-app").has(e.target).length === 0 && !$(".pcr-selection").is(e.target) && $(".pcr-selection").has(e.target).length === 0 && !$(".pcr-swatches").is(e.target) && $(".pcr-swatches").has(e.target).length === 0 && !$(".pcr-interaction").is(e.target) && $(".pcr-interaction").has(e.target).length === 0) {
        text_color.hide();
    }
    if (!$("#user-settings").is(e.target) && $("#user-settings").has(e.target).length === 0 && !$("#user-settings-dropdown").is(e.target) && $("#user-settings-dropdown").has(e.target).length === 0) {
        showHelp();
    }
    if (!$("#help").is(e.target) && $("#help").has(e.target).length === 0 && !$("#help-dropdown").is(e.target) && $("#help-dropdown").has(e.target).length === 0) {
        hideHelp();
    }
    if (!$("#user-settings").is(e.target) && $("#user-settings").has(e.target).length === 0 && !$("#user-settings-dropdown").is(e.target) && $("#user-settings-dropdown").has(e.target).length === 0) {
        hideUserDropdown();
    }
  }

  var holder = document.getElementById('upload');
  holder.ondragover = function () { return false; };
  holder.ondragend = function () { return false; };
  holder.ondrop = function (e) {
    e.preventDefault();
    var wip = e.dataTransfer.files[0]
    var file = e.dataTransfer.files[0];
    var reader = new FileReader();
    reader.onload = function(file) {
      if (wip["type"] == "image/png" || wip["type"] == "image/jpg" || wip["type"] == "image/jpeg" || wip["type"] == "image/gif") {
        loadImage(file.target.result, true);
      } else {
        loadVideo(file.target.result, true);
      }
    }
    reader.readAsDataURL(file);
  }

  function checkPROOption(e) {
    if ($(this).children(".pro-label").length > 0) {
      if (!$(this).children(".pro-label").hasClass("premium-on")) {
        preventDefault(e);
        showUpgradePopup();
      }
    }
  }

  function preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  $(document).on("mousedown", globalClickHandler);
  $(document).on("click", ".tool:not(.tool-active)", enableTool);
  $(document).on("click", "#upload", uploadTrigger);
  $(document).on("change", "#upload-screen", upload);
  $(document).on("click", ".color:not(#color14)", switchBackgroundFill);
  $(document).on("mousedown", ".select .option", switchMockup);
  $(document).on("change", "#font-picker", changeFont);
  $(document).on("click", ".text-format", changeTextFormat);
  $(document).on("click", ".text-align", alignText);
  $(document).on("click", "#image", uploadImageTrigger);
  $(document).on("change", "#upload-image", uploadImageCanvas);
  $(document).on("click", "#color14", toggleColorPicker);
  $(document).on("click", "#color-choose", toggleTextPicker);
  $(document).on("click", "#arrow-up", upLayer);
  $(document).on("click", "#arrow-down", downLayer);
  $(document).on("click", ".select-2 .option", changeCanvasSize);
  $(document).on("click", ".select-2 input", preventDefault);
  $(document).on("input", "#canvas-width", changeDimensionsInput);
  $(document).on("click", "#crop", crop);
  $(document).on("click", "#play", toggleAnimation);
  $(document).on("click", "#download", showDownloadPopup);
  $(document).on("click", "#overlay", hideDownloadPopup);
  $(document).on("click", "#close-settings", hideDownloadPopup);
  $(document).on("click", ".switch", toggleWatermark);
  $(document).on("change", "#watermark input", toggleWatermark);
  $(document).on("click", "#download-button", record);
  $(document).on("click", "#upgrade-overlay", hideUpgradePopup);
  $(document).on("click", "#close-upgrade", hideUpgradePopup);
  $(document).on("click", "#upgrade-button", showSignIn);
  $(document).on("click", "#sign-in-button", googleSignIn);
  $(document).on("click", "#upgrade-dropdown", showUpgradePopup);
  $(document).on("click", "#log-in", showSignIn);
  $(document).on("click", "#user-settings", showUserDropdown);
  $(document).on("click", "#log-out", logOut);
  $(document).on("mousedown", ".option", checkPROOption);
  $(document).on("click", "#help", showHelp);
  $(document).on("click", "#sign-in-2", showSignIn);
  $(document).on("click", "#copy", showUpgradePopup);
});
