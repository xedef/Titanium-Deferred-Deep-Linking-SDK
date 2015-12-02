var branch = require('io.branch.sdk');

/*
 ************************************************
 * Create custom loading indicator
 ************************************************
 */
var actInd;
var indView;
var indicatorShowing = false;

function showIndicator(title) {
    indicatorShowing = true;

    // black view
    indView = Titanium.UI.createView({
        height:50,
        width: 125,
        backgroundColor: '#000',
        borderRadius: 10,
        opacity: 0.7
    });

    var style;

    if (OS_IOS) {
        style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
    } else {
        style = Ti.UI.ActivityIndicatorStyle.DARK;
    }

    actInd = Titanium.UI.createActivityIndicator({
        style: style,
        font: {
            fontFamily: 'Helvetica Neue',
            fontSize: 15,
            fontWeight: 'bold'
        },
        color: 'white',
        message: title,
        width: 210
    });

    indView.add(actInd);
    $.window.add(indView);

    actInd.show();
}

function hideIndicator() {
    if(indicatorShowing == true) {
        if (actInd) {
            actInd.hide();
        }
        if(indView != null) {
            $.window.remove(indView);
            indView = null
        }
        indicatorShowing = false;
    }
}

/*
 ************************************************
 * Initializers
 ************************************************
 */
$.initialize = function(params) {
    $.initializeViews();
    $.initializeHandlers();
    $.window.open();
    $.toggleButtons(false);
};

$.initializeViews = function() {
    Ti.API.info("start initializeViews");
};

$.initializeHandlers = function() {
    $.initSessionButton.addEventListener('click', $.onInitSessionButtonClicked);
    $.logoutSessionButton.addEventListener('click', $.onLogoutSessionButtonClicked);
    $.getSessionButton.addEventListener('click', $.onGetSessionButtonClicked);
    $.getInstallSessionButton.addEventListener('click', $.onGetInstallSessionButtonClicked);
    $.setIndentityButton.addEventListener('click', $.onSetIdentityButtonClicked);
    $.customActionButton.addEventListener('click', $.onCustomActionButtonClicked);
    $.branchUniversalButton.addEventListener('click', $.onBranchUniversalButtonClicked);

    // Branch Listeners
    branch.addEventListener("bio:initSession", $.onInitSessionFinished);


    // Add global event handlers to hide/show custom indicator
    Titanium.App.addEventListener('show_indicator', function(e) {
        if(e.title == null) {
            e.title = 'Loading... ';
        }
        if(indicatorShowing == true) {
            hideIndicator();
        }
        showIndicator(e.title);
    });
    Titanium.App.addEventListener('hide_indicator', function(e) {
        hideIndicator();
    });
};

/*
 ************************************************
 * Event Handlers
 ************************************************
 */
$.onInitSessionButtonClicked = function() {
    Ti.API.info("inside onInitSessionButtonClicked");
    branch.initSession();
    Ti.App.fireEvent("show_indicator");
}

$.onInitSessionFinished = function(data) {
    Ti.API.info("inside onInitSessionFinished");
    printBranchData(data);
    $.toggleButtons(true);
    Ti.App.fireEvent("hide_indicator");
}

$.onGetSessionButtonClicked = function() {
    Ti.API.info("inside onGetSessionButtonClicked");
    var sessionParams = branch.getLatestReferringParams();

    if (OS_ANDROID) {
        Ti.API.debug("session parameters:");
        printBranchData(sessionParams);
    } else if (OS_IOS) {
        var dialog = Ti.UI.createAlertDialog({
            title  : "session parameters:",
            message: ""+JSON.stringify(sessionParams),
            buttonNames: ["OK"],
        });
        dialog.show();
    }
}

$.onGetInstallSessionButtonClicked = function() {
    Ti.API.info("inside onGetInstallSessionButtonClicked");
    var installParams = branch.getFirstReferringParams();

    if (OS_ANDROID) {
        Ti.API.debug("install parameters:");
        printBranchData(installParams);
    } else if (OS_IOS) {
        var dialog = Ti.UI.createAlertDialog({
            title  : "install parameters:",
            message: ""+JSON.stringify(installParams),
            buttonNames: ["OK"],
        });
        dialog.show();
    }
}

