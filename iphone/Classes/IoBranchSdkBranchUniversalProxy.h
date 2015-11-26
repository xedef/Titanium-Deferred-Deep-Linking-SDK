//
//  IoBranchSdkBranchUniversalProxy.h
//  Titanium-Deferred-Deep-Linking-SDK
//
//  Created by Kevin Milo on 26/11/2015.
//
//

#import "TiProxy.h"
#import "BranchUniversalObject.h"

@interface IoBranchSdkBranchUniversalProxy : TiProxy

@property (copy) NSString *canonicalIdentifier;
@property (copy) NSString *title;
@property (copy) NSString *contentDescription;
@property (copy) NSString *imageUrl;
// Note: properties found in metadata will overwrite properties on the BranchUniversal itself
@property (copy) NSDictionary *metadata;
@property (copy) NSString *type;
@property (copy) NSArray *keywords;
@property (copy) NSDate *expirationDate;

@property (strong, nonatomic) BranchUniversalObject *branchUniversalObj;


- (id)initWithCanonicalIdentifier:(id)args;
- (id)initWithTitle:(id)args;
- (void)addMetadata:(id)args;
- (void)registerView:(id)args;

@end
