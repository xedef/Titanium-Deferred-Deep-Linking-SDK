if (OS_ANDROID) {
    var branch = require('io.branch.sdk');

    // Initialize a session
    branch.initSession();

    // Event handler for initSession
    branch.addEventListener("bio:initSession", function(data) {
        Ti.API.debug("inside bio:initSession");
        printBranchData(data);

        // Retrieve latest session parameters
        var sessionParams = branch.getLatestReferringParams();
        Ti.API.debug("session parameters:");
        printBranchData(sessionParams);

        // Retrieve install session parameters
        var installParams = branch.getFirstReferringParams();
        Ti.API.debug("install parameters:");
        printBranchData(installParams);

        // Set identity
        branch.setIdentity("test");

        // Register custom events
        branch.userCompletedAction("pressed_custom_button");

        var proxy = branch.createBranchUniversalObject({
            "canonicalIdentifier" : "identifier",
            "title" : "title",
            "contentDescription" : "contentDescription",
            "contentImageUrl" : "http://contentImageUrl",
            "contentIndexingMode" : "private",
            "contentMetadata" : {
                "key" : "value",
                "key2" : "value2"
            },
        });

        Ti.API.debug("canonical " + proxy.getCanonicalIdentifier());
        Ti.API.debug("title " + proxy.getTitle());
        Ti.API.debug("description " + proxy.getContentDescription());
        Ti.API.debug("contentImageUrl " + proxy.getContentImageUrl());
        Ti.API.debug("isPublicallyIndexable " + proxy.isPublicallyIndexable());

        proxy.generateShortUrl({
            "feature" : "feature",
            "alias" : "alias",
            "channel" : "channel",
            "stage" : "stage",
            "duration" : 1,
        }, {
            "$fallback_url" : "http://$fallback_url",
            "$desktop_url" : "http://$desktop_url",
            "$android_url" : "http://$android_url",
            "$ios_url" : "http://$ios_url",
            "$ipad_url" : "http://$ipad_url",
            "$fire_url" : "http://$fire_url",
            "$blackberry_url" : "http://$blackberry_url",
            "$windows_phone_url" : "http://$windows_phone_url",
        });

        // logout
        branch.logout();
    });

    function printBranchData(data) {
        Ti.API.debug("start bio:initSession");
        if (data["~channel"] != null) {
            Ti.API.debug("channel " + data["~channel"]);
        }
        if (data["~feature"] != null) {
            Ti.API.debug("feature " + data["~feature"]);
        }
        if (data["~tags"] != null) {
            Ti.API.debug("tags " + data["~tags"]);
        }
        if (data["~campaign"] != null) {
            Ti.API.debug("campaign " + data["~campaign"]);
        }
        if (data["~stage"] != null) {
            Ti.API.debug("stage " + data["~stage"]);
        }
        if (data["~creation_source"] != null) {
            Ti.API.debug("creationSource " + data["~creation_source"]);
        }
        if (data["+match_guaranteed"] != null) {
            Ti.API.debug("matchGuaranteed " + data["+match_guaranteed"]);
        }
        if (data["+referrer"] != null) {
            Ti.API.debug("referrer " + data["+referrer"]);
        }
        if (data["+phone_number"] != null) {
            Ti.API.debug("phoneNumber " + data["+phone_number"]);
        }
        if (data["+is_first_session"] != null) {
            Ti.API.debug("isFirstSession " + data["+is_first_session"]);
        }
        if (data["+clicked_branch_link"] != null) {
            Ti.API.debug("clickedBranchLink " + data["+clicked_branch_link"]);
        }
        if (data["+click_timestamp"] != null) {
            Ti.API.debug("clickTimestamp " + data["+click_timestamp"]);
        }
    }
}
else if (OS_IOS) {
    var branch = require('io.branch.sdk');

    // Initialize a session
    branch.initSession();
    
    // Retrieve session params
    var sessionParams = branch.getLatestReferringParams();
    Ti.API.debug("session parameters:");
    Ti.API.debug(sessionParams);

    // Retrieve install params
    var installParams = branch.getFirstReferringParams();
    Ti.API.debug("install parameters:");
    Ti.API.debug(installParams);

    // Persistent identities
    branch.setIdentity('my_user_id', function(params, success){
        if (success) {
            Ti.API.debug('setIdentity was successful');
        }
        else {
            Ti.API.debug('setIdentity failed!');
        }
        Ti.API.debug(params);
    });
    // Logout
    branch.logout();
    Ti.API.debug('session was logged out');
}

function doClick(e) {
    alert($.label.text);
}

$.index.open();
