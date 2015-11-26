//
//  IoBranchSdkBranchUniversalProxy.m
//  Titanium-Deferred-Deep-Linking-SDK
//
//  Created by Kevin Milo on 26/11/2015.
//
//

#import "IoBranchSdkBranchUniversalProxy.h"

@implementation IoBranchSdkBranchUniversalProxy

- (id)initWithCanonicalIdentifier:(id)args
{
    ENSURE_SINGLE_ARG(args, NSString);
    if (!self.branchUniversalObj) {
        self.branchUniversalObj = [[BranchUniversalObject alloc] initWithCanonicalIdentifier:args];
    }
    else {
        self.branchUniversalObj.canonicalIdentifier = args;
    }
    
    return self;
}

- (id)initWithTitle:(id)args
{
    ENSURE_SINGLE_ARG(args, NSString);
    if (!self.branchUniversalObj){
        self.branchUniversalObj = [[BranchUniversalObject alloc] initWithTitle:args];
    }
    else {
        self.branchUniversalObj.title = args;
    }

    return self;
}

- (void)addMetadata:(id)args
{
    ENSURE_SINGLE_ARG(args, NSDictionary);
    [self.branchUniversalObj addMetadataKey:[args objectForKey:@"key"] value:[args objectForKey:@"value"]];
}

- (void)registerView:(id)args
{
    ENSURE_ARG_COUNT(args, 0);
    [self.branchUniversalObj registerView];
}

@end
