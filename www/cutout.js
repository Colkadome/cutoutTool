
$(function() {

    // INIT CANVAS //
    /////////////////

    // Initialize
    var canvas = document.getElementById("canvas1");
    var ctx = canvas.getContext("2d");

    // set canvas properties
    var WIDTH = 800;
    var HEIGHT = 600;
    canvas.style.width = WIDTH + "px";
    canvas.style.height = HEIGHT + "px";
    
    // Set properties for high DPI canvas (1 = regular, 2 = high)
    var DPI = 1;
    canvas.width = WIDTH * DPI;
    canvas.height = HEIGHT * DPI;

    // INIT PROGRAM //
    //////////////////

    // Object storage
    var ellipses = [];
    var points = [];
    var img = new Image();
    
    // Color data
    var colors = {
        line:"#FF0000",
        pC_A:"#00AACC",
        pB:"#00CC00"
    }

    // SERVER FUNCTIONS //
    //////////////////////

    // create an ellipse
    Shiny.addCustomMessageHandler("custom_addEllipses", function(m) {
        console.log("addEllipses");
        for (var i=0; i<m.length; i++) {
            // CHECK IF POINT OR ELLIPSE?
            createEllipse(m[i]);
        }
        updateParams();
    });

    // set the background image
    function setImage(src) {
        img.onload = function() {
            draw();                 // img.onload DOES NOT WORK ON FIREFOX OR SAFARI!!!
        }
        img.src = src;
    }
    Shiny.addCustomMessageHandler("custom_setImage", function(m) {
        console.log("setImage");
        setImage(m.src);
    });
    
    function updateShinyItems() {
        items = [];
        for (var i=0; i<ellipses.length; i++) {
            items.push(ellipses[i].getParams());
        }
        for (var i=0; i<points.length; i++) {
            items.push(points[i].getParams());
        }
        console.log( items);
        Shiny.onInputChange("items", items);
    }
    
    // ELLIPSE FUNCTIONS //
    ///////////////////////

    function createEllipse(params) {
        var ellipse = {};
        if (params == null) {
            // no params, a default ellipse is made
            ellipse.pC = {x:toIX(canvas.width/2),y:toIY(canvas.height/2)};
            ellipse.pA = {x:toIX((canvas.width/2) + 40),y:toIY(canvas.height/2)};
            ellipse.pB = {x:0,y:0};
            ellipse.radB = toIS(40);
        }
        else {
            // params were specified, use the params
            ellipse.pC = {x:params.centre.x, y:params.centre.y};
            ellipse.pA = {x:0,y:0}; // SET USING radA AND rot
            ellipse.pB = {x:0,y:0};
            ellipse.radB = 40;
        }
        ellipse.isSelected = false;

        ellipse.draw = function() {

            // set draw properties
            if(!this.isSelected) {
                ctx.globalAlpha = 0.8;
            }
            ctx.strokeStyle = colors.line;

            // Draw the ellipse
            ctx.beginPath();
            ctx.ellipse(toCX(this.pC.x),toCY(this.pC.y),toCS(this.getradA()),toCS(this.radB),this.getrot(),0,2*Math.PI);
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw radius line
            ctx.beginPath();
            ctx.moveTo(toCX(this.pC.x),toCY(this.pC.y));
            ctx.lineTo(toCX(this.pA.x),toCY(this.pA.y));
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw the squares
            var size = 8;
            drawSquare(toCX(this.pC.x),toCY(this.pC.y),size,colors.pC_A,2);
            drawSquare(toCX(this.pA.x),toCY(this.pA.y),size,colors.pC_A,2);
            drawSquare(toCX(this.pB.x),toCY(this.pB.y),size,colors.pB,2);
            
            // reset global alpha
            ctx.globalAlpha = 1.0;
        }
        ellipse.click = function(xM, yM) {

            var b = 12; // bounds
            o = this; // reference to self
            if(Math.abs(toCX(this.pC.x)-xM)<b && Math.abs(toCY(this.pC.y)-yM)<b) {
                switchEllipse(getEllipseIndex(this));
                return {drag:function(xM, yM, cX, cY) {
                            var ix = toIX(xM);
                            var iy = toIY(yM);
                            o.pA.x += ix - o.pC.x;
                            o.pA.y += iy - o.pC.y;
                            o.pC.x = ix;
                            o.pC.y = iy;
                            o.updatePB();
                        },
                        rel:function(mX, mY){},
                        up:function(mX, mY){}
                       };
            }
            if(Math.abs(toCX(this.pA.x)-xM)<b && Math.abs(toCY(this.pA.y)-yM)<b) {
                switchEllipse(getEllipseIndex(this));
                return {drag:function(xM, yM, cX, cY) {
                            o.pA.x = toIX(xM);
                            o.pA.y = toIY(yM);
                            o.updatePB();
                        },
                        rel:function(mX, mY){},
                        up:function(mX, mY){}
                       };
            }
            if(Math.abs(toCX(this.pB.x)-xM)<b && Math.abs(toCY(this.pB.y)-yM)<b) {
                switchEllipse(getEllipseIndex(this));
                return {drag:function(xM, yM, cX, cY) {
                            o.pB.x = toIX(xM);
                            o.pB.y = toIY(yM);
                            // update radius
                            o.radB = Math.sqrt(Math.pow(o.pC.x-o.pB.x,2)+Math.pow(o.pC.y-o.pB.y,2));
                        },
                        rel:function(mX, mY){
                            o.updatePB();
                        },
                        up:function(mX, mY){}
                       };
            }
            return null;
        }
        ellipse.updatePB = function() {
            var rot = Math.atan((this.pC.y-this.pA.y)/(this.pC.x-this.pA.x));
            this.pB.x = this.pC.x + (Math.sin(rot) * this.radB);
            this.pB.y = this.pC.y + (-Math.cos(rot) * this.radB);
        }
        ellipse.getradA = function() {
            return Math.sqrt(Math.pow(this.pC.x-this.pA.x, 2) + Math.pow(this.pC.y-this.pA.y, 2));
        }
        ellipse.getrot = function() {
            return Math.atan((this.pA.y-this.pC.y)/(this.pA.x-this.pC.x));
        }
        ellipse.getParams = function() {
            var params = {};
            params.x = this.pC.x;
            params.y = this.pC.y;
            params.radA = this.getradA();
            params.radB = this.radB;
            params.rot = this.getrot();
            return params;
        }
        ellipse.updatePB();
        $("#ellipse_list").append('<li>Ellipse</li>');
        ellipses.push(ellipse);
        addClickable(ellipse);
        switchEllipse(ellipses.length - 1);
        return ellipse;
    }
    
    function getEllipseIndex(o) {
        return ellipses.indexOf(o);
    }
    
    // select an ellipse of index i
    var lastSel_Ellipse = 0;
    function switchEllipse(i) {
        if(i >= 0 && i < ellipses.length) {
            deselectEllipse(lastSel_Ellipse);
            selectEllipse(i);
        }
    }
    function selectEllipse(i) {
        if(i >= 0 && i < ellipses.length) {
            $("#ellipse_list li").eq(i).css("background-color","#CCFFFF");
            ellipses[i].isSelected = true;
            lastSel_Ellipse = i;
        }
    }
    function deselectEllipse(i) {
        if(i >= 0 && i < ellipses.length) {
            $("#ellipse_list li").eq(i).css("background-color","none");
            ellipses[i].isSelected = false;
        }
    }
    function removeEllipse(i) {
        if(i >= 0 && i < ellipses.length) {
            $("#ellipse_list li").eq(i).remove();
            removeClickable(ellipses[i]);
            ellipses.splice(i, 1);
            if(i < ellipses.length) {
                selectEllipse(i);
            }
            else {
                selectEllipse(ellipses.length-1);
            }
        }
    }
    
    // POINT FUNCTIONS //
    /////////////////////
    
    function createPoint(params) {
        var point = {};
        if (params == null) {
            // no params, a default point is made
            point.pos = {x:toIX(canvas.width/2),y:toIY(canvas.height/2)};
        }
        else {
            // params were specified, use the params
            point.pos = {x:params.x, y:params.y};
        }
        point.isSelected = false;
        
        point.draw = function() {
            if(!this.isSelected) {
                ctx.globalAlpha = 0.8;
            }
            drawCross(toCX(this.pos.x),toCY(this.pos.y), 6, colors.line, 2);
            ctx.globalAlpha = 1.0;
        }
        point.click = function(xM, yM) {
            var b = 8; // bounds
            o = this; // reference to self
            if(Math.abs(toCX(this.pos.x)-xM)<b && Math.abs(toCY(this.pos.y)-yM)<b) {
                switchPoint(getPointIndex(this));
                return {drag:function(xM, yM, cX, cY) {
                            o.pos.x = toIX(xM);
                            o.pos.y = toIY(yM);
                        },
                        rel:function(mX, mY){},
                        up:function(mX, mY){}
                       };
            }
            return null;
        }
        point.getParams = function() {
            var params = {};
            params.x = this.pos.x;
            params.y = this.pos.y;
            params.radA = null;
            params.radB = null;
            params.rot = null;
            return params;
        }
        $("#point_list").append('<li>Point</li>');
        points.push(point);
        addClickable(point);
        switchPoint(points.length - 1);
        return point;
    }
    
    function getPointIndex(o) {
        return points.indexOf(o);
    }
    
    // select an ellipse of index i
    var lastSel_Point = 0;
    function switchPoint(i) {
        if(i >= 0 && i < points.length) {
            deselectPoint(lastSel_Point);
            selectPoint(i);
        }
    }
    function selectPoint(i) {
        if(i >= 0 && i < points.length) {
            $("#point_list li").eq(i).css("background-color","#CCFFFF");
            points[i].isSelected = true;
            lastSel_Point = i;
        }
    }
    function deselectPoint(i) {
        if(i >= 0 && i < points.length) {
            $("#point_list li").eq(i).css("background-color","none");
            points[i].isSelected = false;
        }
    }
    function removePoint(i) {
        if(i >= 0 && i < points.length) {
            $("#point_list li").eq(i).remove();
            removeClickable(points[i]);
            points.splice(i, 1);
            if(i < points.length) {
                selectPoint(i);
            }
            else {
                selectPoint(points.length-1);
            }
        }
    }

    // DRAW FUNCTIONS //
    ////////////////////

    // draw a simple sqare at (x, y)
    function drawSquare(x, y, size, color, lW) {
        ctx.beginPath();
        ctx.moveTo(x-size,y-size);
        ctx.lineTo(x+size,y-size);
        ctx.lineTo(x+size,y+size);
        ctx.lineTo(x-size,y+size);
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lW;
        ctx.stroke();
    }
    
    // draw a cross shape
    function drawCross(x, y, size, color, lW) {
        ctx.strokeStyle = color;
        ctx.lineWidth = lW;
        
        ctx.beginPath();
        ctx.moveTo(x-size,y-size);
        ctx.lineTo(x+size,y+size);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x-size,y+size);
        ctx.lineTo(x+size,y-size);
        ctx.stroke();
    }
    
    // draw to the canvas
    function draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img, toCX(0), toCY(0), toCS(img.width), toCS(img.height));
        for(var i=0;i<ellipses.length;i++){
            ellipses[i].draw();
        }
        for(var i=0;i<points.length;i++){
            points[i].draw();
        }
    }
    
    // CANVAS SPACE FUNCTIONS //
    ////////////////////////////
    
    // canvas position/scale
    var canvasP = {
        scale: 1.0,
        xDisp: 0.0,
        yDisp: 0.0
    };
    
    // convert variables from Image space to Canvas space
    // convert x pos
    function toCX(x) {
        return (x + canvasP.xDisp) * canvasP.scale;
    }
    // convert y pos
    function toCY(y) {
        return (y + canvasP.yDisp) * canvasP.scale;
    }
    // convert scale
    function toCS(l) {
        return l * canvasP.scale;
    }
    
    // convert variables from Canvas space to Image space
    // convert x pos
    function toIX(x) {
        return (x / canvasP.scale) - canvasP.xDisp;
    }
    // convert y pos
    function toIY(y) {
        return (y / canvasP.scale) - canvasP.yDisp;
    }
    // convert scale
    function toIS(l) {
        return l / canvasP.scale;
    }

    // CLICK FUNCTIONS //
    /////////////////////

    // list of items that can be clicked/dragged
    var clickable = [];
    function addClickable(o) {
        clickable.push(o);
    }
    function removeClickable(o) {
        i = clickable.indexOf(o);
        if(i > -1) {
            clickable.splice(i, 1);
        }
    }

    // the default things to do on clicking/dragging (drag canvas)
    function defaultItem() {
        var item = {};
        item.drag = function(mX, mY, cX, cY) {
            canvasP.xDisp += toIS(cX);
            canvasP.yDisp += toIS(cY);
        };
        item.rel = function(mX, mY) {};
        item.up = function(mX, mY) {
            createPoint({x:toIX(mX), y:toIY(mY)});
        };
        return item;
    }

    var click = {};
    click.isDragging = false;
    click.item = defaultItem();

    $("#canvas1").mousedown(function(e){
        e.preventDefault();
        var left = $(this).offset().left;
        var top = $(this).offset().top;
        var x = (e.pageX-left) * DPI;
        var y = (e.pageY-top) * DPI;
        console.log("mouse down:", x, y);
        // find item that has been clicked
        for(var i=0;i<clickable.length;i++) {
            var it = clickable[i].click(x, y);
            if(it != null) {
                click.item = it;
                break;
            }
        }
        var lastX = x;
        var lastY = y;
        draw();
        $(window).mousemove(function(e) {
            click.isDragging = true;
            var x = (e.pageX-left) * DPI;
            var y = (e.pageY-top) * DPI;
            click.item.drag(x, y, x-lastX, y-lastY);
            lastX = x;
            lastY = y;
            draw();
        });
    })
    .mouseup(function(e) {
        var x = (e.pageX-$(this).offset().left) * DPI;
        var y = (e.pageY-$(this).offset().top) * DPI;
        $(window).unbind("mousemove");
        if (!click.isDragging) {
            console.log("mouse up:",x ,y);
            click.item.up(x, y);
        }
        else {
            console.log("mouse release:",x,y);
            click.item.rel(x, y);
        }
        click.isDragging = false;
        click.item = defaultItem();
        draw();
    });
    
    // BUTTONS ON SCREEN //
    ///////////////////////

    $("#add_ellipse").click(function(){
        createEllipse();
        draw();
    })
    $("#remove_ellipse").click(function(){
        removeEllipse(lastSel_Ellipse);
        draw();
    })
    $('#ellipse_list').on('click', 'li', function() {
        switchEllipse($(this).index());
        draw();
    });
    $("#add_point").click(function(){
        createPoint();
        draw();
    })
    $("#remove_point").click(function(){
        removePoint(lastSel_Point);
        draw();
    })
    $('#point_list').on('click', 'li', function() {
        switchPoint($(this).index());
        draw();
    });
    $("#save_items").click(function(){
        updateShinyItems();
    })
    $("#zoom_in").click(function(){
        var x = toIX(canvas.width/2);
        var y = toIY(canvas.height/2);
        canvasP.scale *= 1.2;
        canvasP.xDisp = toIS(canvas.width/2) - x;
        canvasP.yDisp = toIS(canvas.height/2) - y;
        draw();
    })
    $("#zoom_out").click(function(){
        var x = toIX(canvas.width/2);
        var y = toIY(canvas.height/2);
        canvasP.scale /= 1.2;
        canvasP.xDisp = toIS(canvas.width/2) - x;
        canvasP.yDisp = toIS(canvas.height/2) - y;
        draw();
    })
    
    // COLOR SLIDER FUNCTIONALITY //
    ////////////////////////////////
    
    // set colour properties
    function refreshColors() {
        var r = $("#red").slider("value");
        var g = $("#green").slider("value");
        var b = $("#blue").slider("value");
        colors.line = hexFromRGB(r, g, b);
        draw();
    }
    
    // convert colours to hexadecimal style
    function hexFromRGB(r, g, b) {
        var hex = [
            r.toString( 16 ),
            g.toString( 16 ),
            b.toString( 16 )
        ];
        $.each( hex, function( nr, val ) {
            if ( val.length === 1 ) {
                hex[ nr ] = "0" + val;
            }
        });
        return "#" + hex.join( "" ).toUpperCase();
    }
    
    // Initialise color sliders
    $("#red, #green, #blue").slider({
        orientation: "horizontal",
        range: "min",
        max: 255,
        value: 0,
        slide: refreshColors,
        change: refreshColors,
    });
    $("#red").slider("value", 256);
    $("#green").slider("value", 0);
    $("#blue").slider("value", 0);
});