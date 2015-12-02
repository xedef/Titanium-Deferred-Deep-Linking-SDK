var branch = require('io.branch.sdk');
var branchUniversalObjectProxy = branch.createBranchUniversalObject({
    "canonicalIdentifier" : "sample-id",
    "title" : "Sample",
    "contentDescription" : "This is a sample",
    "contentImageUrl" : "http://contentImageUrl.com/media/1235904.jpg",
    "contentIndexingMode" : "private",
    "contentMetadata" : {
        "key" : "value",
        "key2" : "value2"
    },
});

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
    $.initBranchButton.addEventListener('click', $.onInitBranchButtonClicked);
    $.registerViewButton.addEventListener('click', $.onRegisterViewButtonClicked);
    $.generateUrlButton.addEventListener('click', $.onGenerateUrlButtonClicked);
    $.shareSheetButton.addEventListener('click', $.onShareSheetButtonClicked);

    // Branch Universal Object Listeners
    if (OS_ANDROID) {
        branchUniversalObjectProxy.addEventListener("bio:generateShortUrl", $.onGenerateUrlFinished);
        branchUniversalObjectProxy.addEventListener("bio:shareLinkDialogLaunched", $.onShareLinkDialogLaunched);
        branchUniversalObjectProxy.addEventListener("bio:shareLinkDialogDismissed", $.onShareLinkDialogDismissed);
        branchUniversalObjectProxy.addEventListener("bio:shareLinkResponse", $.onShareLinkResponse);
        branchUniversalObjectProxy.addEventListener("bio:shareChannelSelected", $.onShareChannelSelected);
    }

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
$.onInitBranchButtonClicked = function() {
    Ti.API.info("inside onInitBranchButtonClicked");
    branchUniversalObjectProxy = branch.createBranchUniversalObject({
        "canonicalIdentifier" : "sample-id",
        "title" : "Sample",
        "contentDescription" : "This is a sample",
        "contentImageUrl" : "http://contentImageUrl.com/media/1235904.jpg",
        "contentIndexingMode" : "private",
        "contentMetadata" : {
            "key" : "value",
            "key2" : "value2"
        },
    });
    $.toggleButtons(true);
}

$.onRegisterViewButtonClicked = function() {
    Ti.API.info("inside onRegisterViewButtonClicked");
    branchUniversalObjectProxy.registerView();
}

$.onGenerateUrlButtonClicked = function() {
    Ti.API.info("inside onGenerateUrlButtonClicked");
    branchUniversalObjectProxy.generateShortUrl({
        "feature" : "sample-feature",
        "alias" : $.aliasTextField.getValue(),
        "channel" : "sample-channel",
        "stage" : "sample-stage",
        "duration" : 1,
    }, {
        "$desktop_url" : "http://desktop_url.com",
    });
}

$.onGenerateUrlFinished = function(data) {
    Ti.API.info("inside onGenerateUrlFinished");
    Ti.API.info("GenerateUrlFinished: " + data);
}

$.onShareSheetButtonClicked = function() {
    Ti.API.info("inside onShareSheetButtonClicked");
    branchUniversalObjectProxy.showShareSheet({
        "feature" : "share-feature",
        "alias" : $.aliasTextField.getValue(),
        "channel" : "share-channel",
        "stage" : "share-stage",
        "duration" : 1,
    }, {
        "$desktop_url" : "http://desktop_url.com",
    });
}

$.onShareLinkDialogLaunched = function(data) {
    Ti.API.info("inside onShareLinkDialogLaunched");
}

$.onShareLinkDialogDismissed = function(data) {
    Ti.API.info("inside onShareLinkDialogDismissed");
}

$.onShareLinkResponse = function(data) {
    Ti.API.info("inside onShareLinkResponse");
}

$.onShareChannelSelected = function(data) {
    Ti.API.info("inside onShareChannelSelected");
}

/*
 ************************************************
 * Methods
 ************************************************
 */
$.toggleButtons = function(enable) {
    $.registerViewButton.enabled = enable;
    $.generateUrlButton.enabled = enable;
    $.shareSheetButton.enabled = enable;
}

$.initialize();