$.onSetIdentityButtonClicked = function() {
    Ti.API.info("inside onSetIdentityButtonClicked");

    if (OS_ANDROID) {
        branch.setIdentity($.identityTextField.getValue());
        Ti.API.debug("set identity: " + $.identityTextField.getValue());
    } else if (OS_IOS) {
        branch.setIdentity($.identityTextField.getValue(), function(params, success){
            var dialog = null;
            if (success) {
                dialog = Ti.UI.createAlertDialog({
                    title  : "set identity:",
                    message: ""+$.identityTextField.getValue(),
                    buttonNames: ["OK"],
                });
            }
            else {
                dialog = Ti.UI.createAlertDialog({
                    title  : "set identity:",
                    message: "Set Identity FAILED",
                    buttonNames: ["OK"],
                });
            }
            dialog.show();
        });
    }
}

$.onCustomActionButtonClicked = function() {
    Ti.API.info("inside onCustomActionButtonClicked");
    branch.userCompletedAction($.customActionTextField.getValue());
    Ti.API.info("user completed action: " + $.customActionTextField.getValue());
}

$.onBranchUniversalButtonClicked = function() {
    Ti.API.info("inside onBranchUniversalButtonClicked");
    var branchUniversalWin = Alloy.createController('branchUniversal', {});
    view = branchUniversalWin.getView();
    view.open();
}

$.onLogoutSessionButtonClicked = function() {
    Ti.API.info("inside onLogoutSessionButtonClicked");
    branch.logout();
    alert("Successfully logged out of session.");
    $.toggleButtons(false);
}

/*
 ************************************************
 * Methods
 ************************************************
 */
$.toggleButtons = function(enable) {
    $.logoutSessionButton.enabled = enable;
    $.getSessionButton.enabled = enable;
    $.getInstallSessionButton.enabled = enable;
    $.setIndentityButton.enabled = enable;
    $.customActionButton.enabled = enable;
    $.identityTextField.enabled = enable;
    $.customActionTextField.enabled = enable;
    $.branchUniversalButton.enabled = enable;
}

function printBranchData(data) {
    Ti.API.info("start bio:initSession");
    if (data["~channel"] != null) {
        Ti.API.info("channel " + data["~channel"]);
    }
    if (data["~feature"] != null) {
        Ti.API.info("feature " + data["~feature"]);
    }
    if (data["~tags"] != null) {
        Ti.API.info("tags " + data["~tags"]);
    }
    if (data["~campaign"] != null) {
        Ti.API.info("campaign " + data["~campaign"]);
    }
    if (data["~stage"] != null) {
        Ti.API.info("stage " + data["~stage"]);
    }
    if (data["~creation_source"] != null) {
        Ti.API.info("creationSource " + data["~creation_source"]);
    }
    if (data["+match_guaranteed"] != null) {
        Ti.API.info("matchGuaranteed " + data["+match_guaranteed"]);
    }
    if (data["+referrer"] != null) {
        Ti.API.info("referrer " + data["+referrer"]);
    }
    if (data["+phone_number"] != null) {
        Ti.API.info("phoneNumber " + data["+phone_number"]);
    }
    if (data["+is_first_session"] != null) {
        Ti.API.info("isFirstSession " + data["+is_first_session"]);
    }
    if (data["+clicked_branch_link"] != null) {
        Ti.API.info("clickedBranchLink " + data["+clicked_branch_link"]);
    }
    if (data["+click_timestamp"] != null) {
        Ti.API.info("clickTimestamp " + data["+click_timestamp"]);
    }
}

// Initialize a session
//branch.initSession();
// branch.initSessionWithLaunchOptionsAndAutomaticallyDisplayDeepLinkController( function(params, success) {
//     if (success) {
//         Ti.API.debug('init success');

//         // Retrieve session params
//         var sessionParams = branch.getLatestReferringParams();
//         Ti.API.debug("session parameters:");
//         Ti.API.debug(sessionParams);

//         // Retrieve install params
//         var installParams = branch.getFirstReferringParams();
//         Ti.API.debug("install parameters:");
//         Ti.API.debug(installParams);

//         // Persistent identities
//         branch.setIdentity('my_user_id', function(params, success){
//             if (success) {
//                 Ti.API.debug('setIdentity was successful');
//             }
//             else {
//                 Ti.API.debug('setIdentity failed!');
//             }

