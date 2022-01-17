var source, currenttype, scr, oImg, clip, actual;
var shadow = false;
var uid;
var animating = false;
var group = false;
var rearranging = false;
var spaceDown = false;
var start = false;
var recording = false;
var downloadpopup = false;
var premiumuser = false;
var duration = 6000;
var instance, instance2, instance3, instance4
var ids = 1;
var cancelurl = "";
var updateurl = "";
var tool = "cursor";
var currentmockup = "iphone-13";
var mockups = [
  {src:"assets/mockups/macbook-16.png", thumb:"assets/mockups/macbook-16-thumb.png", pro:false, width:3072, height:1920, name:"macbook-16", label:"Macbook Pro Space Grey"},
  {src:"assets/mockups/macbook-16-silver.png", thumb:"assets/mockups/macbook-16-silver-thumb.png", pro:true, width:3072, height:1920, name:"macbook-16-silver", label:"Macbook Pro Silver"},
  {src:"assets/mockups/dell-xps-15.png", thumb:"assets/mockups/dell-xps-15-thumb.png", pro:false, width:2897, height:1630, name:"dell-xps-15", label:"Dell XPS 15"},
  {src:"assets/mockups/microsoft-surface-book.png", thumb:"assets/mockups/microsoft-surface-book-thumb.png", pro:false, width:3077, height:2052, name:"microsoft-surface-book", label:"Microsoft Surface Book"},
  {src:"assets/mockups/window-light.png", thumb:"assets/mockups/window-light-thumb.png", pro:false, width:2880, height:1800, name:"window-light", label:"Light window frame"},
  {src:"assets/mockups/window-dark.png", thumb:"assets/mockups/window-dark-thumb.png", pro:false, width:2880, height:1800, name:"window-dark", label:"Dark window frame"},
  {src:"assets/mockups/iphone-13.png", thumb:"assets/mockups/iphone-13-thumb.png", pro:false, width:1170, height:2532, name:"iphone-13", label:"iPhone 13 Midnight"},
  {src:"assets/mockups/iphone-13-red.png", thumb:"assets/mockups/iphone-13-red-thumb.png", pro:true, width:1170, height:2532, name:"iphone-13-red", label:"iPhone 13 Red"},
  {src:"assets/mockups/iphone-13-pink.png", thumb:"assets/mockups/iphone-13-pink-thumb.png", pro:true, width:1170, height:2532, name:"iphone-13-pink", label:"iPhone 13 Pink"},
  {src:"assets/mockups/iphone-13-blue.png", thumb:"assets/mockups/iphone-13-blue-thumb.png", pro:true, width:1170, height:2532, name:"iphone-13-blue", label:"iPhone 13 Blue"},
  {src:"assets/mockups/iphone-13-starlight.png", thumb:"assets/mockups/iphone-13-starlight-thumb.png", pro:true, width:1170, height:2532, name:"iphone-13-starlight", label:"iPhone 13 Starlight"},
  {src:"assets/mockups/google-pixel-5.png", thumb:"assets/mockups/google-pixel-5-thumb.png", pro:false, width:1082, height:2342, name:"google-pixel-5", label:"Google Pixel 5"},
  {src:"assets/mockups/samsung-galaxy-s21.png", thumb:"assets/mockups/samsung-galaxy-s21-thumb.png", pro:false, width:1440, height:3200, name:"samsung-galaxy-s1", label:"Samsung Galaxy S21"},
  {src:"assets/mockups/ipad-pro-13.png", thumb:"assets/mockups/ipad-pro-13-thumb.png", pro:true, width:2732, height:2048, name:"ipad-pro-13", label:"iPad Pro 13"},
  {src:"assets/mockups/ipad-pro-13-no-pencil.png", thumb:"assets/mockups/ipad-pro-13-no-pencil-thumb.png", pro:false, width:2732, height:2048, name:"ipad-pro-13-no-pencil", label:"iPad Pro 13 (no pencil)"},
  {src:"assets/mockups/google-pixel-slate.png", thumb:"assets/mockups/google-pixel-slate-thumb.png", pro:false, width:3000, height:2000, name:"google-pixel-slate", label:"Google Pixel Slate"},
  {src:"assets/mockups/surface-pro-x.png", thumb:"assets/mockups/surface-pro-x-thumb.png", pro:false, width:2880, height:1920, name:"surface-pro-x", label:"Surface Pro X"},
  {src:"assets/mockups/apple-thunderbolt.png", thumb:"assets/mockups/apple-thunderbolt-thumb.png", pro:false, width:2560, height:1440, name:"apple-thunderbolt", label:"Apple Thunderbolt"},
  {src:"assets/mockups/dell-ultrasharp.png", thumb:"assets/mockups/dell-ultrasharp-thumb.png", pro:false, width:2560, height:1440, name:"dell-ultrasharp", label:"Dell Ultrasharp"},
  {src:"assets/mockups/apple-pro-display-xdr.png", thumb:"assets/mockups/apple-pro-display-xdr-thumb.png", pro:false, width:3900, height:2195, name:"apple-pro-display-xdr", label:"Apple Pro Display XDR"},
  {src:"assets/mockups/apple-imac.png", thumb:"assets/mockups/apple-imac-thumb.png", pro:false, width:2560, height:1440, name:"apple-imac", label:"Apple iMac"},
  {src:"assets/mockups/apple-watch.png", thumb:"assets/mockups/apple-watch-thumb.png", pro:true, width:368, height:448, name:"apple-watch", label:"Apple Watch Pink Citrus"},
  {src:"assets/mockups/apple-watch-ginger.png", thumb:"assets/mockups/apple-watch-ginger-thumb.png", pro:true, width:368, height:448, name:"apple-watch-ginger", label:"Apple Watch Ginger"},
  {src:"assets/mockups/apple-watch-cyprus.png", thumb:"assets/mockups/apple-watch-cyprus-thumb.png", pro:true, width:368, height:448, name:"apple-watch-cyprus", label:"Apple Watch Cyprus"},
  {src:"assets/mockups/sony-smartwatch.png", thumb:"assets/mockups/sony-smartwatch-thumb.png", pro:true, width:320, height:320, name:"sony-smartwatch-cyprus", label:"Sony Smartwatch 3"},
];
var dimensions = [
  {name:"twitter-post", width:1200, height:675},
  {name:"twitter-banner", width:1500, height:500},
  {name:"instagram-square", width:1080, height:1080},
  {name:"instagram-portrait", width:1080, height:1350},
  {name:"instagram-landscape", width:1080, height:566},
  {name:"instagram-stories", width:1080, height:1920},
  {name:"facebook-post", width:1200, height:630},
  {name:"facebook-banner", width:1200, height:628},
  {name:"facebook-stories", width:1080, height:1920},
  {name:"linkedin-post", width:1200, height:627},
  {name:"linkedin-banner", width:1584, height:396},
  {name:"producthunt-thumbnail", width:600, height:600},
  {name:"producthunt-gallery", width:1270, height:760},
]
var fonts = [];
var objects = [];

