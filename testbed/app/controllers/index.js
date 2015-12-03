var branch = require('io.branch.sdk');

/*
 ************************************************
 * Create custom loading indicator
 ************************************************
 */
var actInd;
var indView;
var indicatorShowing = false;

var USE_ALERT = true; // use alerts to show responses or print them otherwise

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
    showData(data);
    $.toggleButtons(true);
    Ti.App.fireEvent("hide_indicator");
}

$.onGetSessionButtonClicked = function() {
    Ti.API.info("inside onGetSessionButtonClicked");
    var sessionParams = branch.getLatestReferringParams();
    showData(sessionParams);
}

$.onGetInstallSessionButtonClicked = function() {
    Ti.API.info("inside onGetInstallSessionButtonClicked");
    var installParams = branch.getFirstReferringParams();
    showData(installParams);
}

$.onSetIdentityButtonClicked = function() {
    Ti.API.info("inside onSetIdentityButtonClicked");
    if (OS_ANDROID) {
        branch.setIdentity($.identityTextField.getValue());
        Ti.API.debug("set identity: " + $.identityTextField.getValue());
    } else if (OS_IOS) {
        branch.setIdentity($.identityTextField.getValue(), function(params, success){
            if (success) {
                alert("set identity: "+JSON.stringify(params));
            }
            else {
                alert("Set Identity FAILED");
            }
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

function showData(data) {
    Ti.API.info("start showData");

    if (USE_ALERT) {
        if (OS_ANDROID) {
            alert(JSON.stringify(data));
        } else if (OS_IOS){
            var dialog = Ti.UI.createAlertDialog({
                title  : "Result:",
                message: "" + JSON.stringify(data),
                buttonNames: ["OK"],
            });
            dialog.show();
        }
    } else {
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
}

$.initialize();
