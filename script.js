var leftViewer = OpenSeadragon({
  id: 'leftSlide',
  prefixUrl: './openseadragon/images/',
  tileSources: {
    Image: {
      xmlns: 'http://schemas.microsoft.com/deepzoom/2008',
      Url: './prostate_slide_files/',
      Format: 'jpg',
      Overlap: '0',
      TileSize: '256',
      Size: {
        Width: '2700',
        Height: '1800'
      }
    }
  },
  autoHideControls: false
});

var rightViewer = OpenSeadragon({
  id: 'rightSlide',
  prefixUrl: './openseadragon/images/',
  tileSources: {
    Image: {
      xmlns: 'http://schemas.microsoft.com/deepzoom/2008',
      Url: './prostate_slide_files/',
      Format: 'jpg',
      Overlap: '0',
      TileSize: '256',
      Size: {
        Width: '2700',
        Height: '1800'
      }
    }
  },
  autoHideControls: false
});

let leftAngleDisplay = document.getElementById('leftSlideAngle');
let rightAngleDisplay = document.getElementById('rightSlideAngle');
let leftSlider = document.getElementById('leftRotateSlider');
let rightSlider = document.getElementById('rightRotateSlider');

let syncToggler = document.getElementById('sync_toggler'); // checkbox to toggle 'sync'
let initialLeftAngle = +leftSlider.value;
let initialRightAngle = +rightSlider.value;
let initialLeftCenter = leftViewer.viewport.getCenter();
let initialRightCenter = rightViewer.viewport.getCenter();
let initialLeftZoom = leftViewer.viewport.getZoom();
let initialRightZoom = rightViewer.viewport.getZoom();
let sync;

function toggleSync() {
  sync = syncToggler.checked;
  if (sync) {
    // store initial configuration of both slides
    initialLeftAngle = +leftSlider.value;
    initialRightAngle = +rightSlider.value;
    initialLeftCenter = leftViewer.viewport.getCenter();
    initialRightCenter = rightViewer.viewport.getCenter();
    initialLeftZoom = leftViewer.viewport.getZoom();
    initialRightZoom = rightViewer.viewport.getZoom();
  }
}

function rotateLeftSlide() {
  let angle = +leftSlider.value; // Implict conversion of String to Number
  leftViewer.viewport.setRotation(angle);
  leftAngleDisplay.innerHTML = `${angle} deg.`;
  if (sync) {
    let angleDifference = angle - initialLeftAngle;
    let rightAngle = (initialRightAngle + angleDifference + 360) % 360;
    rightSlider.value = rightAngle;
    rightViewer.viewport.setRotation(rightAngle);
    rightAngleDisplay.innerHTML = `${rightAngle} deg.`;
  }
}

function rotateRightSlide(e) {
  let angle = +rightSlider.value;
  rightViewer.viewport.setRotation(angle);
  rightAngleDisplay.innerHTML = `${angle} deg.`;
  if (sync) {
    let angleDifference = angle - initialRightAngle;
    let leftAngle = (initialLeftAngle + angleDifference + 360) % 360;
    leftSlider.value = leftAngle;
    leftViewer.viewport.setRotation(leftAngle);
    leftAngleDisplay.innerHTML = `${leftAngle} deg.`;
  }
}

let leftViewerLeading = false;
let rightViewerLeading = false;

function leftHandler() {
  if (rightViewerLeading) {
    return; // to prevent unnecessary call stack of the event handler
  }

  if (sync) {
    leftViewerLeading = true;
    let zoomRatio = leftViewer.viewport.getZoom() / initialLeftZoom;
    let finalZoom = zoomRatio * initialRightZoom;
    rightViewer.viewport.zoomTo(finalZoom);

    deltaX = leftViewer.viewport.getCenter().x - initialLeftCenter.x;
    deltaY = leftViewer.viewport.getCenter().y - initialLeftCenter.y;
    let deltaPoint = new OpenSeadragon.Point(deltaX, deltaY).rotate(
      leftViewer.viewport.getRotation() - rightViewer.viewport.getRotation()
    ); // The change in coordinates in the relative frame

    let targetCenter = new OpenSeadragon.Point(
      initialLeftCenter.x + deltaPoint.x,
      initialLeftCenter.y + deltaPoint.y
    ); // final coordinates of the center in the relative frame

    rightViewer.viewport.panTo(targetCenter);
    leftViewerLeading = false;
  }
}

function rightHandler() {
  if (leftViewerLeading) {
    return; // to prevent unnecessary call stack of the event handler
  }

  if (sync) {
    rightViewerLeading = true;
    let zoomRatio = rightViewer.viewport.getZoom() / initialRightZoom;
    let finalZoom = zoomRatio * initialLeftZoom;
    leftViewer.viewport.zoomTo(finalZoom);

    deltaX = rightViewer.viewport.getCenter().x - initialRightCenter.x;
    deltaY = rightViewer.viewport.getCenter().y - initialRightCenter.y;
    let deltaPoint = new OpenSeadragon.Point(deltaX, deltaY).rotate(
      rightViewer.viewport.getRotation() - leftViewer.viewport.getRotation()
    ); // The change in coordinates in the frame of the leftViewer

    let targetCenter = new OpenSeadragon.Point(
      initialLeftCenter.x + deltaPoint.x,
      initialLeftCenter.y + deltaPoint.y
    ); // final coordinates of the center in the relative frame

    leftViewer.viewport.panTo(targetCenter);
    rightViewerLeading = false;
  }
}

leftViewer.addHandler('pan', leftHandler);
leftViewer.addHandler('zoom', leftHandler);
rightViewer.addHandler('zoom', rightHandler);
rightViewer.addHandler('pan', rightHandler);
