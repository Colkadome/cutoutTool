
$(function() {

    // INIT CANVAS //
    /////////////////

    // Initialize
    var canvas = document.getElementById("canvas1");
    var ctx = canvas.getContext("2d");

    // set canvas properties
    var WIDTH = 420;
    var HEIGHT = 420;
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

    // SERVER FUNCTIONS //
    //////////////////////

    // create an ellipse
    Shiny.addCustomMessageHandler("custom_addEllipses", function(m) {
        console.log("addEllipses");
        for (var i=0; i<m.length; i++) {
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
        ellipseParams = [];
        for (var i=0; i<ellipses.length; i++) {
            ellipseParams.push(ellipses[i].getParams());
        }
        pointParams = [];
        for (var i=0; i<points.length; i++) {
            pointParams.push(points[i].getParams());
        }
        result = {ellipses:ellipseParams, points:pointParams};
        Shiny.onInputChange("items", result);
    }
    
    // ELLIPSE FUNCTIONS //
    ///////////////////////

    // add params!
    function createEllipse(params) {
        var ellipse = {};
        if (params == null) {
            // no params, a default ellipse is made
            ellipse.p1 = {x:60,y:20};
            ellipse.p2 = {x:60,y:100};
            ellipse.p3 = {x:0,y:0};
            ellipse.radB = 40;
        }
        else {
            // params were specified, use the params
            ellipse.p1 = {x:params.centre.x - (params.radA * Math.sin(params.rot)),
                y:params.centre.y - (params.radA * Math.cos(params.rot))};
            ellipse.p2 = {x:params.centre.x + (params.radA * Math.sin(params.rot)),
                y:params.centre.y + (params.radA * Math.cos(params.rot))};
            ellipse.p3 = {x:0,y:0};
            ellipse.radB = 40;
        }
        ellipse.centreMode = true;
        ellipse.color = "#FF0000";

        ellipse.draw = function() {
            // get ellipse params
            var p = this.getParams();

            // Draw the ellipse
            ctx.beginPath();
            ctx.ellipse(toCX(p.centre.x),toCY(p.centre.y),toCS(p.radA),toCS(p.radB),p.rot,0,2*Math.PI);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw radius line
            ctx.beginPath();
            ctx.moveTo(toCX(p.centre.x),toCY(p.centre.y));
            ctx.lineTo(toCX(this.p3.x),toCY(this.p3.y));
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw the squares
            var size = 8;
            drawSquare(toCX(this.p1.x),toCY(this.p1.y),size,"#00CCFF");
            drawSquare(toCX(this.p2.x),toCY(this.p2.y),size,"#00CCFF");
            drawSquare(toCX(this.p3.x),toCY(this.p3.y),size,"#00CC00");
        }
        ellipse.click = function(xM, yM) {

            var b = 12; // bounds
            o = this; // reference to self
            if(Math.abs(toCX(this.p1.x)-xM)<b && Math.abs(toCY(this.p1.y)-yM)<b) {
                selectEllipse(this);
                return {drag:function(xM, yM, cX, cY) {
                            o.p1.x = toIX(xM);
                            o.p1.y = toIY(yM);
                            o.updateP3();
                        },
                        rel:function(mX, mY){},
                        up:function(mX, mY){}
                       };
            }
            if(Math.abs(toCX(this.p2.x)-xM)<b && Math.abs(toCY(this.p2.y)-yM)<b) {
                selectEllipse(this);
                return {drag:function(xM, yM, cX, cY) {
                            o.p2.x = toIX(xM);
                            o.p2.y = toIY(yM);
                            o.updateP3();
                        },
                        rel:function(mX, mY){},
                        up:function(mX, mY){}
                       };
            }
            if(Math.abs(toCX(this.p3.x)-xM)<b && Math.abs(toCY(this.p3.y)-yM)<b) {
                selectEllipse(this);
                return {drag:function(xM, yM, cX, cY) {
                            var iX = toIX(xM);
                            var iY = toIY(yM);
                            o.p3.x = iX;
                            o.p3.y = iY;
                            // update radius
                            var x = (o.p1.x + o.p2.x) / 2;    // centre X
                            var y = (o.p1.y + o.p2.y) / 2;    // centre Y
                            o.radB = Math.sqrt(Math.pow(x-iX,2)+Math.pow(y-iY,2));
                        },
                        rel:function(mX, mY){
                            o.updateP3();
                        },
                        up:function(mX, mY){}
                       };
            }
            return null;
        }
        ellipse.updateP3 = function() {
            var x = (this.p1.x + this.p2.x) / 2;    // centre X
            var y = (this.p1.y + this.p2.y) / 2;    // centre Y
            var rot = Math.atan((this.p1.y-this.p2.y)/(this.p1.x-this.p2.x));
            this.p3.x = x + (Math.sin(rot) * this.radB);
            this.p3.y = y + (-Math.cos(rot) * this.radB);
        }
        ellipse.getParams = function() {
            var params = {};
            params.centre = {x: (this.p1.x + this.p2.x) / 2, y: (this.p1.y + this.p2.y) / 2}
            params.radA = Math.sqrt(Math.pow(this.p1.x-this.p2.x, 2) + Math.pow(this.p1.y-this.p2.y, 2)) / 2;
            params.radB = this.radB;
            params.rot = Math.atan((this.p1.y-this.p2.y)/(this.p1.x-this.p2.x));
            return params;
        }
        ellipse.updateP3();
        $("#ellipse_list li").eq(ellipses.length).before('<li style="color:'+ellipse.color+';">Ellipse <button type="button" class="btn btn-default remove-ellipse"><span class="glyphicon glyphicon-minus"></span></button></li>');
        ellipses.push(ellipse);
        addClickable(ellipse);
        return ellipse;
    }
    
    // select an ellipse using a reference
    var lastSel_Ellipse = 0;
    function selectEllipse(o) {
        $("#ellipse_list li").eq(lastSel_Ellipse).css("background-color","none");
        lastSel_Ellipse = ellipses.indexOf(o);
        if(lastSel_Ellipse > -1) {
            $("#ellipse_list li").eq(lastSel_Ellipse).css("background-color","#DDDDDD");
        }
    }
    
    // delete an ellipse of index i
    function removeEllipse(i) {
        $("#ellipse_list li").eq(i).remove();
        console.log(i);
        removeClickable(ellipses[i]);
        ellipses.splice(i, 1);
    }
    
    // POINT FUNCTIONS //
    /////////////////////
    
    function createPoint(params) {
        var point = {};
        if (params == null) {
            // no params, a default point is made
            point.pos = {x:60,y:20};
        }
        else {
            // params were specified, use the params
            point.pos = {x:params.x, y:params.y};
        }
        point.color = "#FF0000";
        point.draw = function() {
            // Draw the cross
            drawCross(toCX(this.pos.x),toCY(this.pos.y), 6, point.color);
        }
        point.click = function(xM, yM) {
            var b = 8; // bounds
            o = this; // reference to self
            if(Math.abs(toCX(this.pos.x)-xM)<b && Math.abs(toCY(this.pos.y)-yM)<b) {
                selectPoint(this);
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
            return {x:this.pos.x, y:this.pos.y};
        }
        $("#point_list li").eq(points.length).before('<li style="color:'+point.color+';">Point <button type="button" class="btn btn-default remove-point"><span class="glyphicon glyphicon-minus"></span></button></li>');
        points.push(point);
        addClickable(point);
        return point;
    }
    
    // select a point using a reference
    var lastSel_Point = 0;
    function selectPoint(o) {
        $("#point_list li").eq(lastSel_Point).css("background-color","none");
        lastSel_Point = points.indexOf(o);
        if(lastSel_Point > -1) {
            $("#point_list li").eq(lastSel_Point).css("background-color","#DDDDDD");
        }
    }
    
    // delete a point of index i
    function removePoint(i) {
        $("#point_list li").eq(i).remove();
        console.log(i);
        removeClickable(points[i]);
        points.splice(i, 1);
    }

    // DRAW FUNCTIONS //
    ////////////////////

    // draw a simple sqare at (x, y)
    function drawSquare(x, y, size, color) {
        ctx.beginPath();
        ctx.moveTo(x-size,y-size);
        ctx.lineTo(x+size,y-size);
        ctx.lineTo(x+size,y+size);
        ctx.lineTo(x-size,y+size);
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    function drawCross(x, y, size, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(x-size,y-size);
        ctx.lineTo(x+size,y+size);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x-size,y+size);
        ctx.lineTo(x+size,y-size);
        ctx.stroke();
    }
    
    // canvas position/scale
    var canvasP = {
        scale: 1.0,
        xDisp: 0.0,
        yDisp: 0.0
    };
    
    // convert variables to Canvas space
    function toCX(x) {
        return (x + canvasP.xDisp) * canvasP.scale;
    }
    function toCY(y) {
        return (y + canvasP.yDisp) * canvasP.scale;
    }
    function toCS(l) {
        return l * canvasP.scale;
    }
    
    // convert variables to Image space
    function toIX(x) {
        return (x / canvasP.scale) - canvasP.xDisp;
    }
    function toIY(y) {
        return (y / canvasP.scale) - canvasP.yDisp;
    }
    function toIS(l) {
        return l / canvasP.scale;
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

    // CLICK FUNCTIONS //
    /////////////////////

    // list of items that can be clicked/dragged
    var clickable = [];
    function addClickable(o) {
        clickable.push(o);
    }
    function removeClickable(o) {
        i = clickable.indexOf(o);
        console.log("click"+i);
        if(i > -1) {
            clickable.splice(i, 1);
        }
    }

    // the default things to do on clicking/dragging
    function defaultItem() {
        var item = {};
        item.drag = function(mX, mY, cX, cY) {
            canvasP.xDisp += toIS(cX);
            canvasP.yDisp += toIS(cY);
        };
        item.rel = function(mX, mY) {};
        item.up = function(mX, mY) {};
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
        console.log("Image space:", toIX(x), toIY(y));
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
        var x = toCX((e.pageX-$(this).offset().left) * DPI);
        var y = toCY((e.pageY-$(this).offset().top) * DPI);
        $(window).unbind("mousemove");
        if (!click.isDragging) {
            //console.log("mouse up:",x ,y);
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
    $('#ellipse_list').on('click', 'li .remove-ellipse', function() {
        removeEllipse($('#ellipse_list li .remove-ellipse').index($(this)));
        draw();
    });
    $("#add_point").click(function(){
        createPoint();
        draw();
    })
    $('#point_list').on('click', 'li .remove-point', function() {
        removePoint($('#point_list li .remove-point').index($(this)));
        draw();
    });
    $("#save_items").click(function(){
        updateShinyItems();
    })
    $("#zoom_in").click(function(){
        /*
        var xM = canvasP.xDisp - toPS(canvas.width/2);
        var yM = canvasP.yDisp - toPS(canvas.height/2);
        var diff = (canvasP.scale + 0.2) / canvasP.scale;
        canvasP.xDisp = (xM * diff) + toPS(canvas.width/2);
        canvasP.yDisp = (yM * diff) + toPS(canvas.height/2);
        console.log(xM, canvasP.xDisp);
        */
        canvasP.scale += 0.2;
        draw();
    })
    $("#zoom_out").click(function(){
        canvasP.scale -= 0.2;
        draw();
    })
});