// Get list of fonts
$.ajax({
  url: "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDqojr28KcwlR8sN-ITpGZlzayQyZXSc5w&sort=alpha",
  type: 'GET',
  dataType: 'json', // added data type
  success: function(response) {
    response.items.forEach(function(item){
       fonts.push(item.family);
    });
    fonts.forEach(function(font){
        $("#font-picker").append("<option class='option' value='"+font+"'>"+font+"</option>");
    });
    $("#font-picker").find(".option[value='Inter']").addClass("selected");
    $("#font-picker").niceSelect();
  }
});

// Initialize canvas
var canvas = new fabric.Canvas('canvas', {
    preserveObjectStacking: true,
    backgroundColor: "#FFF",
    stateful: true,
    uniScaleKey: "",
    selection: false
});
canvas.controlsAboveOverlay = true;
canvas.selection = false;
canvas.renderAll();


// Customize controls
fabric.Object.prototype.set({
    transparentCorners: false,
    borderColor: '#51B9F9',
    cornerColor: '#FFF',
    borderScaleFactor: 2.5,
    cornerStyle: 'circle',
    cornerStrokeColor: '#0E98FC',
    borderOpacityWhenMoving: 1
});

canvas.selectionColor = 'rgba(46, 115, 252, 0.11)';
canvas.selectionBorderColor = 'rgba(98, 155, 255, 0.81)';
canvas.selectionLineWidth = 1.5;

