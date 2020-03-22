$(document).ready(function() {
    // Tooltip switch
    $(".tool-item").on("click", function() {
        if (!$(this).hasClass("tool-active")) {
            $(".tool-active").children("svg").children("path").css("stroke", "rgb(136, 145, 175)");
            $(".tool-active").removeClass("tool-active");
            $(this).addClass("tool-active");
            $(this).children("svg").children("path").css("stroke", "#FFF");
            if ($(this).hasClass("newtext")) {
                toggleText(true);
            } else {
                toggleText(false);
            }
            if ($(this).hasClass("maxzoom")) {
                canvasZoom(true);
                $("#zoomalert").removeClass("hiddenzoom");
                window.setTimeout(function() {
                    $("#zoomalert").addClass("hiddenzoom");
                }, 3500)
            } else {
                canvasZoom(false);
            }
            if (!$(this).hasClass("newtext") && !$(this).hasClass("maxzoom")) {
                normalCursor();
            }
        }
    })
    // Canvas color picker
    const pickr = Pickr.create({
        el: '.color-picker',
        theme: 'nano',
        useAsButton: true,
        swatches: null,
        default: '#FFFFFF',

        components: {
            // Main components
            preview: true,
            opacity: true,
            hue: true,
            // Input / output Options
            interaction: {
                hex: true,
                rgba: true,
                hsla: false,
                hsva: false,
                cmyk: false,
                input: true,
                clear: false,
                save: false
            }
        }
    });
    $("#color-opacity input").change(function() {
        if (parseFloat($(this).val()) > 100) {
            $(this).val(100);
        }
        pickr.setColor(pickr.getColor().toRGBA().toString().replace(/[\d\.]+\)$/g, "," + ($(this).val() / 100) + ")"));
    });
    $("#canvas-color").click(function() {
        pickr.show();
    });
    pickr.on('change', function(HSVaColorObject) {
        $("#canvas-color input").val(HSVaColorObject.toHEXA().toString().substring(0, 7));
        $("#color-opacity input").val(Math.round((HSVaColorObject.toRGBA()[3] * 100) * 100) / 100);
        $("#color-side").css("background-color", HSVaColorObject.toRGBA().toString());
        canvasChangeColor(HSVaColorObject.toRGBA().toString());
    });
 
    // Download mockup button (nav bar)
    function closeModal() {
        if (!$(".opacity-back").hasClass("opacity-off")) {
            $(".opacity-back").addClass("opacity-off");
            $("#download-modal").addClass("download-off");
            $(".switch").addClass("switch-off");
        }
        if (!$(".settings-back").hasClass("opacity-off")) {
            $(".settings-back").addClass("opacity-off");
            $("#settings-modal").addClass("settings-off");
            var ico = document.getElementsByClassName("tool-active")[0].getElementsByTagName("svg")[0].getElementsByTagName("path")
            for (i = 0; i < ico.length; i++) {
                ico[i].style.stroke = "rgb(136, 145, 175)";
            }
            document.getElementsByClassName("tool-active")[0].classList.remove("tool-active");
            document.getElementsByClassName("cursor")[0].classList.add("tool-active");
            var ico = document.getElementsByClassName("tool-active")[0].getElementsByTagName("svg")[0].getElementsByTagName("path")
            for (i = 0; i < ico.length; i++) {
                ico[i].style.stroke = "#FFF";
            }
            document.body.style.cursor = 'auto';
        }
    }
    $("#download-button").on("click", function() {
        closeModal();
        if ($(".opacity-back").hasClass("opacity-off")) {
            $(".opacity-back").removeClass("opacity-off");
            $("#download-modal").removeClass("download-off");
            $(".switch").removeClass("switch-off");
        }
    });
    $(".opacity-back").on("click", function() {
        closeModal();
    });
    $(".close-modal").on("click", function() {
        closeModal();
    });
    var pick_setting = "webm";
    $(".format-select").on("click", function() {
        if (!$(this).hasClass("active-format")) {
            $(".active-format").removeClass("active-format");
            $(this).addClass("active-format");
            if ($(this).hasClass("gif-format")) {
                pick_setting = "gif";
                $("#video-type").addClass("hide-radio");
                $("#download-modal").removeClass("long-panel");
            } else {
                if ($("#2").is(':checked')) {
                    pick_setting = "webm";
                } else {
                    pick_setting = "mp4";
                }
                $("#video-type").removeClass("hide-radio");
                $("#download-modal").addClass("long-panel");
            }
        }
    });
    $("#2").on("click", function() {
        if ($("#2").is(':checked')) {
            pick_setting = "webm";
        } else {
            pick_setting = "mp4";
        }
    });
    $("#3").on("click", function() {
        if ($("#2").is(':checked')) {
            pick_setting = "webm";
        } else {
            pick_setting = "mp4";
        }
    });
    $("#download-final").on("click", function() {
        if (!$(this).hasClass("download-active")) {
            recordCanvas(pick_setting);
            $(this).html("Rendering...");
            $(this).addClass("download-active");
        }
    });
    // Settings button
    $(".toolsett").on("click", function() {
        if ($(".settings-back").hasClass("opacity-off")) {
            $(".settings-back").removeClass("opacity-off");
            $("#settings-modal").removeClass("settings-off");
        }
    });
    $(".settings-back").on("click", function() {
        closeModal();
    });
    $("#save-button").on("click", function() {
        closeModal();
    });
    // Dropdowns
    $('.select').niceSelect();
    $(document).on("click", ".canvas-select .option", function() {
        canvasPreset($(this).attr("data-value"));
    });
    $(document).on("click", "#deviceselect .option", function() {
        deviceSelect($(this).attr("data-value"));
    });
});
// Text color picker
    const pickr = Pickr.create({
        el: '#text-color',
        theme: 'nano',
        useAsButton: true,
        swatches: null,
        default: '#FFFFFF',
        components: {
            // Main components
            preview: true,
            opacity: true,
            hue: true,
            // Input / output Options
            interaction: {
                hex: true,
                rgba: true,
                hsla: false,
                hsva: false,
                cmyk: false,
                input: true,
                clear: false,
                save: false
            }
        }
    });
    pickr.on('change', function(HSVaColorObject) {
        document.getElementById("color-show").style.backgroundColor = HSVaColorObject.toRGBA().toString();
        textChangeColor(HSVaColorObject.toRGBA().toString());
    });

