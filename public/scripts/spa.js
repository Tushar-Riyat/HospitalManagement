// script.js

// Utility function to load content via AJAX
function loadContent(_href, callback) {
    jQuery.ajax({
        type: 'POST',
        url: _href,
        success: function (data) {
            const container = jQuery(data).filter(".mpage_container").html() || jQuery(".mpage_container > *", data);
            jQuery(".mpage_container").html(container);
            unsaved = false;
            if (callback && typeof callback === "function") {
                callback(data);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(`Error loading content from ${_href}:`, textStatus, errorThrown);
            alert('There was an error loading the content. Please try again.');
        }
    });
}

jQuery(document).ready(function ($) {
    const supportsHistory = Modernizr.history;

    if (supportsHistory) {
        history.replaceState({ myTag: true }, null, window.location.href);
    }

    $(document).on("click", "a.load_ajax", function (evt) {
        if (evt.which === 1 && !evt.ctrlKey && supportsHistory) {
            const _href = $(this).attr("href");
            loadContent(_href, function () {
                history.pushState({ myTag: true }, null, _href);
            });
            evt.preventDefault();
        }
    });

    $(document).on("change", "select.load_ajax", function () {
        const _href = $(this).val();
        if (supportsHistory) {
            loadContent(_href, function () {
                history.pushState({ myTag: true }, null, _href);
            });
        } else {
            window.location.href = _href;
        }
    });

    $(window).on("popstate", function (e) {
        if (e.originalEvent.state && e.originalEvent.state.myTag) { // to avoid Safari popstate on page load
            const _href = location.href;
            loadContent(_href);
        }
    });
});
