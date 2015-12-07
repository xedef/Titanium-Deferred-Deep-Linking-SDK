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
    $.rewardBalanceButton.addEventListener('click', $.onRewardBalanceButtonClicked);
    $.redeemRewardButton.addEventListener('click', $.onRedeemRewardButtonClicked);
    $.creditHistoryButton.addEventListener('click', $.onCreditHistoryButtonClicked);
    $.branchUniversalButton.addEventListener('click', $.onBranchUniversalButtonClicked);

    // Branch Listeners
    branch.addEventListener("bio:initSession", $.onInitSessionFinished);
    branch.addEventListener("bio:loadRewards", $.onLoadRewardFinished);
    branch.addEventListener("bio:getCreditHistory", $.onGetCreditHistoryFinished);
    branch.addEventListener("bio:redeemRewards", $.onRedeemRewardSuccess);
    branch.addEventListener("bio:redeemRewards:ERROR", $.onRedeemRewardFailed);

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

$.onRewardBalanceButtonClicked = function() {
    Ti.API.info("inside onRewardBalanceButtonClicked");
    branch.loadRewards();
}

$.onLoadRewardFinished = function(data) {
    Ti.API.info("inside onLoadRewardFinished");
    showData(data);
}

$.onRedeemRewardButtonClicked = function() {
    Ti.API.info("inside onRedeemRewardButtonClicked");
    branch.redeemRewards(5);
}

$.onCreditHistoryButtonClicked = function() {
    Ti.API.info("inside onCreditHistoryButtonClicked");
    branch.getCreditHistory();
}

$.onGetCreditHistoryFinished = function(data) {
    Ti.API.info("inside onGetCreditHistoryFinished");
    showData(data);
}

$.onRedeemRewardSuccess = function(data) {
    Ti.API.info("redeem reward SUCCEEDED");
    showData(data);
}

$.onRedeemRewardFailed = function(data) {
    Ti.API.info("redeem reward FAILED");
    showData(data);
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
        var dict = {};
        for (key in data) {
            if (key != "type" && key != "source" && key != "bubbles" && key != "cancelBubble") {
                dict[key] = data[key];
            }
        }

        if (OS_ANDROID) {
            alert(JSON.stringify(dict));
        } else if (OS_IOS){
            var dialog = Ti.UI.createAlertDialog({
                title  : "Result:",
                message: "" + JSON.stringify(dict),
                buttonNames: ["OK"],
            });
            dialog.show();
        }
    } else {
        for (key in data) {
            if ((key != "type" && key != "source" && key != "bubbles" && key != "cancelBubble") && data[key] != null) {
                Ti.API.info(key + data["key"]);
            }
        }
    }
}

$.initialize();
