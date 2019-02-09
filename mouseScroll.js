// ==UserScript==
// @name MouseScroll
// @namespace wiyu98
// @match *://*/*
// @grant none
// ==/UserScript==

//Initialize mouseScroll. Enter parameters here as a JSON object.
mouseScroll({});

/**
 * Enables you to scroll by having your mouse in the right position.
 * Pass in a JSON object with these optional parameters:
 * 
 * @param scrollUpZone
 * number of pixels below the top of the window where scrolling up starts.
 * Default: 100
 * 
 * @param scrollDownZone 
 * number of pixels above the bottom of the window where scrolling down starts.
 * Default: 100
 * 
 * @param refreshInterval
 * interval in milliseconds that will check the mouse's position and scroll.
 * the smaller the number, the smoother the scroll.
 * Default: 20 ms
 * 
 * @param scrollDist
 * a mulitplier that determines how much the scroll moves per refresh.
 * the higher the number, the faster the scroll.
 * Default: 0.10
 * 
 * @param initOn
 * determines whether the scroller is on or not when a new page is opened
 * Default: false
 * 
 * @param toggleKey
 * the key code of the key that toggles the scroller
 * Default: 192 (`)
 */
function mouseScroll(params) {

  scrollUpZone = params.scrollUpZone || 100;
  scrollDownZone = params.scrollDownZone || 100;
  refreshInterval = params.refreshInterval || 20;
  scrollDist = params.scrollDist || 0.10;
  initOn = params.initOn || false;
  toggleKey = params.toggleKey || 192;

  var lowerThreshold = window.innerHeight - scrollDownZone;
  var speed = 0;
  var direction = 0;

  //Recalibrate the direction and speed of the scroll
  onmousemove = function (event) {
    if (event.clientY <= scrollUpZone) {
      speed = (scrollUpZone - event.clientY) * scrollDist;
      direction = -1;
    } else if (event.clientY >= lowerThreshold) {
      speed = (event.clientY - window.innerHeight + scrollDownZone) * scrollDist;
      direction = 1;
    } else {
      speed = 0;
    }
  }

  //Initialize scroller
  var scroller = null;
  if (initOn == true) {
    scroller = setInterval(function () {
      window.scrollBy(0, speed * direction);
    }, refreshInterval);
  }

  //Toggle the scroller on/off
  document.addEventListener("keydown", function(event) {
    if (event.which == toggleKey) {
      if (scroller) {
        clearTimeout(scroller);
        scroller = null;
      } else {
        scroller = setInterval(function () {
          window.scrollBy(0, speed * direction);
        }, refreshInterval);
      }
    }
  })

  //Stop scrolling when the mouse leaves the window
  document.addEventListener("mouseleave", function () {
    decelerate();
  });

  //Smoothly stop scrolling
  function decelerate() {
    var decelerate = setInterval(function () {
      if (speed > 0.5) {
        speed = speed - 0.5;
      }
      else if (speed > 0) {
        speed = 0;
        clearTimeout(decelerate);
      }
    }, refreshInterval);
  }
}