var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.lineCap = "round";
ctx.lineWidth = 5;
ctx.fillStyle = "maroon";

var $canvas = $("#canvas");
var canvasOffset = $canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var scrollX = $canvas.scrollLeft();
var scrollY = $canvas.scrollTop();

var isDown = false;
var startX;
var startY;

var $alert = $("#alert");
var curves;
var maxY = 0;

drawCurveyLine();

function drawCurveyLine() {

    var points = [];

    for (var i = 0; i < 10; i++) {
        var x = Math.random() * 20 + 10;
        var y = i * canvas.height / 9;
        points.push(x);
        points.push(y);
    }

    curves = calculateSplineCurves(points, .25);

    drawSpline(curves, "skyblue")

}

function calculateSplineCurves(pts, t) {
    var cp = []; // array of control points, as x0,y0,x1,y1,...
    var n = pts.length;
    var curves = [];

    // Draw an open spline
    for (var i = 0; i < n - 4; i += 2) {
        cp = cp.concat(getControlPoints(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], pts[i + 4], pts[i + 5], t));
    }
    // Q-start
    curves.push({
        x0: pts[0],
        y0: pts[1],
        x1: cp[0],
        y1: cp[1],
        x2: pts[2],
        y2: pts[3]
    });
    // B-curves
    for (var i = 2; i < pts.length - 5; i += 2) {
        ctx.beginPath();
        curves.push({
            x0: pts[i],
            y0: pts[i + 1],
            x1: cp[2 * i - 2],
            y1: cp[2 * i - 1],
            x2: cp[2 * i],
            y2: cp[2 * i + 1],
            x3: pts[i + 2],
            y3: pts[i + 3]
        });
    }
    // Q-end
    curves.push({
        x0: pts[n - 4],
        y0: pts[n - 3],
        x1: cp[2 * n - 10],
        y1: cp[2 * n - 9],
        x2: pts[n - 2],
        y2: pts[n - 1]
    });

    return (curves);

}


//
function drawSpline(curves, linecolor) {

    // Q-starting
    var q = curves[0];
    ctx.beginPath();
    ctx.moveTo(q.x0, q.y0);
    ctx.quadraticCurveTo(q.x1, q.y1, q.x2, q.y2);

    // B's
    for (var i = 1; i < curves.length - 1; i++) {
        var b = curves[i];
        ctx.bezierCurveTo(b.x1, b.y1, b.x2, b.y2, b.x3, b.y3);
    }
    // Q-ending
    var q = curves[curves.length - 1];
    ctx.quadraticCurveTo(q.x1, q.y1, q.x2, q.y2);

    ctx.strokeStyle = linecolor;
    ctx.stroke();
};

//
function getControlPoints(x0, y0, x1, y1, x2, y2, t) {
    var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    var d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    var fa = t * d01 / (d01 + d12);
    var fb = t - fa;
    var p1x = x1 + fa * (x0 - x2);
    var p1y = y1 + fa * (y0 - y2);
    var p2x = x1 - fb * (x0 - x2);
    var p2y = y1 - fb * (y0 - y2);
    return [p1x, p1y, p2x, p2y];
}


function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);

    // Put your mousedown stuff here
    isDown = true;
}

function handleMouseUp(e) {
    e.preventDefault();
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    // Put your mouseup stuff here
    isDown = false;
}

function handleMouseOut(e) {
    e.preventDefault();
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    // Put your mouseOut stuff here
    isDown = false;
}

function handleMouseMove(e) {
    if (!isDown) {
        return;
    }
    e.preventDefault();
    e.stopPropagation();
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    if (mouseX > 60) {
        $alert.text("You are outside the line!");
    } else {
        $alert.text("OK");
        if (mouseY > maxY) {
            maxY = mouseY;

            ctx.save();
            ctx.globalCompositeOperation = "source-atop"
            ctx.fillRect(0, 0, 300, maxY);
            ctx.restore();
        }
    }

}

$("#canvas").mousedown(function (e) {
    handleMouseDown(e);
});
$("#canvas").mousemove(function (e) {
    handleMouseMove(e);
});
$("#canvas").mouseup(function (e) {
    handleMouseUp(e);
});
$("#canvas").mouseout(function (e) {
    handleMouseOut(e);
});