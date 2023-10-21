// ==UserScript==
// @name         Replace YouTube Player with iFrame
// @version      1.0
// @description  Replaces the YouTube player with an iFrame on specific URLs after all elements are loaded
// @author       Jacky97s
// @match        https://www.youtube.com/watch*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Check if player element exists
    function isPlayerExists() {
        const playerXPath = '//*[@id="player"]';
        const player = document.evaluate(playerXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (player) {
            return player;
        }
    }

    // Replace Player with iframe
    function replacePlayer() {
        const player = isPlayerExists();

        if (player == null) {
            return;
        }

        // Define the video ID from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get('v');

        // Create the iFrame element
        const iframe = document.createElement('iframe');
        const width = player.offsetWidth;
        const height = width * 0.56;

        iframe.id = "iframe-player"
        iframe.width = '100%';
        iframe.height = height.toString();
        iframe.src = `https://www.youtube.com/embed/${videoId}?feature=oembed&autoplay=1`;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;

        // Replace player with iframe
        player.parentNode.replaceChild(iframe, player);
    }

    // Add a debounce function to limit the rate of execution
    function debounce(func, delay) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }

    const debouncedReplacePlayer = debounce(replacePlayer, 500); // Adjust the delay as needed

    // Listen for the 'DOMNodeRemoved' event
    document.addEventListener('DOMNodeRemoved', debouncedReplacePlayer);
})();