// Zoom slider
var selectme = document.getElementById("select-size");
var slider = new RangeSlider(selectme, {
    design: "2d",
    theme: "default",
    handle: "round",
    popup: null,
    showMinMaxLabels: false,
    unit: "%",
    min: 10,
    max: 200,
    value: 100,
    onmove: function(x) {
        document.getElementById("zoom-perc").getElementsByTagName("input")[0].value = x;
        zoomCanvas();
    },
    onfinish: function(x) {
        document.getElementById("zoom-perc").getElementsByTagName("input")[0].value = x;
        zoomCanvas();
    },
    onstart: function(x) {
        document.getElementById("zoom-perc").getElementsByTagName("input")[0].value = x;
        zoomCanvas();
    }
});
// Zoom input
document.getElementById("zoom-perc").getElementsByTagName("input")[0].onchange = function() {
    if (parseInt(document.getElementById("zoom-perc").getElementsByTagName("input")[0].value) < 200 && parseInt(document.getElementById("zoom-perc").getElementsByTagName("input")[0].value) > 10) {
        slider.setValue(parseInt(document.getElementById("zoom-perc").getElementsByTagName("input")[0].value));
    } else if (parseInt(document.getElementById("zoom-perc").getElementsByTagName("input")[0].value) > 200) {
        document.getElementById("zoom-perc").getElementsByTagName("input")[0].value = 200;
        slider.setValue(200);
    } else if (parseInt(document.getElementById("zoom-perc").getElementsByTagName("input")[0].value) < 10) {
        document.getElementById("zoom-perc").getElementsByTagName("input")[0].value = 10;
        slider.setValue(10);
    }
};
// Video length input
document.getElementById("video-length").getElementsByTagName("input")[0].onchange = function() {
    if (parseInt(document.getElementById("video-length").getElementsByTagName("input")[0].value) > 300) {
        document.getElementById("video-length").getElementsByTagName("input")[0].value = parseFloat(300).toFixed(2);
    } else if (parseInt(document.getElementById("video-length").getElementsByTagName("input")[0].value) < 0.5) {
        document.getElementById("video-length").getElementsByTagName("input")[0].value = 0.50;
    } else {
        document.getElementById("video-length").getElementsByTagName("input")[0].value = parseFloat(document.getElementById("video-length").getElementsByTagName("input")[0].value).toFixed(2);
    }
    videolength = document.getElementById("video-length").getElementsByTagName("input")[0].value;
};
// Canvas functionality
var videolength = 1;
var activeguides = true;
var activezoom = false;
var activetext = false;
var text_active = false;
var image_active = false;
var recording = false;
var video;
var video_loaded = false;
var current_device = "iphone 11 pro space gray";
var mockup_margin = {
    macbookprosilver: {
        left: 12,
        right: 24,
        top: 10,
        bottom: 20
    },
    macbookprosg: {
        left: 12,
        right: 24,
        top: 10,
        bottom: 20
    },
    iphone11prosg: {
        left: 8,
        right: 17,
        top: 4,
        bottom: 8
    },
    appleimac: {
        left: 4,
        right: 7,
        top: 2,
        bottom: 34
    },
    ipadspacegray: {
        left: 7,
        right: 14,
        top: 10,
        bottom: 20
    },
    ipadsilver: {
        left: 7,
        right: 14,
        top: 10,
        bottom: 20
    },
    ipadgold: {
        left: 7,
        right: 14,
        top: 10,
        bottom: 20
    },
    dellxps15: {
        left: 12,
        right: 24,
        top: 4,
        bottom: 21
    },
    googlepixel4: {
        left: 7,
        right: 14,
        top: 7,
        bottom: 14
    },
    huaweip8black: {
        left: 7,
        right: 14,
        top: 12,
        bottom: 20
    },
    huaweip8white: {
        left: 7,
        right: 14,
        top: 12,
        bottom: 20
    },
    microsoftsurfacebook: {
        left: 13,
        right: 26,
        top: 7,
        bottom: 18
    },
    samsunggalaxynote10: {
        left: 7,
        right: 14,
        top: 4,
        bottom: 7
    },
    applewatchblack: {
        left: 21,
        right: 39,
        top: 28,
        bottom: 56
    },
    applewatchrosegold: {
        left: 21,
        right: 39,
        top: 28,
        bottom: 56
    },
    applewatchwhite: {
        left: 21,
        right: 39,
        top: 28,
        bottom: 56
    },
    dellultrasharpmonitor: {
        left: 3,
        right: 5,
        top: 2,
        bottom: 32
    },
    iphone8: {
        left: 10,
        right: 18,
        top: 14,
        bottom: 28
    }
};
var device_margin = mockup_margin.iphone11prosg;
var offset_footage = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};
var canvas = new fabric.Canvas('canvas', {
    backgroundColor: "#FFF",
    preserveObjectStacking: true,
    width: 500,
    height: 500
});
const recorder = new CanvasRecorder(document.getElementById("canvas"));
fabric.Canvas.prototype.getItemByName = function(name) {
    var object = null,
        objects = this.getObjects();
    for (var i = 0, len = this.size(); i < len; i++) {
        if (objects[i].name && objects[i].name === name) {
            object = objects[i];
            break;
        }
    }
    return object;
};
canvas.selection = false;
var textboxes = [];
var selected_text;
var selected_image;
// Font picker (textbox)
function changeFont() {
    WebFont.load({
        google: {
            families: [fontPicker.getActiveFont().family]
        },
        active: () => {
            canvas.getActiveObject().set("fontFamily", fontPicker.getActiveFont().family);
        }
    });
}
const fontPicker = new FontPicker(
    "AIzaSyDRgAibNhvyneF9QVIBlPcom3oB0xaQaV4", // Google API key
    "Open Sans", // Default font
    {
        limit: 30
    },
    changeFont
);
// Center lines
var line_h = new fabric.Line([
    canvas.width / 2, 0,
    canvas.width / 2, canvas.width
], {
    stroke: 'red',
    opacity: 0,
    selectable: false,
    evented: false,
    name: 'line_h'
})
var line_v = new fabric.Line([
    0, canvas.height / 2, canvas.width,
    canvas.height / 2
], {
    stroke: 'red',
    opacity: 0,
    selectable: false,
    evented: false,
    name: 'line_v'
})
canvas.add(line_h);
canvas.add(line_v);
// Create a textbox
function newTextbox(x, y) {
    if (typeof x !== 'undefined' && typeof y !== 'undefined') {
        var newtext = new fabric.Textbox('', {
            left: x,
            top: y,
            fontFamily: 'sans-serif',
            fill: 'black',
            transparentCorners: false,
            lockRotation: true,
            borderColor: '#0E98FC',
            cornerColor: '#0E98FC',
            centeredScaling: false,
            borderOpacityWhenMoving: 1,
            hasRotationPoint: false,
            lockScalingFlip: true,
            lockSkewingX: true,
            lockSkewingY: true,
            cursorWidth: 1,
            cursorDuration: 1,
            cursorDelay: 250
        });
    }
    textboxes.push(newtext);
    newtext.setControlsVisibility({
        bl: true,
        br: true,
        tl: true,
        tr: true,
        mb: false,
        ml: true,
        mr: true,
        mt: false,
        mtr: false,
    });
    canvas.add(newtext).setActiveObject(newtext);
    canvas.bringToFront(newtext);
    canvas.renderAll();
    newtext.enterEditing();
    pickr.setColor("black");
}

