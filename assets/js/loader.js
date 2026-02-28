// Loader.js - Loading Animation Script
(function() {
    'use strict';

    // Create the loader element
    var loaderContainer = document.createElement('div');
    loaderContainer.className = 'loader-container';
    loaderContainer.id = 'loader-container';

    // Add loader content
    loaderContainer.innerHTML = `
        <div class="loader">
            <div class="simple-loader"></div>
            <div class="circle-loader"></div>
            <div class="spinner-loader"></div>
            <div class="dual-ring-loader">
                <div class="ring"></div>
                <div class="ring"></div>
            </div>
            <div class="heart-loader"></div>
            <div class="pulse-loader"></div>
            <div class="bouncing-ball-loader">
                <div class="ball"></div>
                <div class="ball"></div>
            </div>
        </div>
    `;

    // Add the loader to the body
    document.body.appendChild(loaderContainer);

    // Remove the loader when the page has finished loading
    window.addEventListener('load', function() {
        loaderContainer.classList.add('fade-out');
        setTimeout(function() {
            loaderContainer.parentNode.removeChild(loaderContainer);
        }, 500);
    });
})();