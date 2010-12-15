;(function($) {
    var supported = {}; // results
    // Specify which elements should allow which events
    var tagnames = {
        'select':'input',
        'change':'input',
        'submit':'form',
        'reset':'form',
        'error':'img',
        'load':'img',
        'abort':'img'
    };
    $.eventSupported = function(eventName) {
        // Make sure event name is lower case
        eventName = eventName.toLowerCase();
        
        // Check if we've already determined whether this event is supported (efficiency)
        if(supported[eventName]) {return supported[key];};
        
        if(
            // First check if it's done the "correct" way - in the Event object
            (typeof(Event) == 'object' && eventName.toUpperCase in Event)
            // Now check if the 'on' method is in the documentElement
            || 'on'+eventName in document.documentElement
            // For 'unload' and 'resize', check if the 'on' method is in 'window'
            || (eventName.match(/^unload|resize$/) && 'on'+eventName in window)
        ) {
            supported[eventName] = true;
        } else {
            // If none of those worked, maybe we have to create the element before the 'on' method appears
            var el = document.createElement(tagnames[eventName] || 'div');
            supported[eventName] = 'on'+eventName in el;
            
            // If this still didn't work, check if setting the attribute creates a function
            if(!supported[eventName]) {
                el.setAttribute('on'+eventName, 'return;');
                supported[eventName] = typeof el['on'+eventName] == 'function';
            }
            
            // Unset the element
            el = null;
        }
        // We're done. Return the value 
        return supported[eventName];
    }
})(jQuery);