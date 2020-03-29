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

let syncToggler = document.getElementById('sync_toggler');
let initialLeftAngle = +leftSlider.value;
let initialRightAngle = +rightSlider.value;

function toggleSync() {
  let sync = syncToggler.value;
  if (sync) {
    initialLeftAngle = +leftSlider.value;
    initialRightAngle = +rightSlider.value;
  }
}

function rotateLeftSlide() {
  let angle = +leftSlider.value;
  leftViewer.viewport.setRotation(angle);
  leftAngleDisplay.innerHTML = `${angle} deg.`;
  let sync = syncToggler.checked;
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
  let sync = syncToggler.checked;
  if (sync) {
    let angleDifference = angle - initialRightAngle;
    let leftAngle = (initialLeftAngle + angleDifference + 360) % 360;
    leftSlider.value = leftAngle;
    leftViewer.viewport.setRotation(leftAngle);
    leftAngleDisplay.innerHTML = `${leftAngle} deg.`;
  }
}