// Delete textbox
function deleteTextbox() {
    canvas.remove(selected_text);
    for (var i = 0; i < textboxes.length; i++) {
        if (textboxes[i] == selected_text) {
            textboxes.splice(i, 1);
        }
    }
    var text_options = document.getElementsByClassName("text-options")[0];
    text_active = false;
    text_options.classList.add("text-off");
}
// Delete image
function deleteImage() {
    canvas.remove(selected_image);
    var image_options = document.getElementsByClassName("image-options")[0];
    image_active = false;
    image_options.classList.add("image-off");
}
window.addEventListener('load', function () {
// Create image
var imgElement = document.getElementById('phone-img');
var imgInstance = new fabric.Image(imgElement, {
    left: 0,
    top: 0,
    angle: 0,
    transparentCorners: false,
    id: 'mockup',
    borderColor: '#0E98FC',
    cornerColor: '#0E98FC',
    centeredScaling: false,
    borderOpacityWhenMoving: 1,
    hasRotationPoint: false,
    lockScalingFlip: true,
    lockUniScaling: true,
    objectCaching: false,
    name: 'mockup'
});
imgInstance.scaleToWidth(200);

// create video
var newvideo = document.createElement('video');
newvideo.setAttribute("id", "footage");
newvideo.src = 'assets/video.mp4';
newvideo.muted = true;
newvideo.loop = true;
document.getElementById("panel").appendChild(newvideo);
canvas.add(imgInstance).setActiveObject(imgInstance);
imgInstance.center();
imgInstance.setCoords();
offset_footage.x = imgInstance.get('left') + (((imgInstance.get('width') * imgInstance.scaleX) / 100) * mockup_margin.iphone11prosg.left);
offset_footage.y = imgInstance.get('top') + (((imgInstance.get('height') * imgInstance.scaleY) / 100) * mockup_margin.iphone11prosg.top);
offset_footage.width = (imgInstance.get('width') * imgInstance.scaleX) - ((imgInstance.get('width') * imgInstance.scaleX) / 100) * mockup_margin.iphone11prosg.right;
offset_footage.height = (imgInstance.get('height') * imgInstance.scaleY) - ((imgInstance.get('height') * imgInstance.scaleY) / 100) * mockup_margin.iphone11prosg.bottom;
newvideo.addEventListener('loadeddata', function() {
    if (!video_loaded) {
        video_loaded = true;
        newvideo.play();
        newvideo.setAttribute("width", newvideo.videoWidth);
        newvideo.setAttribute("height", newvideo.videoHeight);
        var isFirefox = typeof InstallTrigger !== 'undefined';
        var extraH = 0;
        if (isFirefox) {
            extraH = 1350;
        }
        var video = new fabric.Image(newvideo, {
            left: offset_footage.x,
            top: offset_footage.y,
            angle: 0,
            transparentCorners: false,
            objectCaching: false,
            selectable: false,
            centeredScaling: true,
            lockScalingFlip: true,
            hasRotationPoint: true,
            width: newvideo.videoWidth,
            height: newvideo.videoHeight-extraH,
            name: 'video'
        });
        video.setCoords();   
        canvas.add(video);
        video.setCoords();
        canvas.sendBackwards(video);
        videolength = canvas.getItemByName('video')._originalElement.duration;
        imgInstance.setControlsVisibility({
            bl: true,
            br: true,
            tl: true,
            tr: true,
            mb: false,
            ml: false,
            mr: false,
            mt: false,
            mtr: false,
        });
        video.set({
            scaleX: offset_footage.width/video.width,
            scaleY: offset_footage.height/video.height,
        })
    } else {
        video = canvas.getItemByName('video');
        newvideo.setAttribute("width", newvideo.videoWidth);
        newvideo.setAttribute("height", newvideo.videoHeight);
        canvas.getItemByName('video').width = newvideo.videoWidth;
        canvas.getItemByName('video').height = newvideo.videoHeight;
        var mockup_width = imgInstance.width * imgInstance.scaleX;
        offset_footage.width = (mockup_width) - ((mockup_width) / 100) * device_margin.right;
        video.setCoords();
        video.getElement().play();
        canvas.getItemByName('video').set({
            left: offset_footage.x,
            top: offset_footage.y,
            scaleX: offset_footage.width/video.width,
            scaleY: offset_footage.height/video.height,
        });
        canvas.bringToFront(video);
        canvas.bringToFront(imgInstance);
        canvas.renderAll();
        videolength = canvas.getItemByName('video')._originalElement.duration;
    }
    var canvasAction = function(evt) {
        if (canvas.interactive) {
            centerLines(evt);
            var mod_object = evt.target;
            mod_object.setCoords();
            var mockup_x = imgInstance.get('left');
            var mockup_y = imgInstance.get('top');
            var mockup_width = imgInstance.width * imgInstance.scaleX;
            var mockup_height = imgInstance.height * imgInstance.scaleY;
            if (current_device == "iphone 11 pro space gray") {
                device_margin = mockup_margin.iphone11prosg;
            } else if (current_device == "macbook pro space gray") {
                device_margin = mockup_margin.macbookprosg;
            } else if (current_device == "macbook pro silver") {
                device_margin = mockup_margin.macbookprosilver;
            } else if (current_device == "apple imac") {
                device_margin = mockup_margin.appleimac;
            } else if (current_device == "ipad space gray") {
                device_margin = mockup_margin.ipadspacegray;
            } else if (current_device == "ipad silver") {
                device_margin = mockup_margin.ipadsilver;
            } else if (current_device == "ipad gold") {
                device_margin = mockup_margin.ipadgold
            } else if (current_device == "dell xps 15") {
                device_margin = mockup_margin.dellxps15;
            } else if (current_device == "google pixel 4") {
                device_margin = mockup_margin.googlepixel4;
            } else if (current_device == "huawei p8 black") {
                device_margin = mockup_margin.huaweip8black;
            } else if (current_device == "huawei p8 white") {
                device_margin = mockup_margin.huaweip8white;
            } else if (current_device == "microsoft surface book") {
                device_margin = mockup_margin.microsoftsurfacebook;
            } else if (current_device == "samsung galaxy note 10") {
                device_margin = mockup_margin.samsunggalaxynote10;
            } else if (current_device == "apple watch black") {
                device_margin = mockup_margin.applewatchblack;
            } else if (current_device == "apple watch rose gold") {
                device_margin = mockup_margin.applewatchrosegold;
            } else if (current_device == "apple watch white") {
                device_margin = mockup_margin.applewatchwhite;
            } else if (current_device == "dell ultrasharp monitor") {
                device_margin = mockup_margin.dellultrasharpmonitor;
            } else if (current_device == "iphone 8") {
                device_margin = mockup_margin.iphone8;
            }
            offset_footage.x = mockup_x + (((mockup_width) / 100) * device_margin.left);
            offset_footage.y = mockup_y + (((mockup_height) / 100) * device_margin.top);
            offset_footage.width = (mockup_width) - ((mockup_width) / 100) * device_margin.right;
            offset_footage.height = (mockup_height) - (((mockup_height) / 100) * device_margin.bottom);
            canvas.getItemByName('video').set({
                left: offset_footage.x,
                top: offset_footage.y,
                scaleX: offset_footage.width/video.width,
                scaleY: offset_footage.height/video.height,
            });
            if (mod_object.get('type') == "textbox") {
                for (var i = 0; i < textboxes.length; i++) {
                    if (textboxes[i] == mod_object) {
                        selected_text = textboxes[i];
                        break;
                    }
                }
                var text_options = document.getElementsByClassName("text-options")[0];
                document.getElementById("color-show").style.backgroundColor = selected_text.fill;
                pickr.setColor(selected_text.fill);
                var scaleX = document.getElementById("canvas").getBoundingClientRect().width / document.getElementById("canvas").offsetWidth;
                var scaleY = document.getElementById("canvas").getBoundingClientRect().height / document.getElementById("canvas").offsetHeight;
                text_options.style.left = (selected_text.get('left') * scaleX) + document.getElementById("canvas").getBoundingClientRect().left + ((selected_text.get('width') * selected_text.scaleX * scaleX) / 2) - (text_options.getBoundingClientRect().width / 2);
                text_options.style.top = (selected_text.get('top') * scaleY) + document.getElementById("canvas").getBoundingClientRect().top - 70;
            } else if (mod_object.get('type') == "image" && mod_object != imgInstance) {
                selected_image = canvas.getActiveObject();
                selected_image.setCoords();
                var image_options = document.getElementsByClassName("image-options")[0];
                var scaleX = document.getElementById("canvas").getBoundingClientRect().width / document.getElementById("canvas").offsetWidth;
                var scaleY = document.getElementById("canvas").getBoundingClientRect().height / document.getElementById("canvas").offsetHeight;
                image_options.style.left = (selected_image.get('left') * scaleX) + document.getElementById("canvas").getBoundingClientRect().left + ((selected_image.get('width') * selected_image.scaleX * scaleX) / 2) - (image_options.getBoundingClientRect().width / 2);
                image_options.style.top = (selected_image.get('top') * scaleY) + document.getElementById("canvas").getBoundingClientRect().top - 70;
            }
        }
    }
    var clearSelection = function() {
        if (text_active) {
            var text_options = document.getElementsByClassName("text-options")[0];
            text_active = false;
            text_options.classList.add("text-off")
        }
        if (image_active) {
            var image_options = document.getElementsByClassName("image-options")[0];
            image_active = false;
            image_options.classList.add("image-off");
        }
    }
    var canvasBox = function(evt) {
        canvasAction(evt);
            if (canvas.interactive) {
                var mod_object = evt.target;
                if (mod_object != imgInstance) {
                    canvas.bringToFront(mod_object);
                } else {
                    canvas.bringToFront(video);
                    canvas.bringToFront(imgInstance);
                }
                if (mod_object.get('type') == "textbox") {
                    for (var i = 0; i < textboxes.length; i++) {
                        if (textboxes[i] == mod_object) {
                            selected_text = textboxes[i];
                            break;
                        }
                    }
                    var text_options = document.getElementsByClassName("text-options")[0];
                    document.getElementById("color-show").style.backgroundColor = selected_text.fill;
                    pickr.setColor(selected_text.fill);
                    text_options.style.left = selected_text.get('left') + document.getElementById("canvas").getBoundingClientRect().left + ((selected_text.get('width') * selected_text.scaleX) / 2) - (text_options.getBoundingClientRect().width / 2);
                    text_options.style.top = selected_text.get('top') + document.getElementById("canvas").getBoundingClientRect().top - 70;
                    if (!text_active) {
                        text_active = true;
                        text_options.classList.remove("text-off");
                    }
                } else {
                    if (text_active) {
                        var text_options = document.getElementsByClassName("text-options")[0];
                        text_active = false;
                        text_options.classList.add("text-off");
                    }
                }
                if (mod_object.get('type') == "image" && mod_object != imgInstance) {
                    selected_image = canvas.getActiveObject();
                selected_image.setCoords();
                var image_options = document.getElementsByClassName("image-options")[0];
                var scaleX = document.getElementById("canvas").getBoundingClientRect().width / document.getElementById("canvas").offsetWidth;
                var scaleY = document.getElementById("canvas").getBoundingClientRect().height / document.getElementById("canvas").offsetHeight;
                image_options.style.left = (selected_image.get('left') * scaleX) + document.getElementById("canvas").getBoundingClientRect().left + ((selected_image.get('width') * selected_image.scaleX * scaleX) / 2) - (image_options.getBoundingClientRect().width / 2);
                image_options.style.top = (selected_image.get('top') * scaleY) + document.getElementById("canvas").getBoundingClientRect().top - 70;
                    if (!image_active) {
                        image_active = true;
                        image_options.classList.remove("image-off");
                    }
                } else {
                    if (image_active) {
                        var image_options = document.getElementsByClassName("image-options")[0];
                        image_active = false;
                        image_options.classList.add("image-off")
                    }
                }
            }
    }
    // Upload a screen
    document.getElementById("screen-upload").onchange = function(e) {
            if (this.files[0].size > 5242880) {
                alert("File is too big! Must be under 5MB");
                this.value = "";
            } else {
                let file = event.target.files[0];
                let blobURL = URL.createObjectURL(file);
                document.getElementById("footage").src = blobURL;
                if (document.getElementById("uploadsrc").classList.contains("hiddenvideo")) {
                    document.getElementById("uploadsrc").classList.remove("hiddenvideo");
                }
                document.getElementById("uploadsrc").src = blobURL;
                document.getElementById("upload").querySelector("p").innerHTML = "Drag and drop to replace";
                document.getElementById("uploadicon").classList.add("hideicon");
            }
    }
    // Drag and drop screen footage
    var holder = document.getElementById('upload');
    holder.ondragover = function() {
        holder.classList.add("active-upload");
        return false;
    };
    holder.ondragleave = function() {
        holder.classList.remove("active-upload");
    }
    holder.ondrop = function(e) {
        holder.classList.remove("active-upload");
        e.preventDefault();
        var imageTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
        var file = e.dataTransfer.files[0];
        var fileUrl = window.URL.createObjectURL(file);
        if (imageTypes.includes(file.type)) {
            document.getElementById("footage").src = fileUrl;
            if (document.getElementById("uploadsrc").classList.contains("hiddenvideo")) {
                document.getElementById("uploadsrc").classList.remove("hiddenvideo");
            }
            document.getElementById("uploadsrc").src = fileUrl;
            document.getElementById("uploadicon").classList.add("hideicon");
            document.getElementById("upload").querySelector("p").innerHTML = "Drag and drop to replace";
        }
    };
    // Upload background image
    document.getElementById("backimg-input").onchange = function(e) {
            let file = event.target.files[0];
            let blobURL = URL.createObjectURL(file);
            document.getElementById("preview-image").src = blobURL;
            if (document.getElementById("preview-image").classList.contains("imageoff")) {
                document.getElementById("preview-image").classList.remove("imageoff");
            }
            document.getElementById("backuploadico").classList.add("hideicon");
            document.getElementById("upload2").querySelector("p").innerHTML = "Drag and drop to replace";
            if (document.getElementById("del-backimg").classList.contains("hide-del")) {
                document.getElementById("del-backimg").classList.remove("hide-del");
            }
            fabric.Image.fromURL(blobURL, imgObj => {
                canvas.setBackgroundImage(imgObj, canvas.renderAll.bind(canvas), {
                    opacity: 1,
                    strech: false
                });
                if (!canvas.backgroundImage) return;
                if (!canvas.backgroundImage.strech) {
                    imgObj.scaleToWidth(canvas.width);
                    imgObj.scaleToHeight(canvas.height);
                    canvas.backgroundImage.strech = true;
                } else {
                    imgObj.scaleToWidth(imgObj.width);
                    imgObj.scaleToHeight(imgObj.height);
                    canvas.backgroundImage.strech = false;
                }
                canvas.renderAll();
            });
        }
    // Drag and drop background image
    var holder2 = document.getElementById('upload2');
    holder2.ondragover = function() {
        holder2.classList.add("active-upload");
        return false;
    };
    holder2.ondragleave = function() {
        holder2.classList.remove("active-upload");
    }
    holder2.ondrop = function(e) {
        holder2.classList.remove("active-upload");
        e.preventDefault();
        var imageTypes = ['image/png', 'image/jpg', 'image/gif'];
        var file = e.dataTransfer.files[0];
        var fileUrl = window.URL.createObjectURL(file);
        if (imageTypes.includes(file.type)) {
            document.getElementById("preview-image").src = fileUrl;
            if (document.getElementById("preview-image").classList.contains("imageoff")) {
                document.getElementById("preview-image").classList.remove("imageoff");
            }
            document.getElementById("backuploadico").classList.add("hideicon");
            document.getElementById("upload2").querySelector("p").innerHTML = "Drag and drop to replace";
            if (document.getElementById("del-backimg").classList.contains("hide-del")) {
                document.getElementById("del-backimg").classList.remove("hide-del");
            }
            fabric.Image.fromURL(fileUrl, imgObj => {
                canvas.setBackgroundImage(imgObj, canvas.renderAll.bind(canvas), {
                    opacity: 1,
                    strech: false
                });
                if (!canvas.backgroundImage) return;
                if (!canvas.backgroundImage.strech) {
                    imgObj.scaleToWidth(canvas.width);
                    imgObj.scaleToHeight(canvas.height);
                    canvas.backgroundImage.strech = true;
                } else {
                    imgObj.scaleToWidth(imgObj.width);
                    imgObj.scaleToHeight(imgObj.height);
                    canvas.backgroundImage.strech = false;
                }
                canvas.renderAll();

            });
        }
    };
    document.getElementById('upload2').onclick = function(ev) {
            if (ev.target != document.getElementById("del-backimg")) {
                document.getElementById('backimg-input').click();
            }
    }
    // Delete background image
    document.getElementById("del-backimg").onclick = function(ev) {
        ev.preventDefault();
        canvas.backgroundImage = false;
        document.getElementById("del-backimg").classList.add("hide-del");
        document.getElementById("preview-image").classList.add("imageoff");
        document.getElementById("upload2").querySelector("p").innerHTML = "Drag and drop your image";
        document.getElementById("backuploadico").classList.remove("hideicon");
    }
    canvas.on({
        'object:rotating': canvasAction,
        'object:moving': canvasAction,
        'object:modified': canvasAction,
        'object:scaling': canvasAction,
        'object:selected': canvasBox,
        'selection:updated': canvasBox,
        'before:selection:cleared': clearSelection,
        'mouse:up': hideLines
    });
}, false);
});
var imgInstance = canvas.getItemByName('mockup');
// Render new frame (canvas)
fabric.util.requestAnimFrame(function render() {
    canvas.renderAll();
    fabric.util.requestAnimFrame(render);
});
// Detect clicks anywhere on the page to discard current selection
window.addEventListener('click', function(e) {
    if (e.target != document.getElementsByClassName('upper-canvas')[0] && e.target != document.getElementsByClassName('text-options')[0] && !e.target.contains(document.getElementsByClassName('text-options')[0]) && !e.target.closest('.text-options') && e.target != document.getElementById("new-text") && !e.target.closest('.pcr-app') && e.target != document.getElementsByClassName("pcr-app")) {
        if (text_active) {
            var text_options = document.getElementsByClassName("text-options")[0];
            text_active = false;
            text_options.classList.add("text-off");
        }
        canvas.discardActiveObject();
    }
});
// Automatically position the image/text popup on page resize
window.onresize = function(event) {
    if (text_active) {
        var text_options = document.getElementsByClassName("text-options")[0];
        text_options.style.left = selected_text.get('left') + document.getElementById("canvas").getBoundingClientRect().left + ((selected_text.get('width') * selected_text.scaleX) / 2) - (text_options.getBoundingClientRect().width / 2);
        text_options.style.top = selected_text.get('top') + document.getElementById("canvas").getBoundingClientRect().top - 70;
    }
    if (image_active) {
        var image_options = document.getElementsByClassName("image-options")[0];
        image_options.style.left = selected_image.get('left') + document.getElementById("canvas").getBoundingClientRect().left + ((selected_image.get('width') * selected_image.scaleX) / 2) - (image_options.getBoundingClientRect().width / 2);
        image_options.style.top = selected_image.get('top') + document.getElementById("canvas").getBoundingClientRect().top - 70;
    }
}
// Zoom in and out of the canvas
function zoomCanvas() {
    var zoom_value = parseInt(document.getElementById("zoom-perc").querySelector("input").value);
    document.getElementsByClassName("canvas-container")[0].setAttribute('style', "transform:scale(" + zoom_value / 100 + ")");
    document.getElementsByClassName("canvas-container")[0].style.transform = document.getElementsByClassName("canvas-container")[0].style.transform.replace(/scale\([0-9|\.]*\)/, 'scale(' + zoom_value / 100 + ')');
    if (document.getElementsByClassName("canvas-container")[0].offsetWidth * (zoom_value / 100) > document.getElementById("canvas-area").offsetWidth) {
        document.getElementById("canvas-area").scrollLeft = (-1) * (document.getElementsByClassName("canvas-container")[0].offsetLeft - ((document.getElementsByClassName("canvas-container")[0].offsetWidth * (zoom_value / 100)) - document.getElementsByClassName("canvas-container")[0].offsetWidth) / 2);
        document.getElementsByClassName("canvas-container")[0].style.marginLeft = ((document.getElementsByClassName("canvas-container")[0].offsetWidth * (zoom_value / 100)) - document.getElementsByClassName("canvas-container")[0].offsetWidth + (document.getElementsByClassName("canvas-container")[0].offsetLeft * 2) / 2) - (document.getElementsByClassName("canvas-container")[0].offsetLeft * 2) + "px";
        document.getElementsByClassName("canvas-container")[0].style.paddingRight = "20px";
    } else {
        document.getElementsByClassName("canvas-container")[0].style.paddingRight = "0px";
        document.getElementsByClassName("canvas-container")[0].style.marginLeft = "auto";
    }
    if (document.getElementsByClassName("canvas-container")[0].offsetHeight * (zoom_value / 100) > document.getElementById("canvas-area").offsetHeight) {
        document.getElementById("canvas-area").scrollTop = (-1) * (document.getElementsByClassName("canvas-container")[0].offsetTop - ((document.getElementsByClassName("canvas-container")[0].offsetHeight * (zoom_value / 100)) - document.getElementsByClassName("canvas-container")[0].offsetWidth) / 2);
        document.getElementsByClassName("canvas-container")[0].style.marginTop = ((document.getElementsByClassName("canvas-container")[0].offsetHeight * (zoom_value / 100)) - document.getElementsByClassName("canvas-container")[0].offsetHeight + (document.getElementsByClassName("canvas-container")[0].offsetTop * 2) / 2) - (document.getElementsByClassName("canvas-container")[0].offsetTop * 2) + "px";
        document.getElementsByClassName("canvas-container")[0].style.paddingBottom = "20px";
    } else {
        document.getElementsByClassName("canvas-container")[0].style.paddingBottom = "0px";
        document.getElementsByClassName("canvas-container")[0].style.marginTop = "0px";
    }
}
// Show alignment guides
function centerLines(evt) {
    if (activeguides) {
        const snapZone = 5;
        const obj_v = evt.target.left + (evt.target.get("width") * evt.target.scaleX) / 2;
        const obj_h = evt.target.top + (evt.target.get("height") * evt.target.scaleY) / 2;
        if (obj_v > canvas.width / 2 - snapZone && obj_v < canvas.width / 2 + snapZone) {
            line_h.opacity = 1;
            line_h.bringToFront();
            evt.target.set({
                left: canvas.width / 2 - (evt.target.get("width") * evt.target.scaleX) / 2
            }).setCoords();
        } else {
            line_h.opacity = 0;
        }
        if (obj_h > canvas.height / 2 - snapZone && obj_h < canvas.height / 2 + snapZone) {
            line_v.opacity = 1;
            line_v.bringToFront();
            evt.target.set({
                top: canvas.height / 2 - (evt.target.get("height") * evt.target.scaleY) / 2
            }).setCoords();
        } else {
            line_v.opacity = 0;
        }
    }
}
// Hide alignment guides
function hideLines() {
    line_h.opacity = 0;
    line_v.opacity = 0;
}
// Add a new image
document.getElementById('newimage').onchange = function handleImage(e) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function() {
                var image = new fabric.Image(imgObj, {
                    angle: 0,
                    padding: 10,
                    cornersize: 10,
                    borderColor: '#0E98FC',
                    cornerColor: '#0E98FC',
                    centeredScaling: true,
                    borderOpacityWhenMoving: 1,
                    hasRotationPoint: false,
                    transparentCorners: false,
                    lockScalingFlip: true,
                    uniScaleTransform: true
                });
                image.setControlsVisibility({
                    bl: true,
                    br: true,
                    tl: true,
                    tr: true,
                    mb: false,
                    ml: false,
                    mr: false,
                    mt: false,
                    mtr: false,
                });
                var imgRatio = image.height / image.width;
                var maxWidth = canvas.width;
                var maxHeight = canvas.height;
                if (image.width >= maxWidth) {
                    image.scaleToWidth(maxWidth);
                }
                canvas.add(image);
                canvas.setActiveObject(image);
                canvas.renderAll();
                document.getElementById('newimage').value = '';
            }
        }
        reader.readAsDataURL(e.target.files[0]);
    }