var img = document.createElement('img');
img.src = "assets/middlecontrol.svg";

var img2 = document.createElement('img');
img2.src = "assets/middlecontrolhoz.svg";

var img3 = document.createElement('img');
img3.src = "assets/edgecontrol.svg";

var img4 = document.createElement('img');
img4.src = "assets/rotateicon.svg";


function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    const wsize = 20;
    const hsize = 25;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(img, -wsize/2, -hsize/2, wsize, hsize);
    ctx.restore();
  }
function renderIconHoz(ctx, left, top, styleOverride, fabricObject) {
    const wsize = 25;
    const hsize = 20;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(img2, -wsize/2, -hsize/2, wsize, hsize);
    ctx.restore();
  }
function renderIconEdge(ctx, left, top, styleOverride, fabricObject) {
    const wsize = 25;
    const hsize = 25;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(img3, -wsize/2, -hsize/2, wsize, hsize);
    ctx.restore();
  }

function renderIconRotate(ctx, left, top, styleOverride, fabricObject) {
    const wsize = 40;
    const hsize = 40;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(img4, -wsize/2, -hsize/2, wsize, hsize);
    ctx.restore();
  }
    function resetControls(){
        fabric.Object.prototype.controls.ml = new fabric.Control({
            x: -0.5,
            y: 0,
            offsetX: -1,
            cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
            actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
            getActionName: fabric.controlsUtils.scaleOrSkewActionName,
            render: renderIcon
        });

        fabric.Object.prototype.controls.mr = new fabric.Control({
            x: 0.5,
            y: 0,
            offsetX: 1,
            cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
            actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
            getActionName: fabric.controlsUtils.scaleOrSkewActionName,
            render: renderIcon
        });

        fabric.Object.prototype.controls.mb = new fabric.Control({
            x: 0,
            y: 0.5,
            offsetY: 1,
            cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
            actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
            getActionName: fabric.controlsUtils.scaleOrSkewActionName,
            render: renderIconHoz
        });

        fabric.Object.prototype.controls.mt = new fabric.Control({
            x: 0,
            y: -0.5,
            offsetY: -1,
            cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
            actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
            getActionName: fabric.controlsUtils.scaleOrSkewActionName,
            render: renderIconHoz
        });

        fabric.Object.prototype.controls.tl = new fabric.Control({
            x: -0.5,
            y: -0.5,
            cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
            actionHandler: fabric.controlsUtils.scalingEqually,
            render: renderIconEdge
        });

        fabric.Object.prototype.controls.tr = new fabric.Control({
            x: 0.5,
            y: -0.5,
            cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
            actionHandler: fabric.controlsUtils.scalingEqually,
            render: renderIconEdge
        });

        fabric.Object.prototype.controls.bl = new fabric.Control({
            x: -0.5,
            y: 0.5,
            cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
            actionHandler: fabric.controlsUtils.scalingEqually,
            render: renderIconEdge
        });

        fabric.Object.prototype.controls.br = new fabric.Control({
            x: 0.5,
            y: 0.5,
            cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
            actionHandler: fabric.controlsUtils.scalingEqually,
            render: renderIconEdge
        });

        fabric.Object.prototype.controls.mtr = new fabric.Control({
            x: 0,
            y: 0.5,
            cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
            actionHandler: fabric.controlsUtils.rotationWithSnapping,
            offsetY: 30,
            withConnecton: false,
            actionName: 'rotate',
            render: renderIconRotate
        });
    }
    resetControls();
    var textBoxControls = fabric.Textbox.prototype.controls = { };

    textBoxControls.mtr = fabric.Object.prototype.controls.mtr;
    textBoxControls.tr = fabric.Object.prototype.controls.tr;
    textBoxControls.br = fabric.Object.prototype.controls.br;
    textBoxControls.tl = fabric.Object.prototype.controls.tl;
    textBoxControls.bl = fabric.Object.prototype.controls.bl;
    textBoxControls.mt = fabric.Object.prototype.controls.mt;
    textBoxControls.mb = fabric.Object.prototype.controls.mb;

