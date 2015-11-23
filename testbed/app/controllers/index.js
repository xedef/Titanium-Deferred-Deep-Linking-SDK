var branch = require('io.branch.sdk');

// Initialize a session
branch.initSession();

// Event handler for initSession
branch.addEventListener("bio:initSession", function(data) {
    Ti.API.debug("inside bio:initSession");
    Ti.API.debug(data["is_first_session"]);
    Ti.API.debug(data["clicked_branch_link"]);

    // Retrieve latest session parameters
    var sessionParams = branch.getLatestReferringParams();
    Ti.API.debug("session parameters:");
    Ti.API.debug(sessionParams["is_first_session"]);
    Ti.API.debug(sessionParams["clicked_branch_link"]);

    // Retrieve install session parameters
    var installParams = branch.getFirstReferringParams();
    Ti.API.debug("install parameters:");
    Ti.API.debug(installParams["is_first_session"]);
    Ti.API.debug(installParams["clicked_branch_link"]);

    // Set identity
    branch.setIdentity("test");

    // logout
    branch.logout();
});

function doClick(e) {
    alert($.label.text);
}

$.index.open();