//             // Branch Universal Object
//             var branchUniversal = branch.createBranchUniversal();
//             var universalObj = branchUniversal.initWithCanonicalIdentifier('item/12345');

//             universalObj.title = 'My Content Title';
//             universalObj.contentDescription = 'My Content Description';
//             universal.Obj.imageUrl = 'https://example.com/mycontent-12345.png';

//             Ti.API.debug('Branch Universal properties:');
//             Ti.API.debug(universalObj.canonicalIdentifier);
//             Ti.API.debug(universalObj.title);
//             Ti.API.debug(universalObj.contentDescription);
//             Ti.API.debug(universalObj.imageUrl);

//             // Logout
//             branch.logout();
//             Ti.API.debug('session was logged out');
//         });
//     }
//     else {
//         Ti.API.debug('init failed');
//     }
//     Ti.API.debug('init completed');
// });

// if (OS_ANDROID) {
//     // Initialize a session
//     branch.initSession();

//     // Event handler for initSession
//     branch.addEventListener("bio:initSession", function(data) {
//         Ti.API.debug("inside bio:initSession");
//         printBranchData(data);

//         // Retrieve latest session parameters
//         var sessionParams = branch.getLatestReferringParams();
//         Ti.API.debug("session parameters:");
//         printBranchData(sessionParams);

//         // Retrieve install session parameters
//         var installParams = branch.getFirstReferringParams();
//         Ti.API.debug("install parameters:");
//         printBranchData(installParams);

//         // Set identity
//         branch.setIdentity("test");

//         // Register custom events
//         branch.userCompletedAction("pressed_custom_button");

//         var proxy = branch.createBranchUniversalObject({
//             "canonicalIdentifier" : "identifier",
//             "title" : "title",
//             "contentDescription" : "contentDescription",
//             "contentImageUrl" : "http://contentImageUrl",
//             "contentIndexingMode" : "private",
//             "contentMetadata" : {
//                 "key" : "value",
//                 "key2" : "value2"
//             },
//         });

//         Ti.API.debug("canonical " + proxy.getCanonicalIdentifier());
//         Ti.API.debug("title " + proxy.getTitle());
//         Ti.API.debug("description " + proxy.getContentDescription());
//         Ti.API.debug("contentImageUrl " + proxy.getContentImageUrl());
//         Ti.API.debug("isPublicallyIndexable " + proxy.isPublicallyIndexable());

// proxy.showShareSheet({
//     "feature"  : "feature",
//     "alias"    : "alias",
//     "channel"  : "channel",
//     "stage"    : "stage",
//     "duration" : 1
// }, {
//     "$fallback_url" : "$fallback_url"
// });

//         proxy.generateShortUrl({
//             "feature" : "feature",
//             "alias" : "alias",
//             "channel" : "channel",
//             "stage" : "stage",
//             "duration" : 1,
//         }, {
//             "$fallback_url" : "http://$fallback_url",
//             "$desktop_url" : "http://$desktop_url",
//             "$android_url" : "http://$android_url",
//             "$ios_url" : "http://$ios_url",
//             "$ipad_url" : "http://$ipad_url",
//             "$fire_url" : "http://$fire_url",
//             "$blackberry_url" : "http://$blackberry_url",
//             "$windows_phone_url" : "http://$windows_phone_url",
//         });

//         // logout
//         branch.logout();
//     });
// }
// else if (OS_IOS) {
//     // Initialize a session
//     branch.initSession();

//     // Retrieve session params
//     var sessionParams = branch.getLatestReferringParams();
//     Ti.API.debug("session parameters:");
//     Ti.API.debug(sessionParams);

//     // Retrieve install params
//     var installParams = branch.getFirstReferringParams();
//     Ti.API.debug("install parameters:");
//     Ti.API.debug(installParams);

//     // Persistent identities
//     branch.setIdentity('my_user_id', function(params, success){
//         if (success) {
//             Ti.API.debug('setIdentity was successful');
//         }
//         else {
//             Ti.API.debug('setIdentity failed!');
//         }
//         Ti.API.debug(params);
//     });
//     // Logout
//     branch.logout();
//     Ti.API.debug('session was logged out');
// }

$.initialize();
