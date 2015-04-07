
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
    var ovals = [];
    var img = new Image();

    // get data
    addOval();

    // SERVER FUNCTIONS //
    //////////////////////

    // get the ovals (possibly tied to server)
    function addOval() {
        createOval();
        draw();
    }

    function setImage(src) {
        img.onload = function() {
            draw();                 // img.onload DOES NOT WORK ON FIREFOX OR SAFARI!!!
        }
        img.src = src;
    }
    Shiny.addCustomMessageHandler("setImage", function(src) {
        setImage(src);
    });

    // OVAL FUNCTIONS //
    ////////////////////

    // add params!
    function createOval() {
        var oval = {};
        oval.p1 = {x:60,y:20};
        oval.p2 = {x:60,y:100};
        oval.p3 = {x:0,y:0};
        oval.radB = 40;
        oval.color = "#FF0000";

        oval.draw = function() {
            // get oval params
            var x = (this.p1.x + this.p2.x) / 2;    // centre X
            var y = (this.p1.y + this.p2.y) / 2;    // centre Y
            var radA = Math.sqrt(Math.pow(this.p1.x-this.p2.x, 2) + Math.pow(this.p1.y-this.p2.y, 2)) / 2;  // radius A
            var radB = this.radB;   // radius B
            var rot = Math.atan((this.p1.y-this.p2.y)/(this.p1.x-this.p2.x)); // angle (radians)

            // Draw the oval
            ctx.beginPath();
            ctx.ellipse(x,y,radA,radB,rot,0,2*Math.PI);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw radius line
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(this.p3.x,this.p3.y);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw the squares
            drawSquare(this.p1.x,this.p1.y,10,"#00CCFF");
            drawSquare(this.p2.x,this.p2.y,10,"#00CCFF");
            drawSquare(this.p3.x,this.p3.y,10,"#00CC00");
        }
        oval.click = function(xM, yM) {

            var b = 12; // bounds
            if(Math.abs(this.p1.x-xM)<b && Math.abs(this.p1.y-yM)<b) {
                return {targ:this,
                        drag:function(o, xM, yM) {
                            o.p1.x = xM;
                            o.p1.y = yM;
                            o.updateP3();
                        },
                        rel:function(o, mX, mY){},
                        up:function(o, mX, mY){}
                       };
            }
            if(Math.abs(this.p2.x-xM)<b && Math.abs(this.p2.y-yM)<b) {
                return {targ:this,
                        drag:function(o, xM, yM) {
                            o.p2.x = xM;
                            o.p2.y = yM;
                            o.updateP3();
                        },
                        rel:function(o, mX, mY){},
                        up:function(o, mX, mY){}
                       };
            }
            if(Math.abs(this.p3.x-xM)<b && Math.abs(this.p3.y-yM)<b) {
                return {targ:this,
                        drag:function(o, xM, yM) {
                            o.p3.x = xM;
                            o.p3.y = yM;
                            // update radius
                            var x = (o.p1.x + o.p2.x) / 2;    // centre X
                            var y = (o.p1.y + o.p2.y) / 2;    // centre Y
                            o.radB = Math.sqrt(Math.pow(x-xM,2)+Math.pow(y-yM,2));
                        },
                        rel:function(o, mX, mY){
                            o.updateP3();
                        },
                        up:function(o, mX, mY){}
                       };
            }
            return null;
        }
        oval.updateP3 = function() {
            var x = (this.p1.x + this.p2.x) / 2;    // centre X
            var y = (this.p1.y + this.p2.y) / 2;    // centre Y
            var rot = Math.atan((this.p1.y-this.p2.y)/(this.p1.x-this.p2.x));
            this.p3.x = x + (Math.sin(rot) * this.radB);
            this.p3.y = y + (-Math.cos(rot) * this.radB);
        }
        oval.updateP3();
        ovals.push(oval);
        // add to R list somewhere here
    }

    function deleteOval(i) {
        ovals.splice(i, 1);
        // remove from R list somewhere
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

    // draw to the canvas
    function draw() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height);
        for(var i=0;i<ovals.length;i++){
            ovals[i].draw();
        }
    }

    // gets a nice random color (FIX THS)
    function getRandomColor() {

        var color = '#';
        for (var i = 0; i < 3; i++) {
            var c = Math.floor(Math.random() * 128);
            c += 64;
            color += ("00" + c.toString(16)).slice(-2);
        }

        return color;
    }

    // CLICK FUNCTIONS //
    /////////////////////

    function defaultItem() {
        var item = {};
        item.targ = null;
        item.drag = function(targ, mX, mY) {};
        item.rel = function(targ, mX, mY) {};
        item.up = function(targ, mX, mY) {};
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
        console.log("mouse down:",x,y);
        for(var i=0;i<ovals.length;i++) {
            var it = ovals[i].click(x,y);
            if(it != null) {
                click.item = it;
            }
        }
        $(window).mousemove(function(e) {
            click.isDragging = true;
            var x = (e.pageX-left) * DPI;
            var y = (e.pageY-top) * DPI;
            click.item.drag(click.item.targ, x, y);
            draw();
        });
    })
    .mouseup(function(e) {
        var x = (e.pageX-$(this).offset().left) * DPI;
        var y = (e.pageY-$(this).offset().top) * DPI;
        var wasDragging = click.isDragging;
        click.isDragging = false;
        $(window).unbind("mousemove");
        if (!wasDragging) {
            console.log("mouse up:",x,y);
        }
        else {
            console.log("mouse release:",x,y);
            click.item.rel(click.item.targ, x, y);
            draw();
        }
        click.item = defaultItem();
    });
});