(function() {
  'use strict';

  var app = { 
    container: document.querySelector('.post-list-body'),
  };

  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  document.getElementById('butPlus').addEventListener('click', function() {
    app.addItemContent();
  });

  document.getElementById('butCompute').addEventListener('click', function() {
    var scale = app.scale(widthAndHeight.mWidth.value, widthAndHeight.mHeight.value);
    var editTextList = app.container.getElementsByTagName('input');
    var textList = app.container.getElementsByTagName('font');
    for(var i = 0; i < editTextList.length; i++){
      var res = editTextList[i].value * scale;
      if (res % 1 == 0){
        textList[i].innerHTML = res;
      } else {
        textList[i].innerHTML = res.toFixed(1);
      }
      
    }
  });

  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  app.scale = function(width, height){
    if (width > height){
      var i = width;
      width = height;
      height = i;
    }

    return (height / 1920);
  }   

  app.createItem = function(){
    var template = document.querySelector('#itemTemplate').content;
    var item = template.cloneNode(true);
    return item;
  };

  app.addItemContent = function(){
    var item = app.createItem();
    app.container.appendChild(item);
  };

  app.addItemContent();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('/px2dp-sw.js')
             .then(function() { console.log('Service Worker Registered'); });
  }

})();
