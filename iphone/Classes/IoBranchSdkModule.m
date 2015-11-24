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

- (Branch *)getInstance:(id)args
{
    ENSURE_SINGLE_ARG(args, NSString);
    NSString *branchKey = (NSString *)[args objectAtIndex:0];
    if (branchKey) {
        return [Branch getInstance:branchKey];
    }
    else {
        return [self getInstance];
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

- (void)initSession
{
    Branch *branch = [self getInstance];
    [branch initSession];
    NSLog(@"session initialized");
}

- (void)initSession:(id)args
{
    ENSURE_SINGLE_ARG(args, NSDictionary);
    
    id arg = [args objectAtIndex:0];
    ENSURE_TYPE([arg objectForKey:@"isReferrable"], NSNumber);
    
    Branch *branch = [self getInstance];
    BOOL isReferrable = [TiUtils boolValue:arg];
    
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
    ENSURE_SINGLE_ARG(args, NSDictionary);
    
    Branch *branch = [self getInstance];
    NSDictionary *launchOptions = [[TiApp app] launchOptions];
    
    id arg = [args objectAtIndex:0];
    ENSURE_TYPE([arg objectForKey:@"display"], NSNumber);
    BOOL display = [TiUtils boolValue:@"display" properties:arg def:YES];
    
    KrollCallback *deepLinkHandler = [arg objectForKey:@"deepLinkHandler"];
    ENSURE_TYPE(deepLinkHandler, KrollCallback);
    
    [branch initSessionWithLaunchOptions:launchOptions automaticallyDisplayDeepLinkController:display deepLinkHandler:^(NSDictionary *params, NSError *error) {
        if (!error) {
            NSLog(@"finished init with params = %@", [params description]);
            [deepLinkHandler call:@[params, error] thisObject:nil];
        }
        else {
            NSLog(@"failed init: %@", error);
            [deepLinkHandler call:@[params, error] thisObject:nil];
        }
    }];
}

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