textBoxControls.ml = new fabric.Control({
    x: -0.5,
    y: 0,
    offsetX: -1,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.changeWidth,
    actionName: 'resizing',
    render: renderIcon
});

textBoxControls.mr = new fabric.Control({
    x: 0.5,
    y: 0,
    offsetX: 1,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.changeWidth,
    actionName: 'resizing',
    render: renderIcon
});


// Get any object by ID
fabric.Canvas.prototype.getItemById = function(name) {
  var object = null,
      objects = this.getObjects();
  for (var i = 0, len = this.size(); i < len; i++) {
    if (objects[i].get("type") == "group") {
        if (objects[i].get("id") && objects[i].get("id") === name) {
            object = objects[i];
            break;
        }
        var wip = i;
        for (var o = 0; o < objects[i]._objects.length; o++) {
            if (objects[wip]._objects[o].id && objects[wip]._objects[o].id === name) {
              object = objects[wip]._objects[o];
              break;
            }
        }
    } else if (objects[i].id && objects[i].id === name) {
      object = objects[i];
      break;
    }
  }
  return object;
};

// Create the artboard
var a_width = 600;
var a_height = 500;
var artboard = new fabric.Rect({
    left: (canvas.get("width")/2)-(a_width/2),
    top: (canvas.get("height")/2)-(a_height/2),
    width: a_width,
    height: a_height,
    absolutePositioned: true,
    fill: "#FFF",
    hasControls: true,
    typeThing: "none",
    transparentCorners: false,
    borderColor: '#0E98FC',
    cornerColor: '#0E98FC',
    cursorWidth: 1,
    selectable: false,
    cursorDuration: 1,
    cursorDelay: 250,
    id: "artboard",
});
canvas.renderAll();

// Clip canvas to the artboard
canvas.clipPath = artboard;
canvas.renderAll();

var color1 = new fabric.Gradient({
  type: 'linear',
  gradientUnits: 'pixels', // or 'percentage'
  coords: { x1: 0, y1: a_height/2, x2: a_width, y2: 0 },
  colorStops:[
    { offset: 0, color: '#4158D0' },
    { offset: 0.46, color: '#C850C0'},
    { offset: 1, color: '#FFCC70'},
  ]
})

var color2 = new fabric.Gradient({
  type: 'linear',
  gradientUnits: 'pixels', // or 'percentage'
  coords: { x1: 0, y1: -a_height/2, x2: a_width, y2: (a_height/2+100) },
  colorStops:[
    { offset: 0, color: '#0093E9' },
    { offset: 1, color: '#80D0C7'},
  ]
})

var color3 = new fabric.Gradient({
  type: 'linear',
  gradientUnits: 'pixels', // or 'percentage'
  coords: { x1: 0, y1: a_height/2, x2: a_width, y2: 0 },
  colorStops:[
    { offset: 0, color: '#8EC5FC' },
    { offset: 1, color: '#E0C3FC'},
  ]
})

