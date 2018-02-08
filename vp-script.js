"use strict";

function playVideo()
{
    var v = document.getElementById('video');
    if(v.paused)
    {
        v.play();
        $("#play-pause").text("||");
    }
    else
    {
        v.pause();  
        $("#play-pause").text(">");
    }
}

function update() {
    var progr = document.getElementById('progress-bar');
    var p = Math.floor((video.currentTime / video.duration)*100);
    progr.value = p;
    $("#progressText").text(video.currentTime);
 }

 var videoEffect="noeffect";
 
$(document).ready(function()
{
    var video = document.getElementById('video');
    var can = document.getElementById('canvas');
    var con = can.getContext('2d');
   

   $(video).attr({
        "src": $("#videoplaylist li").eq(0).attr("movieurl"),
        "poster": $("#videoplaylist li").eq(0).attr("moviesposter"),
    })
    $("#videoplaylist li").eq(0).addClass("active");

    var currentVideo=0;

    $("#videoplaylist li").on("click", function() {
        $(video)
        .attr({
            "src": $(this).attr("movieurl"),
            "poster": $(this).attr("movieposter"),
            "autoplay":"autoplay"   
        })
        currentVideo = $("#videoplaylist li").index(this);
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
        
    });

        video.onended = function(){
            currentVideo++;
            if(currentVideo==$("#videoplaylist li").length)
                currentVideo=0
            $("#videoplaylist li").removeClass("active");   
            $("#videoplaylist li").eq(currentVideo).addClass("active");

            $(video).attr({
                "src": $("#videoplaylist li").eq(currentVideo).attr("movieurl"),
                "poster": $("#videoplaylist li").eq(currentVideo).attr("moviesposter"),
                "autoplay": "autoplay"
            })
        }
       

        $("#next").click(function () {
            currentVideo++;
            if(currentVideo==$("#videoplaylist li").length)
                currentVideo=0
            $("#videoplaylist li").removeClass("active");   
            $("#videoplaylist li").eq(currentVideo).addClass("active");

            $(video).attr({
                "src": $("#videoplaylist li").eq(currentVideo).attr("movieurl"),
                "poster": $("#videoplaylist li").eq(currentVideo).attr("moviesposter"),
            })
        })

        $("#prev").click(function () {
            currentVideo--;
            if(currentVideo<0)
                currentVideo=$("#videoplaylist li").length;
            $("#videoplaylist li").removeClass("active");   
            $("#videoplaylist li").eq(currentVideo).addClass("active");

            $(video).attr({
                "src": $("#videoplaylist li").eq(currentVideo).attr("movieurl"),
                "poster": $("#videoplaylist li").eq(currentVideo).attr("moviesposter"),
            })
        })
        video.addEventListener('timeupdate', update);
        
        //EFFECTS
        $('.videoEffect').click(function(){
            con.restore();
            con.save();
            window.videoEffect=$(this).data("effect");
        });

        video.addEventListener('play', function () {
            if(video.clientWidth / video.clientHeight < video.videoWidth / video.videoHeight) 
            {
                can.width = video.clientWidth;
                can.height = video.clientWidth * video.videoHeight / video.videoWidth;
            }
            drawVideoWithEffects(video, con);  
        }, false);

        var can1 = document.getElementById("canvasCapture");
        var con1 = can1.getContext('2d');
        var w, h, ratio;    
        video.addEventListener('loadedmetadata', function() {
			ratio = video.videoWidth / video.videoHeight;
			w = video.videoWidth - 200;
            h = parseInt(w / ratio,10);
			can1.width = w;
			can1.height = h;			
		}, false);
		
        $("#snap").click(function () {
            con1.fillRect(0, 0, w, h);
            con1.drawImage(video, 0, 0, w, h);
        });


        $('#canvasCapture').click(function() {
            document.location.href = can1.toDataURL("image/png").replace("image/png", "image/octet-stream");
        });
        
});

function drawVideoWithEffects(video, con)
{
    switch(videoEffect){
        case "noeffect":
            con.drawImage(video,0,0,video.clientWidth,video.clientHeight);
            break;
        case "blackwhite-effect":
            con.drawImage(video,0,0,video.clientWidth,video.clientHeight);
            var imgD = con.getImageData(0, 0,video.clientWidth,video.clientHeight);
            var pixels = imgD.data;
            for (var i = 0; i < pixels.length; i+=4) { 
                    pixels[i] = pixels[i+1]=pixels[i+2]=Math.round(pixels[i] + pixels[i + 1] + pixels[i+2])/3;
                }
            con.putImageData(imgD, 0, 0);
            break;
        
        case "sephia-effect":
        con.drawImage(video,0,0,video.clientWidth,video.clientHeight);
        var imgD = con.getImageData(0,0,video.clientWidth,video.clientHeight);
        var pixels = imgD.data;
        for(var i=0;i< pixels.length;i+=4)
        {
            pixels[i] = (pixels[i] * .393) + (pixels[i+1] *.769) + (pixels[i+2] * .189)
            pixels[i+1] = (pixels[i] * .349) + (pixels[i+1] *.686) + (pixels[i+2] * .168)
            pixels[i+2] = (pixels[i] * .272) + (pixels[i+1] *.534) + (pixels[i+2] * .131)
        }
        con.putImageData(imgD,0,0);
        break; 
        
        case "invert-effect":
        con.drawImage(video,0,0,video.clientWidth,video.clientHeight);
        var imgD = con.getImageData(0,0,video.clientWidth,video.clientHeight);
        var pixels = imgD.data;
        for(var i=0;i< pixels.length;i+=4)
        {
            pixels[i] = 255-pixels[i];
            pixels[i+1]=255-pixels[i+1];
            pixels[i+2]=255-pixels[i+2];
        }
        con.putImageData(imgD,0,0);
        break; 

        case "threshold-effect":
        con.drawImage(video,0,0,video.clientWidth,video.clientHeight);
        var imgD = con.getImageData(0,0,video.clientWidth,video.clientHeight);
        var pixels = imgD.data;
        var value=122;
        for(var i=0;i< pixels.length;i+=4)
        {
            if(0.2126*pixels[i] + 0.7152*pixels[i+1] + 0.0722*pixels[i+2] >= value)
            {
                pixels[i]=pixels[i+1]=pixels[i+2]=255;
            }
            else
            {
                pixels[i]=pixels[i+1]=pixels[i+2]=0;
            }
        }
        con.putImageData(imgD,0,0);
        break; 
}
setTimeout(drawVideoWithEffects, 66, video, con);   
}

