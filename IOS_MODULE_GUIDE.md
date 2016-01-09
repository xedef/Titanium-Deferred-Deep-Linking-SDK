# BranchSDK iOS Module for Titanium

This is a repository of our open source iOS Module for Titanium, and the information presented here serves as a reference manual for our iOS Module for Titanium. See the table of contents below for a complete list of the content featured in this document.

[Go to Repository](https://github.com/BranchMetrics/Titanium-Deferred-Deep-Linking-SDK)

1. [Get the Demo App](#get-the-demo-app)
2. [Additional Resources](#additional-resources)
3. [Installation](#installation)
4. [Initialization](#initialization)
5. [Branch Universal Object (for deep links, content analysis and indexing)](#branch-universal-object-for-deep-links-content-analysis-and-indexing)
6. [Referral system rewarding functionality](#referral-system-rewarding-functionality)



# Get the Demo App

There's a full demo app embedded in the repository, but you should also check out our
live demo: Branch Monster Factory. We've open sourced the Branchster's app as well if
you'd like to dig in.



# Additional Resources

- [Integration guide](https://dev.branch.io/recipes/add_the_sdk/titanium-ios/) **Start Here**
- [Additional Resources](https://github.com/BranchMetrics/Titanium-Deferred-Deep-Linking-SDK/ChangeLog.md)
- [Testing](https://dev.branch.io/recipes/testing_your_integration/titanium-ios/)
- [Support portal, FAQ](http://support.branch.io/)



# Installation

To use the module, navigate to the `iphone` folder.
Inside, you should be able to find the compressed module `io.branch.sdk-iphone-1.#.#.zip`. Extract the contents and copy the `iphone` folder to your titanium `modules` folder.



## Register Your App

You can sign up for your own app id at https://dashboard.branch.io



## Register URI Scheme for direct deep linking
In your project's `tiapp.xml` file, you can register your app to respond to direct deep links (`yourapp://` in a mobile browser) by adding `CFBundleURLTypes` block. Also, make sure to change `yourapp` to a unique string that represents your app name. 
In https://dashboard.branch.io/#/settings/link, tick `I have an iOS App` checkbox and enter your URI Scheme (e.g.: `yourapp://`) into the text box.

```xml
  <ios>
    <plist>
      <dict>
        <!-- Add branch key as key-value pair -->
        <key>branch_key</key>
        <string>key_live_xxxxxxxxxxxxxxx</string>
        <!-- Add unique string for direct deep links -->
        <key>CFBundleURLTypes</key>
        <array>
          <dict>
            <key>CFBundleURLSchemes</key>
            <array>
              <string>yourapp</string>
            </array>
          </dict>
        </array>
      </dict>
    </plist>
  </ios>
```



## Enabling Universal Links
In iOS 9.2, Apple dropped support for URI scheme redirects. You must enable Universal Links if you want Branch-generated links to work in your iOS app. To do this, enable `Associated Domains` capability on the Apple Developer portal when you create your app's bundle identifier. In https://dashboard.branch.io/#/settings/link, tick the `Enable Universal Links` checkbox and provide the Bundle Identifier and Apple Team ID in the appropriate boxes. Finally, create a new file named `Entitlements.plist` in the same directory as your Titanium app's `tiapp.xml` with the `associated-domains` key like below. You may add more entitlement keys if you have any.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.developer.associated-domains</key>
    <array>
        <string>applinks:bnc.lt</string>
    </array>
</dict>
</plist>
```



# Initialization

## Initialize Branch lifecycle

Initialising and closing session is done automatically in iOS. Once you do any of the following below, there is no need to close or init sessions. Branch SDK will do all that for you. You can get your Branch instance at any time as follows:

```js
var branch = require('io.branch.sdk');
branch.initSession();
```

The following works as well. Use this instead so you have the same initialization code with Android.

```js
var branch = require('io.branch.sdk');
branch.getAutoSession();
```

Implement the callback by adding a listener to the event `bio:initSession`.
The event returns a dictionary object where you can read the link the user was referred by and other related data.

Branch returns explicit parameters every time. Here is a list, and a description of what each represents.

* `~` denotes analytics
* `+` denotes information added by Branch
* (for the curious, `$` denotes reserved keywords used for controlling how the Branch service behaves)

| **Parameter** | **Meaning**
| --- | ---
| ~channel | The channel on which the link was shared, specified at link creation time
| ~feature | The feature, such as `invite` or `share`, specified at link creation time
| ~tags | Any tags, specified at link creation time
| ~campaign | The campaign the link is associated with, specified at link creation time
| ~stage | The stage, specified at link creation time
| ~creation_source | Where the link was created ('API', 'Dashboard', 'SDK', 'iOS SDK', 'Android SDK', or 'Web SDK')
| +match_guaranteed | True or false as to whether the match was made with 100% accuracy
| +referrer | The referrer for the link click, if a link was clicked
| +phone_number | The phone number of the user, if the user texted himself/herself the app
| +is_first_session | Denotes whether this is the first session (install) or any other session (open)
| +clicked_branch_link | Denotes whether or not the user clicked a Branch link that triggered this session
| +click_timestamp | Epoch timestamp of when the click occurred


**Note:** `Branch.getAutoSession()` (or the iOS-specific `Branch.initSession()`) must be called prior to calling any other Branch functions.

## Retrieve session (install or open) parameters

These session parameters will be available at any point later on with this command. If no params, the dictionary
will be empty. This refreshes with every new session (app installs AND app opens).

```js
var sessionParams = branch.getLatestReferringParams();
```

## Retrieve install (install only) parameters

If you ever want to access the original session params (the parameters passed in for the first install event only),
you can use this line. This is useful if you only want to reward users who newly installed the app from a referral
link or something.

```js
var installParams = branch.getFirstReferringParams();
```

## Persistent identities

Often, you might have your own user IDs, or want referral and event data to persist across platforms or
uninstall/reinstall. It's helpful if you know your users access your service from different devices. This where we
introduce the concept of an 'identity'.

To identify a user, just call:

```js
branch.setIdentity(identity); // your user id should not exceed 127 characters
```

## Logout

If you provide a logout function in your app, be sure to clear the user when the logout completes. This will ensure
that all the stored parameters get cleared and all events are properly attributed to the right identity.

**Warning:** This call will clear the referral credits and attribution on the device.

```js
branch.logout();
```

## Register custom events

Sometimes, you want to register your own custom events for additional info and tracking purposes. To register
a custom event:

```js
branch.userCompletedAction(customAction); // your custom event name should not exceed 63 characters
```

Some example events you might want to track:

```js
"complete_purchase"
"wrote_message"
"finished_level_ten"
```

# Branch Universal Object (for deep links, content analytics and indexing)

As more methods have evolved in iOS, we've found that it was increasingly hard to manage them all. We
abstracted as many as we could into the concept of a Branch Universal Object. This is the object that is associated
with the thing you want to share (content or user). You can set all the metadata associated with the object and
then call action methods on it to get a link or register a view.

## Defining the Branch Universal Object

The universal object is where you define all of the custom metadata associated with the content that you want to
link to or index. Please use the builder format below to create one.

```js
branchUniversalObjectProxy = branch.createBranchUniversalObject({
    // The identifier is what Branch will use to de-dupe the content across many different Universal Objects
    "canonicalIdentifier" : "sample-id",
    // This is where you define the open graph structure and how the object will appear on Facebook or in a deepview
    "title" : "Sample",
    "contentDescription" : "This is a sample",
    "contentImageUrl" : "http://sample-host.com/media/1235904.jpg",
    // You use this to specify whether this content can be discovered publicly - default is public
    "contentIndexingMode" : "private",
    // Here is where you can add custom keys/values to the deep link data
    "contentMetadata" : {
        "key" : "value",
        "key2" : "value2"
    },
});
```


## Registering a View

Branch recently launched Content Analytics which gives you insight into how engaging your content and how well
it drives growth. You'd likely want to observe how many views each piece of content has as well. Once you've
created the Universal Object, it's a simple call when the page loads.

```js
branchUniversalObjectProxy.registerView();
```

## Creating a Deep Link

Once you've created your Branch Universal Object, which is the reference to the content you're interested in,
you can then get a link back to it with the mechanisms described below. First define the properties of the link
itself.

| **Key** | Type | **Meaning**
| --- | --- |---
| feature | `string` | The feature of the link
| alias | `string` | The alias of the link
| channel | `string` | The channel of the link
| stage | `string` | The stage of the link
| duration | `int` | duration of the link.

You do custom redirection by inserting the following optional keys in the control params:

| **Key** | Type | **Meaning**
| --- | --- |---
| $fallback_url | `string` | Where to send the user for all platforms when app is not installed.
| $desktop_url | `string` | Where to send the user on a desktop or laptop. By default it is the Branch-hosted text-me service
| $android_url | `string` | The replacement URL for the Play Store to send the user if they don't have the app. Only necessary if you want a mobile web splash
| $ios_url | `string` | The replacement URL for the App Store to send the user if they don't have the app. Only necessary if you want a mobile web splash
| $ipad_url | `string` | Same as above but for iPad Store
| $fire_url | `string` | Same as above but for Amazon Fire Store
| $blackberry_url | `string` |  Same as above but for Blackberry Store
| $windows_phone_url | `string` | Same as above but for Windows Store

Then, make a request to the Universal Object in order to create the URL.

```js
branchUniversalObjectProxy.generateShortUrl({
    "feature" : "sample-feature",
    "alias" : "sample-alias",
    "channel" : "sample-channel",
    "stage" : "sample-stage",
    "duration" : 1,
}, {
    "$fallback)url" : "http://fallback-url.com",
    "$desktop_url" : "http://desktop-url.com",
    ...
});
```

After that, implement the callback by adding a listener to the event `bio:generateShortUrl`.
The event returns a string object containing the generated link.

**Note:** If you have enabled Universal links, Branch automatically returns a universal link which should work in iOS 9.2. Otherwise, you will get a branch link that still uses the deprecated (as of iOS 9.2) URI scheme redirects.

## Showing a Share Sheet

In iOS it is handled by `UIActivityViewController`. To use it, first define the custom share sheet style like so. Most of these are completely optional and we've got a great set of defaults if you don't want to spend hours customizing.

The implementation is the same with creating a deep link:

```js
branchUniversalObjectProxy.showShareSheet({
  "feature" : "sample-feature",
  "alias" : "sample-alias",
  "channel" : "sample-channel",
  "stage" : "sample-stage",
  "duration" : 1,
}, {
  "$desktop_url" : "http://desktop-url.com",
});
```

# Referral system rewarding functionality

## Get reward balance

Reward balances change randomly on the backend when certain actions are taken (defined by your rules), so you'll need to make an asynchronous call to retrieve the balance. Here is the syntax:

```js
branch.loadRewards();
```

## Redeem all or some of the reward balance (store state)

We will store how many of the rewards have been deployed so that you don't have to track it on your end. In
order to save that you gave the credits to the user, you can call redeem. Redemptions will reduce the balance of
outstanding credits permanently.

```js
branch.redeemRewards(value); // where value is an integer
```

## Get credit history

This call will retrieve the entire history of credits and redemptions from the individual user. To use this call,
implement like so:

```js
branch.creditHistory();
```

Then implement the callback, by adding a listener to the event `bio:creditHistory`.

The response will return an array that has been parsed from the following JSON:

```js
[
    {
        "transaction": {
                           "date": "2014-10-14T01:54:40.425Z",
                           "id": "50388077461373184",
                           "bucket": "default",
                           "type": 0,
                           "amount": 5
                       },
        "event" : {
            "name": "event name",
            "metadata": { your event metadata if present }
        },
        "referrer": "12345678",
        "referree": null
    },
    {
        "transaction": {
                           "date": "2014-10-14T01:55:09.474Z",
                           "id": "50388199301710081",
                           "bucket": "default",
                           "type": 2,
                           "amount": -3
                       },
        "event" : {
            "name": "event name",
            "metadata": { your event metadata if present }
        },
        "referrer": null,
        "referree": "12345678"
    }
]
```

**referrer**

The id of the referring user for this credit transaction. Returns null if no referrer is involved. Note this id is the user id in developer's own system that's previously passed to Branch's identify user API call.

**referree**

The id of the user who was referred for this credit transaction. Returns null if no referree is involved. Note this id is the user id in developer's own system that's previously passed to Branch's identify user API call.

**type**

This is the type of credit transaction
1. 0 - A reward that was added automatically by the user completing an action or referral
2. 1 - A reward that was added manually
3. 2 - A redemption of credits that occurred through our API or SDKs
4. 3 - This is a very unique case where we will subtract credits automatically when we detect fraud