// Set text properties
function setBold() {
    if (canvas.getActiveObject().get("fontWeight") == "800") {
        canvas.getActiveObject().set("fontWeight", "normal");
        document.getElementById("set-bold").classList.add("unset");
    } else {
        canvas.getActiveObject().set("fontWeight", "800");
        document.getElementById("set-bold").classList.remove("unset");
    }
}
function setItalic() {
    if (canvas.getActiveObject().get("fontStyle") == "italic") {
        canvas.getActiveObject().set("fontStyle", "normal");
        document.getElementById("set-italic").classList.add("unset");
    } else {
        canvas.getActiveObject().set("fontStyle", "italic");
        document.getElementById("set-italic").classList.remove("unset");
    }
}
function setUnder() {
    if (canvas.getActiveObject().get("underline") == true) {
        canvas.getActiveObject().set("underline", false);
        document.getElementById("set-under").classList.add("unset");
    } else {
        canvas.getActiveObject().set("underline", true);
        document.getElementById("set-under").classList.remove("unset");
    }
}
// Align text
function alignText(align) {
    if (align == "left") {
        if (canvas.getActiveObject().get("textAlign") != "left") {
            canvas.getActiveObject().set("textAlign", "left");
            var divs = document.querySelectorAll('.align-options');
            for (var i = 0; i < divs.length; i++) {
                divs[i].classList.add('unset');
            }
            document.getElementById("align-left").querySelector("img").classList.remove("unset");
        }
    } else if (align == "center") {
        if (canvas.getActiveObject().get("textAlign") != "center") {
            canvas.getActiveObject().set("textAlign", "center");
            var divs = document.querySelectorAll('.align-options');
            for (var i = 0; i < divs.length; i++) {
                divs[i].classList.add('unset');
            }
            document.getElementById("align-center").querySelector("img").classList.remove("unset");
        }
    } else if (align == "right") {
        if (canvas.getActiveObject().get("textAlign") != "right") {
            canvas.getActiveObject().set("textAlign", "right");
            var divs = document.querySelectorAll('.align-options');
            for (var i = 0; i < divs.length; i++) {
                divs[i].classList.add('unset');
            }
            document.getElementById("align-right").querySelector("img").classList.remove("unset");
        }
    }
}
// Resize canvas
function canvasResize() {
    var zoom_value = parseInt(document.getElementById("zoom-perc").querySelector("input").value);
    canvas.setDimensions({
        width: document.getElementById("size-w").querySelector("input").value / 2,
        height: document.getElementById("size-h").querySelector("input").value / 2
    });
    if (canvas.width > document.getElementById("canvas-area").offsetWidth) {
        if (!document.getElementsByClassName("canvas-container")[0].classList.contains("cutoff")) {
            document.getElementsByClassName("canvas-container")[0].classList.add("cutoff");
        }
        document.getElementsByClassName("canvas-container")[0].style.left = 20;
        if (canvas.height < document.getElementById("canvas-area").offsetHeight) {
            document.getElementsByClassName("canvas-container")[0].style.top = "calc(50% - " + canvas.height / 2 + "px)";
        }
    }
    if (canvas.height > document.getElementById("canvas-area").offsetHeight) {
        if (!document.getElementsByClassName("canvas-container")[0].classList.contains("cutoff")) {
            document.getElementsByClassName("canvas-container")[0].classList.add("cutoff");
        }
        document.getElementsByClassName("canvas-container")[0].style.top = 20;
        if (canvas.width < document.getElementById("canvas-area").offsetWidth) {
            document.getElementsByClassName("canvas-container")[0].style.right = "0px";
        }
    }
    if (canvas.height < document.getElementById("canvas-area").offsetHeight && canvas.width < document.getElementById("canvas-area").offsetWidth) {
        if (document.getElementsByClassName("canvas-container")[0].classList.contains("cutoff")) {
            document.getElementsByClassName("canvas-container")[0].classList.remove("cutoff");
            document.getElementsByClassName("canvas-container")[0].style.top = 0;
            document.getElementsByClassName("canvas-container")[0].style.left = 0;
        }
    }
    if (document.getElementsByClassName("canvas-container")[0].offsetWidth * (zoom_value / 100) > document.getElementById("canvas-area").offsetWidth) {
        document.getElementById("canvas-area").scrollLeft = (-1) * (document.getElementsByClassName("canvas-container")[0].offsetLeft - ((document.getElementsByClassName("canvas-container")[0].offsetWidth * (zoom_value / 100)) - document.getElementsByClassName("canvas-container")[0].offsetWidth) / 2);
        document.getElementsByClassName("canvas-container")[0].style.marginLeft = ((document.getElementsByClassName("canvas-container")[0].offsetWidth * (zoom_value / 100)) - document.getElementsByClassName("canvas-container")[0].offsetWidth + (document.getElementsByClassName("canvas-container")[0].offsetLeft * 2) / 2) - (document.getElementsByClassName("canvas-container")[0].offsetLeft * 2) + "px";
        document.getElementsByClassName("canvas-container")[0].style.paddingRight = "20px";
    } else {
        document.getElementsByClassName("canvas-container")[0].style.paddingRight = "0px";
        document.getElementsByClassName("canvas-container")[0].style.marginLeft = "auto";
    }
    if (document.getElementsByClassName("canvas-container")[0].offsetHeight * (zoom_value / 100) > document.getElementById("canvas-area").offsetHeight) {
        document.getElementById("canvas-area").scrollTop = (-1) * (document.getElementsByClassName("canvas-container")[0].offsetTop - ((document.getElementsByClassName("canvas-container")[0].offsetHeight * (zoom_value / 100)) - document.getElementsByClassName("canvas-container")[0].offsetWidth) / 2);
        document.getElementsByClassName("canvas-container")[0].style.marginTop = ((document.getElementsByClassName("canvas-container")[0].offsetHeight * (zoom_value / 100)) - document.getElementsByClassName("canvas-container")[0].offsetHeight + (document.getElementsByClassName("canvas-container")[0].offsetTop * 2) / 2) - (document.getElementsByClassName("canvas-container")[0].offsetTop * 2) + "px";
        document.getElementsByClassName("canvas-container")[0].style.paddingBottom = "20px";
    } else {
        document.getElementsByClassName("canvas-container")[0].style.paddingBottom = "0px";
        document.getElementsByClassName("canvas-container")[0].style.marginTop = "0px";
    }
    line_v.top = canvas.height/2;
    line_h.left = canvas.width/2;
    line_v.width = canvas.width;
    line_h.height = canvas.height;
    canvas.renderAll();
}
// Change canvas dimensions (preset)
function canvasPreset(data) {
    if (data == "twitter") {
        document.getElementById("size-w").querySelector("input").value = 1280;
        document.getElementById("size-h").querySelector("input").value = 1024;
    } else if (data == "dribbble") {
        document.getElementById("size-w").querySelector("input").value = 800;
        document.getElementById("size-h").querySelector("input").value = 600;
    } else if (data == "fb") {
        document.getElementById("size-w").querySelector("input").value = 1024;
        document.getElementById("size-h").querySelector("input").value = 512;
    } else if (data == "linkedin") {
        document.getElementById("size-w").querySelector("input").value = 1040;
        document.getElementById("size-h").querySelector("input").value = 640;
    } else if (data == "ig-post") {
        document.getElementById("size-w").querySelector("input").value = 600;
        document.getElementById("size-h").querySelector("input").value = 600;
    } else if (data == "ig-story") {
        document.getElementById("size-w").querySelector("input").value = 1080;
        document.getElementById("size-h").querySelector("input").value = 1920;
    } else if (data == "snap") {
        document.getElementById("size-w").querySelector("input").value = 1080;
        document.getElementById("size-h").querySelector("input").value = 1920;
    }
    canvasResize();
}
// Change device
function deviceSelect(data) {
    var imgInstance = canvas.getItemByName('mockup');
    var newimage = document.createElement('img');
    if (data == "macbook pro space gray") {
        newimage.src = "assets/macbookprosg.png";
        document.getElementById("panel").appendChild(newimage);
        imgInstance.setSrc("assets/macbookprosg.png", function() {
            canvas.renderAll();
            imgInstance.set({
                scaleX: 1,
                scaleY: 1,
                height: newimage.offsetHeight
            });
            imgInstance.set('left', 0);
            imgInstance.set('top', 0);
            imgInstance.setCoords();
            canvas.setActiveObject(imgInstance);
            imgInstance.scaleToWidth(200);
            canvas.renderAll();
            updateScreen();
            newimage.className = "tempimg";
        });
    }
    if (data == "iphone 11 pro space gray") {
        newimage.src = "assets/iphone11prosg.png";
        document.getElementById("panel").appendChild(newimage);
        imgInstance.setSrc("assets/iphone11prosg.png", function() {
            canvas.renderAll();
            imgInstance.set({
                scaleX: 1,
                scaleY: 1,
                height: newimage.offsetHeight
            });
            imgInstance.set('left', 0);
            imgInstance.set('top', 0);
            imgInstance.setCoords();
            canvas.setActiveObject(imgInstance);
            imgInstance.scaleToWidth(200);
            canvas.renderAll();
            updateScreen();
            newimage.className = "tempimg";
        });
    }
    if (data == "macbook pro silver") {
        newimage.src = "assets/macbookprosilver.png";
        document.getElementById("panel").appendChild(newimage);
        imgInstance.setSrc("assets/macbookprosilver.png", function() {
            canvas.renderAll();
            imgInstance.set({
                scaleX: 1,
                scaleY: 1,
                height: newimage.offsetHeight
            });
            imgInstance.set('left', 0);
            imgInstance.set('top', 0);
            imgInstance.setCoords();
            canvas.setActiveObject(imgInstance);
            imgInstance.scaleToWidth(200);
            canvas.renderAll();
            updateScreen();
            newimage.className = "tempimg";
        });
    }
    if (data == "apple imac") {
        newimage.src = "assets/appleimac.png";
        document.getElementById("panel").appendChild(newimage);
        imgInstance.setSrc("assets/appleimac.png", function() {
            canvas.renderAll();
            imgInstance.set({
                scaleX: 1,
                scaleY: 1,
                height: newimage.offsetHeight
            });
            imgInstance.set('left', 0);
            imgInstance.set('top', 0);
            imgInstance.setCoords();
            canvas.setActiveObject(imgInstance);
            imgInstance.scaleToWidth(200);
            canvas.renderAll();
            updateScreen();
            newimage.className = "tempimg";
        });
    }
    if (data == "ipad space gray") {
        newimage.src = "assets/appleipadsg.png";
        document.getElementById("panel").appendChild(newimage);
        imgInstance.setSrc("assets/appleipadsg.png", function() {
            canvas.renderAll();
            imgInstance.set({
                scaleX: 1,
                scaleY: 1,
                height: newimage.offsetHeight
            });
            imgInstance.set('left', 0);
            imgInstance.set('top', 0);
            imgInstance.setCoords();
            canvas.setActiveObject(imgInstance);
            imgInstance.scaleToWidth(200);
            canvas.renderAll();
            updateScreen();
            newimage.className = "tempimg";
        });
    }
    if (data == "ipad silver") {
        newimage.src = "assets/appleipadsilver.png";
        document.getElementById("panel").appendChild(newimage);
        imgInstance.setSrc("assets/appleipadsilver.png", function() {
            canvas.renderAll();
            imgInstance.set({
                scaleX: 1,
                scaleY: 1,
                height: newimage.offsetHeight
            });
            imgInstance.set('left', 0);
            imgInstance.set('top', 0);
            imgInstance.setCoords();
            canvas.setActiveObject(imgInstance);
            imgInstance.scaleToWidth(200);
            canvas.renderAll();
            updateScreen();
            newimage.className = "tempimg";
        });
    }
    if (data == "ipad gold") {
        newimage.src = "assets/appleipadgold.png";
        document.getElementById("panel").appendChild(newimage);
        imgInstance.setSrc("assets/appleipadgold.png", function() {
            canvas.renderAll();
            imgInstance.set({
                scaleX: 1,
                scaleY: 1,
                height: newimage.offsetHeight
            });
            imgInstance.set('left', 0);
            imgInstance.set('top', 0);
            imgInstance.setCoords();
            canvas.setActiveObject(imgInstance);
            imgInstance.scaleToWidth(200);
            canvas.renderAll();
            updateScreen();
            newimage.className = "tempimg";
        });
    }
    if (data == "dell xps 15") {
        newimage.src = "assets/dellxps15.png";
        document.getElementById("panel").appendChild(newimage);
        imgInstance.setSrc("assets/dellxps15.png", function() {
            canvas.renderAll();
            imgInstance.set({
                scaleX: 1,
                scaleY: 1,
                height: newimage.offsetHeight
            });
            imgInstance.set('left', 0);
            imgInstance.set('top', 0);
            imgInstance.setCoords();
            canvas.setActiveObject(imgInstance);
            imgInstance.scaleToWidth(200);
            canvas.renderAll();
            updateScreen();
            newimage.className = "tempimg";
        });
    }
    if (data == "google pixel 4") {
        newimage.src = "assets/googlepixel4.png";
        document.getElementById("panel").appendChild(newimage);
        imgInstance.setSrc("assets/googlepixel4.png", function() {
            canvas.renderAll();
            imgInstance.set({
                scaleX: 1,
                scaleY: 1,
                height: newimage.offsetHeight
            });
            imgInstance.set('left', 0);
            imgInstance.set('top', 0);
            imgInstance.setCoords();
            canvas.setActiveObject(imgInstance);
            imgInstance.scaleToWidth(200);
            canvas.renderAll();
            updateScreen();
            newimage.className = "tempimg";
        });
    }
    if (data == "huawei p8 black") {
        newimage.src = "assets/huaweip8black.png";
        document.getElementById("panel").appendChild(newimage);
        imgInstance.setSrc("assets/huaweip8black.png", function() {
            canvas.renderAll();
            imgInstance.set({
                scaleX: 1,
                scaleY: 1,
                height: newimage.offsetHeight
            });
            imgInstance.set('left', 0);
            imgInstance.set('top', 0);
            imgInstance.setCoords();
            canvas.setActiveObject(imgInstance);
            imgInstance.scaleToWidth(200);
            canvas.renderAll();
            updateScreen();
            newimage.className = "tempimg";
        });
    }
    if (data == "huawei p8 white") {
        newimage.src = "assets/huaweip8white.png";
        document.getElementById("panel").appendChild(newimage);
        imgInstance.setSrc("assets/huaweip8white.png", function() {
            canvas.renderAll();
            imgInstance.set({
                scaleX: 1,
                scaleY: 1,
                height: newimage.offsetHeight
            });
            imgInstance.set('left', 0);
            imgInstance.set('top', 0);
            imgInstance.setCoords();
            canvas.setActiveObject(imgInstance);
            imgInstance.scaleToWidth(200);
            canvas.renderAll();
            updateScreen();
            newimage.className = "tempimg";
        });
    }
    if (data == "microsoft surface book") {
        newimage.src = "assets/microsoftsurfacebook.png";
        document.getElementById("panel").appendChild(newimage);
        imgInstance.setSrc("assets/microsoftsurfacebook.png", function() {
            canvas.renderAll();
            imgInstance.set({
                scaleX: 1,
                scaleY: 1,
                height: newimage.offsetHeight
            });
            imgInstance.set('left', 0);
            imgInstance.set('top', 0);
            imgInstance.setCoords();
            canvas.setActiveObject(imgInstance);
            imgInstance.scaleToWidth(200);
            canvas.renderAll();
            updateScreen();
            newimage.className = "tempimg";
        });
    }
    if (data == "samsung galaxy note 10") {
        newimage.src = "assets/samsunggalaxynote10.png";
        document.getElementById("panel").appendChild(newimage);
        imgInstance.setSrc("assets/samsunggalaxynote10.png", function() {
            canvas.renderAll();
            imgInstance.set({
                scaleX: 1,
                scaleY: 1,
                height: newimage.offsetHeight
            });
            imgInstance.set('left', 0);
            imgInstance.set('top', 0);
            imgInstance.setCoords();
            canvas.setActiveObject(imgInstance);
            imgInstance.scaleToWidth(200);
            canvas.renderAll();
            updateScreen();
            newimage.className = "tempimg";
        });
    }
    if (data == "apple watch black") {
        newimage.src = "assets/applewatchblack.png";
        document.getElementById("panel").appendChild(newimage);
        imgInstance.setSrc("assets/applewatchblack.png", function() {
            canvas.renderAll();
            imgInstance.set({
                scaleX: 1,
                scaleY: 1,
                height: newimage.offsetHeight
            });
            imgInstance.set('left', 0);
            imgInstance.set('top', 0);
            imgInstance.setCoords();
            canvas.setActiveObject(imgInstance);
            imgInstance.scaleToWidth(200);
            canvas.renderAll();
            updateScreen();
            newimage.className = "tempimg";
        });
    }
    if (data == "apple watch rose gold") {
        newimage.src = "assets/applewatchrosegold.png";
        document.getElementById("panel").appendChild(newimage);
        imgInstance.setSrc("assets/applewatchrosegold.png", function() {
            canvas.renderAll();
            imgInstance.set({
                scaleX: 1,
                scaleY: 1,
                height: newimage.offsetHeight
            });
            imgInstance.set('left', 0);
            imgInstance.set('top', 0);
            imgInstance.setCoords();
            canvas.setActiveObject(imgInstance);
            imgInstance.scaleToWidth(200);
            canvas.renderAll();
            updateScreen();
            newimage.className = "tempimg";
        });
    }
    if (data == "apple watch white") {
        newimage.src = "assets/applewatchwhite.png";
        document.getElementById("panel").appendChild(newimage);
        imgInstance.setSrc("assets/applewatchwhite.png", function() {
            canvas.renderAll();
            imgInstance.set({
                scaleX: 1,
                scaleY: 1,
                height: newimage.offsetHeight
            });
            imgInstance.set('left', 0);
            imgInstance.set('top', 0);
            imgInstance.setCoords();
            canvas.setActiveObject(imgInstance);
            imgInstance.scaleToWidth(200);
            canvas.renderAll();
            updateScreen();
            newimage.className = "tempimg";
        });
    }
    if (data == "dell ultrasharp monitor") {
        newimage.src = "assets/dellultrasharpmonitor.png";
        document.getElementById("panel").appendChild(newimage);
        imgInstance.setSrc("assets/dellultrasharpmonitor.png", function() {
            canvas.renderAll();
            imgInstance.set({
                scaleX: 1,
                scaleY: 1,
                height: newimage.offsetHeight
            });
            imgInstance.set('left', 0);
            imgInstance.set('top', 0);
            imgInstance.setCoords();
            canvas.setActiveObject(imgInstance);
            imgInstance.scaleToWidth(200);
            canvas.renderAll();
            updateScreen();
            newimage.className = "tempimg";
        });
    }
    if (data == "iphone 8") {
        newimage.src = "assets/appleiphone8.png";
        document.getElementById("panel").appendChild(newimage);
        imgInstance.setSrc("assets/appleiphone8.png", function() {
            canvas.renderAll();
            imgInstance.set({
                scaleX: 1,
                scaleY: 1,
                height: newimage.offsetHeight
            });
            imgInstance.set('left', 0);
            imgInstance.set('top', 0);
            imgInstance.setCoords();
            canvas.setActiveObject(imgInstance);
            imgInstance.scaleToWidth(200);
            canvas.renderAll();
            updateScreen();
            newimage.className = "tempimg";
        });
    }
    current_device = data;
}
// Update screen (after changing the device)
function updateScreen() {
    var imgInstance = canvas.getItemByName('mockup')
    if (current_device == "iphone 11 pro space gray") {
        device_margin = mockup_margin.iphone11prosg;
    } else if (current_device == "macbook pro space gray") {
        device_margin = mockup_margin.macbookprosg;
    } else if (current_device == "macbook pro silver") {
        device_margin = mockup_margin.macbookprosilver;
    } else if (current_device == "apple imac") {
        device_margin = mockup_margin.appleimac;
    } else if (current_device == "ipad space gray") {
        device_margin = mockup_margin.ipadspacegray;
    } else if (current_device == "ipad silver") {
        device_margin = mockup_margin.ipadsilver;
    } else if (current_device == "ipad gold") {
        device_margin = mockup_margin.ipadgold
    } else if (current_device == "dell xps 15") {
        device_margin = mockup_margin.dellxps15;
    } else if (current_device == "google pixel 4") {
        device_margin = mockup_margin.googlepixel4;
    } else if (current_device == "huawei p8 black") {
        device_margin = mockup_margin.huaweip8black;
    } else if (current_device == "huawei p8 white") {
        device_margin = mockup_margin.huaweip8white;
    } else if (current_device == "microsoft surface book") {
        device_margin = mockup_margin.microsoftsurfacebook;
    } else if (current_device == "samsung galaxy note 10") {
        device_margin = mockup_margin.samsunggalaxynote10;
    } else if (current_device == "apple watch black") {
        device_margin = mockup_margin.applewatchblack;
    } else if (current_device == "apple watch rose gold") {
        device_margin = mockup_margin.applewatchrosegold;
    } else if (current_device == "apple watch white") {
        device_margin = mockup_margin.applewatchwhite;
    } else if (current_device == "dell ultrasharp monitor") {
        device_margin = mockup_margin.dellultrasharpmonitor;
    } else if (current_device == "iphone 8") {
        device_margin = mockup_margin.iphone8;
    }
    if (current_device == "macbook pro space gray" || current_device == "macbook pro silver" || current_device == "microsoft surface book" || current_device == "dell xps 15" || current_device == "apple imac" || current_device == "dell ultrasharp monitor") {
        imgInstance.scaleToWidth(400);
    } else {
        imgInstance.scaleToWidth(230);
    }
    imgInstance.center();
    var mockup_x = imgInstance.get('left');
    var mockup_y = imgInstance.get('top');
    var mockup_width = imgInstance.width * imgInstance.scaleX;
    var mockup_height = imgInstance.height * imgInstance.scaleY;
    offset_footage.x = mockup_x + (((mockup_width) / 100) * device_margin.left);
    offset_footage.y = mockup_y + (((mockup_height) / 100) * device_margin.top);
    offset_footage.width = (mockup_width) - ((mockup_width) / 100) * device_margin.right;
    offset_footage.height = (mockup_height) - ((mockup_height) / 100) * (device_margin.bottom);

    var video = canvas.getItemByName('video');
    canvas.getItemByName('video').set({
        left: offset_footage.x,
        top: offset_footage.y,
        scaleX: offset_footage.width/video.width,
        scaleY: offset_footage.height/video.height,
    });
    
}
// Change the color of the background
function canvasChangeColor(rgba) {
    canvas.backgroundColor = rgba;
}
// Change the text color
function textChangeColor(rgba) {
    canvas.getActiveObject().set({
        fill: rgba
    });
}
// Record canvas
var interval, setting_apply;
function recordCanvas(setting) {
    setting_apply = setting;
    canvas.getItemByName('video')._originalElement.currentTime = 0;
    recorder.start();
    if (videolength > canvas.getItemByName('video')._originalElement.duration) {
        window.setTimeout(function() {
            canvas.getItemByName('video')._originalElement.pause();
            window.setTimeout(waitEnd, (videolength * 1000) - (canvas.getItemByName('video')._originalElement.duration * 1000))
        }, canvas.getItemByName('video')._originalElement.duration * 1000)
    } else {
        window.setTimeout(waitEnd, videolength * 1000)
    }
}
// Stop recording and download
function waitEnd() {
    clearInterval(interval);
    recorder.stop();
    recorder.save('recording.webm', setting_apply);
    if (setting_apply != "webm") {
        document.getElementById("download-final").innerHTML = "Downloading...";
    }
    canvas.getItemByName('video')._originalElement.play();
}
// On scroll canvas (fix text & image pop ups)
document.getElementById("canvas-area").onscroll = function() {
    var text_options = document.getElementsByClassName("text-options")[0];
    var image_options = document.getElementsByClassName("image-options")[0];
    if (text_active) {
        var scaleX = document.getElementById("canvas").getBoundingClientRect().width / document.getElementById("canvas").offsetWidth;
        var scaleY = document.getElementById("canvas").getBoundingClientRect().height / document.getElementById("canvas").offsetHeight;
        text_options.style.left = (selected_text.get('left') * scaleX) + document.getElementById("canvas").getBoundingClientRect().left + ((selected_text.get('width') * selected_text.scaleX * scaleX) / 2) - (text_options.getBoundingClientRect().width / 2);
        text_options.style.top = (selected_text.get('top') * scaleY) + document.getElementById("canvas").getBoundingClientRect().top - 70;
    }
    if (image_active) {
        var scaleX = document.getElementById("canvas").getBoundingClientRect().width / document.getElementById("canvas").offsetWidth;
        var scaleY = document.getElementById("canvas").getBoundingClientRect().height / document.getElementById("canvas").offsetHeight;
        image_options.style.left = (selected_image.get('left') * scaleX) + document.getElementById("canvas").getBoundingClientRect().left + ((selected_image.get('width') * selected_image.scaleX * scaleX) / 2) - (image_options.getBoundingClientRect().width / 2);
        image_options.style.top = (selected_image.get('top') * scaleY) + document.getElementById("canvas").getBoundingClientRect().top - 70;
    }
}
// Text tool from the toolbar
function toggleText(toggle) {
    activetext = toggle;
    if (activetext) {
        canvas.defaultCursor = "text";
        canvas.hoverCursor = "text";
        document.body.style.cursor = 'text';
    }
}
// Create a new textbox (with the text tool)
canvas.on('mouse:down', function(options) {
    if (activetext) {
        newTextbox(options.e.layerX, options.e.layerY);
        var ico = document.getElementsByClassName("tool-active")[0].getElementsByTagName("svg")[0].getElementsByTagName("path")
        for (i = 0; i < ico.length; i++) {
            ico[i].style.stroke = "rgb(136, 145, 175)";
        }
        document.getElementsByClassName("tool-active")[0].classList.remove("tool-active");
        document.getElementsByClassName("cursor")[0].classList.add("tool-active");
        var ico = document.getElementsByClassName("tool-active")[0].getElementsByTagName("svg")[0].getElementsByTagName("path")
        for (i = 0; i < ico.length; i++) {
            ico[i].style.stroke = "#FFF";
        }
        normalCursor();
        toggleText(false);
    }
});
// Zoom in or out (with the zoom tool)
document.getElementsByClassName("canvas-container")[0].addEventListener('click', function(e) {
    var zoom_value = parseInt(document.getElementById("zoom-perc").querySelector("input").value);
    if (activezoom && e.altKey) {
        document.body.style.cursor = 'zoom-out';
        if ((parseInt(document.getElementById("zoom-perc").querySelector("input").value) - 10) >= 1) {
            document.getElementById("zoom-perc").querySelector("input").value = parseInt(document.getElementById("zoom-perc").querySelector("input").value) - 10;
            document.getElementsByClassName("canvas-container")[0].setAttribute('style', "transform:scale(" + zoom_value / 100 + ")");
            document.getElementsByClassName("canvas-container")[0].style.transform = document.getElementsByClassName("canvas-container")[0].style.transform.replace(/scale\([0-9|\.]*\)/, 'scale(' + zoom_value / 100 + ')');
        }
    } else if (activezoom) {
        document.body.style.cursor = 'zoom-in';
        if (parseInt(document.getElementById("zoom-perc").querySelector("input").value) + 10 <= 200) {
            document.getElementById("zoom-perc").querySelector("input").value = parseInt(document.getElementById("zoom-perc").querySelector("input").value) + 10;
            document.getElementsByClassName("canvas-container")[0].setAttribute('style', "transform:scale(" + zoom_value / 100 + ")");
            document.getElementsByClassName("canvas-container")[0].style.transform = document.getElementsByClassName("canvas-container")[0].style.transform.replace(/scale\([0-9|\.]*\)/, 'scale(' + zoom_value / 100 + ')');
        }
    }
    if (document.getElementsByClassName("canvas-container")[0].offsetWidth * (zoom_value / 100) > document.getElementById("canvas-area").offsetWidth && activezoom) {
        document.getElementById("canvas-area").scrollLeft = (-1) * (document.getElementsByClassName("canvas-container")[0].offsetLeft - ((document.getElementsByClassName("canvas-container")[0].offsetWidth * (zoom_value / 100)) - document.getElementsByClassName("canvas-container")[0].offsetWidth) / 2);
        document.getElementsByClassName("canvas-container")[0].style.marginLeft = ((document.getElementsByClassName("canvas-container")[0].offsetWidth * (zoom_value / 100)) - document.getElementsByClassName("canvas-container")[0].offsetWidth + (document.getElementsByClassName("canvas-container")[0].offsetLeft * 2) / 2) - (document.getElementsByClassName("canvas-container")[0].offsetLeft * 2) + "px";
        document.getElementsByClassName("canvas-container")[0].style.paddingRight = "20px";
    } else {
        document.getElementsByClassName("canvas-container")[0].style.paddingRight = "0px";
        document.getElementsByClassName("canvas-container")[0].style.marginLeft = "auto";
    }
    if (document.getElementsByClassName("canvas-container")[0].offsetHeight * (zoom_value / 100) > document.getElementById("canvas-area").offsetHeight && activezoom) {
        document.getElementById("canvas-area").scrollTop = (-1) * (document.getElementsByClassName("canvas-container")[0].offsetTop - ((document.getElementsByClassName("canvas-container")[0].offsetHeight * (zoom_value / 100)) - document.getElementsByClassName("canvas-container")[0].offsetWidth) / 2);
        document.getElementsByClassName("canvas-container")[0].style.marginTop = ((document.getElementsByClassName("canvas-container")[0].offsetHeight * (zoom_value / 100)) - document.getElementsByClassName("canvas-container")[0].offsetHeight + (document.getElementsByClassName("canvas-container")[0].offsetTop * 2) / 2) - (document.getElementsByClassName("canvas-container")[0].offsetTop * 2) + "px";
        document.getElementsByClassName("canvas-container")[0].style.paddingBottom = "20px";
    } else {
        document.getElementsByClassName("canvas-container")[0].style.paddingBottom = "0px";
        document.getElementsByClassName("canvas-container")[0].style.marginTop = "0px";
    }
    slider.setValue(parseInt(document.getElementById("zoom-perc").querySelector("input").value));
});
// Detect key presses (for zooming in/out)
document.addEventListener("keydown", function(e) {
    if (activezoom && e.altKey) {
        document.getElementsByClassName("upper-canvas")[0].style.cursor = "zoom-out";
        canvas.allowTouchScrolling = false;
        canvas.defaultCursor = "zoom-out";
        canvas.hoverCursor = "zoom-out";
        document.body.style.cursor = 'zoom-out';
        canvas.renderAll();
    }
});
document.addEventListener("keyup", function(e) {
    if (activezoom) {
        document.getElementsByClassName("upper-canvas")[0].style.cursor = "zoom-in";
        canvas.defaultCursor = "zoom-in";
        canvas.hoverCursor = "zoom-in";
        document.body.style.cursor = 'zoom-in';
        canvas.renderAll();
        canvas.calcOffset();
    }
});
// Zoom tool from the toolbar
function canvasZoom(toggle) {
    activezoom = toggle;
    if (activezoom) {
        canvas.defaultCursor = "zoom-in";
        canvas.hoverCursor = "zoom-in";
        document.body.style.cursor = 'zoom-in';
        canvas.renderAll();
        canvas.interactive = false;
    } else {
        canvas.interactive = true;
    }
}
// Reset cursor
function normalCursor() {
    canvas.defaultCursor = "auto";
    canvas.hoverCursor = "default";
    document.body.style.cursor = 'default';
}
// Enable/disable alignment guides
function activeGuides() {
    if (document.getElementsByClassName("magic-checkbox")[0].checked) {
        activeguides = true;
    } else {
        activeguides = false;
    }
}
// Change the exportable time
function setTime() {
    document.getElementById("video-length").getElementsByTagName("input")[0].value = canvas.getItemByName('video')._originalElement.duration.toFixed(2);
    videolength = canvas.getItemByName('video')._originalElement.duration;
}