var color4 = new fabric.Gradient({
  type: 'linear',
  gradientUnits: 'pixels', // or 'percentage'
  coords: { x1: 0, y1: a_height/2, x2: a_width, y2: 0 },
  colorStops:[
    { offset: 0, color: '#FBAB7E' },
    { offset: 1, color: '#F7CE68'},
  ]
})

var color5 = new fabric.Gradient({
  type: 'linear',
  gradientUnits: 'pixels', // or 'percentage'
  coords: { x1: 0, y1: a_height/2, x2: a_width, y2: 0 },
  colorStops:[
    { offset: 0, color: '#21D4FD' },
    { offset: 1, color: '#B721FF'},
  ]
})

var color6 = new fabric.Gradient({
  type: 'linear',
  gradientUnits: 'pixels', // or 'percentage'
  coords: { x1: 0, y1: -a_height/2, x2: a_width, y2: a_height },
  colorStops:[
    { offset: 0, color: '#FFE53B' },
    { offset: .74, color: '#FF2525'},
  ]
})

var color7 = new fabric.Gradient({
  type: 'linear',
  gradientUnits: 'pixels', // or 'percentage'
  coords: { x1: 0, y1: a_height/2, x2: a_width, y2: 0 },
  colorStops:[
    { offset: 0, color: '#FBDA61' },
    { offset: 1, color: '#FF5ACD' },
  ]
})

var color8 = new fabric.Gradient({
  type: 'linear',
  gradientUnits: 'pixels', // or 'percentage'
  coords: { x1: a_width/2, y1:-a_height/2, x2: a_width/2, y2: a_height/2 },
  colorStops:[
    { offset: 0, color: '#A9C9FF' },
    { offset: 1, color: '#FFBBEC' },
  ]
})

var color9 = new fabric.Gradient({
  type: 'linear',
  gradientUnits: 'pixels', // or 'percentage'
  coords: { x1: a_width/2, y1:-a_height/2, x2: a_width/2, y2: a_height/2 },
  colorStops:[
    { offset: 0, color: '#7028e4' },
    { offset: 1, color: '#e5b2ca' },
  ]
})

var color10 = new fabric.Gradient({
  type: 'linear',
  gradientUnits: 'pixels', // or 'percentage'
  coords: { x1: a_width/2, y1:a_height/2, x2: a_width/2, y2: -a_height/2 },
  colorStops:[
    { offset: 0, color: '#50cc7f' },
    { offset: 1, color: '#f5d100' },
  ]
})

var color11 = new fabric.Gradient({
  type: 'linear',
  gradientUnits: 'pixels', // or 'percentage'
  coords: { x1: a_width/2, y1:a_height/2, x2: a_width/2, y2: -a_height/2 },
  colorStops:[
    { offset: 0, color: '#feada6' },
    { offset: 1, color: '#f5efef' },
  ]
})

var color12 = "#000";
var color13 = "#FFF";

artboard.set('fill', color1);
canvas.add(artboard);
canvas.renderAll();

// Initialize color picker (background)
var background_color = Pickr.create({
    el: '#background-color-pick',
    theme: 'nano',
    inline: true,
    appClass: 'backpicker',
    useAsButton: true,
    swatches: null,
    default: '#FFFFFF',
    showAlways: true,
    components: {
        preview: true,
        opacity: true,
        hue: true,
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

// Initialize color picker (text)
var text_color = Pickr.create({
    el: '#text-color',
    theme: 'nano',
    inline: true,
    appClass: 'textpicker',
    useAsButton: true,
    swatches: null,
    default: '#000000',
    showAlways: true,
    components: {
        preview: true,
        opacity: true,
        hue: true,
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


// Canvas recorder initialization
var canvasrecord = new fabric.Canvas('canvasrecord', {
    preserveObjectStacking: true,
    backgroundColor: "#FFF",
    width: artboard.width,
    height: artboard.height,
    selectable: false
});
canvasrecord.selection = false;
$("#canvasrecord").parent().css({pointerEvents:"none"});
