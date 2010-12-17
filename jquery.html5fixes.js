; // End any previous JS input

// Add eventSupported() function to attempt to check if an event is currently supported
(function($) {
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

// Create "input" event for browsers that don't support it.
(function($) {
    // Fix "input" event:
    $(document).bind(
        'ready',
        function(readyevt) {
            // If the "input" event is already supported, no need...
            if($.eventSupported('input')) {return false;}
            else if(typeof(document.createEvent) == 'function') {
                // Try to detect use the last ditch method
                $('body').append('<input id="testEl">');
                var kevt = document.createEvent("KeyboardEvent");
                kevt.initKeyEvent("keypress", true, true, window, false, false, false, false, 0, "kevt".charCodeAt(0));
                $('body #testEl').data('supported',false);
                $('body #testEl').bind(
                    'input',
                    function(ievt) {
                        $(this).data('supported',true);
                    }
                );
                $('body #testEl').focus();
                $('body #testEl')[0].dispatchEvent(kevt);
                var supported = $('body #testEl').data('supported');
                $('body #testEl').remove();
                if(supported == true) {return false;}
            }
            
            // Otherwise, simulate the "input" event on all "input" elements
            $('input').each(
                function() {
                    // Record the value of each "input" element
                    $(this).data('origVal',$(this).val());
                    
                    // Attempt to detect any event which might possible change the content of input elements
                    $(this).bind(
                        'change keydown keyup mousedown mouseup paste',
                        function(inputactionevt) {
                            // Check if value has been changed
                            if($(this).val() != $(this).data('origVal')) {
                                // Fire the "input" event
                                $(this).trigger('input');
                                // Fire the "forminput" event
                                $(this).parents('form').trigger('forminput');
                                // Update the 'original' value again
                                $(this).data('origVal',$(this).val());
                            }
                        }
                    );
                }
            );
        }
    );
})(jQuery);
