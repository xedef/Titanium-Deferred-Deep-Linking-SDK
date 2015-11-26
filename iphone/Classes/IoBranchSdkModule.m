/**
 * Titanium-Deferred-Deep-Linking-SDK
 *
 * Created by Jestoni Yap
 * Copyright (c) 2015 Your Company. All rights reserved.
 */

#import "IoBranchSdkModule.h"
#import "TiApp.h"
#import "TiBase.h"
#import "TiHost.h"
#import "TiUtils.h"

#import "Branch-SDK/Branch.h"

@implementation IoBranchSdkModule

#pragma mark Internal

// this is generated for your module, please do not change it
- (id)moduleGUID
{
	return @"df14a182-464d-4940-bc1d-ae84730366a8";
}

// this is generated for your module, please do not change it
- (NSString*)moduleId
{
	return @"io.branch.sdk";
}

#pragma mark Lifecycle

- (void)startup
{
	// this method is called when the module is first loaded
	// you *must* call the superclass
	[super startup];

	NSLog(@"[INFO] %@ loaded",self);
}

- (void)shutdown:(id)sender
{
	// this method is called when the module is being unloaded
	// typically this is during shutdown. make sure you don't do too
	// much processing here or the app will be quit forceably

	// you *must* call the superclass
	[super shutdown:sender];
}

#pragma mark Internal Memory Management

- (void)didReceiveMemoryWarning:(NSNotification*)notification
{
	// optionally release any resources that can be dynamically
	// reloaded once memory is available - such as caches
	[super didReceiveMemoryWarning:notification];
}

#pragma mark Listener Notifications

- (void)_listenerAdded:(NSString *)type count:(int)count
{
	if (count == 1 && [type isEqualToString:@"my_event"])
	{
		// the first (of potentially many) listener is being added
		// for event named 'my_event'
	}
}

- (void)_listenerRemoved:(NSString *)type count:(int)count
{
	if (count == 0 && [type isEqualToString:@"my_event"])
	{
		// the last listener called for event named 'my_event' has
		// been removed, we can optionally clean up any resources
		// since no body is listening at this point for that event
	}
}

#pragma mark Public APIs
#pragma mark - Global Instance Accessors

- (Branch *)getInstance
{
    return [Branch getInstance];
}

- (Branch *)getInstance:(NSString *)branchKey
{
    if (branchKey) {
        return [Branch getInstance:branchKey];
    }
    else {
        return [Branch getInstance];
    }
}

- (Branch *)getTestInstance
{
    return [Branch getTestInstance];
}

- (void)setDebug
{
    [[Branch getInstance] setDebug];
}


#pragma mark - InitSession Permutation methods

- (void)initSession:(id)args
{
    Branch *branch = [self getInstance];
    NSDictionary *launchOptions = [[TiApp app] launchOptions];
    
    [branch initSessionWithLaunchOptions:launchOptions];
    NSLog(@"session initialized");
}

- (void)initSessionIsReferrable:(id)args
{
    ENSURE_SINGLE_ARG(args, NSNumber);
    
    Branch *branch = [self getInstance];
    BOOL isReferrable = [TiUtils boolValue:args];
    
    [branch initSession:isReferrable];
}

- (void)initSessionAndAutomaticallyDisplayDeepLinkController:(id)args
{
    ENSURE_ARG_COUNT(args, 1);
    
    Branch *branch = [self getInstance];
    id arg = [args objectAtIndex:0];
    BOOL automaticallyDisplayController = [TiUtils boolValue:arg];
    
    [branch initSessionAndAutomaticallyDisplayDeepLinkController:automaticallyDisplayController];
}

- (void)initSessionWithLaunchOptionsAndAutomaticallyDisplayDeepLinkController:(id)args
{
    ENSURE_SINGLE_ARG(args, KrollCallback);
    
    Branch *branch = [self getInstance];
    NSDictionary *launchOptions = [[TiApp app] launchOptions];
    BOOL display = YES;
    
    KrollCallback *deepLinkHandler = args;
    
    [branch initSessionWithLaunchOptions:launchOptions automaticallyDisplayDeepLinkController:display deepLinkHandler:^(NSDictionary *params, NSError *error) {
        if (!error) {
            [deepLinkHandler call:@[params, NUMBOOL(YES)] thisObject:nil];
        }
        else {
            [deepLinkHandler call:@[params, NUMBOOL(NO)] thisObject:nil];
        }
    }];
}


#pragma mark - retrieve session/install params
- (NSDictionary *)getLatestReferringParams:(id)args
{
    ENSURE_ARG_COUNT(args, 0);
    
    Branch *branch = [self getInstance];
    NSDictionary *sessionParams = [branch getLatestReferringParams];
    
    return sessionParams;
}

- (NSDictionary *)getFirstReferringParams:(id)args
{
    ENSURE_ARG_COUNT(args, 0);
    
    Branch *branch = [self getInstance];
    NSDictionary *installParams = [branch getFirstReferringParams];
    
    return installParams;
}


#pragma mark - set identity

- (void)setIdentity:(id)args
{
    Branch *branch = [self getInstance];
    NSString *userId = nil;
    KrollCallback *callback = nil;
    
    // if a callback is passed as an argument
    if ([args count]==2) {
        ENSURE_TYPE([args objectAtIndex:0], NSString);
        userId = [args objectAtIndex:0];
        
        ENSURE_TYPE([args objectAtIndex:1], KrollCallback);
        callback = [args objectAtIndex:1];
    }
    else {
        ENSURE_SINGLE_ARG(args, NSString);
        userId = (NSString *)args;
    }
    
    if (!callback) {
        [branch setIdentity:userId];
    }
    else {
        [branch setIdentity:userId withCallback:^(NSDictionary *params, NSError *error) {
            if (!error) {
                [callback call:@[params, NUMBOOL(YES)] thisObject:nil];
            }
            else {
                [callback call:@[params, NUMBOOL(NO)] thisObject:nil];
            }
        }];
    }
}


#pragma mark - handle deep link

- (id)handleDeepLink:(id)args
{
    ENSURE_SINGLE_ARG(args, NSString);
    NSString *arg = [args objectAtIndex:0];
    NSURL *url = [NSURL URLWithString:arg];
    
    Branch *branch = [self getInstance];
    return NUMBOOL([branch handleDeepLink:url]);
}


#pragma mark - URL methods

- (NSString *)getLongURLWithParams:(id)args
{
    ENSURE_SINGLE_ARG(args, NSDictionary);
    id params = [args objectAtIndex:0];
    return [[self getInstance] getLongURLWithParams:params];
}

- (NSString *)getContentUrlWithParams:(id)args
{
    ENSURE_ARG_COUNT(args, 2);
    ENSURE_TYPE([args objectAtIndex:0], NSDictionary);
    ENSURE_TYPE([args objectAtIndex:1], NSString);
    
    NSDictionary *params = [args objectAtIndex:0];
    NSString *channel = [args objectAtIndex:1];
    
    Branch *branch = [self getInstance];
    
    return [branch getContentUrlWithParams:params andChannel:channel];
}


#pragma mark - logout

- (void)logout
{
    Branch *branch = [self getInstance];
    [branch logout];
}

@end
