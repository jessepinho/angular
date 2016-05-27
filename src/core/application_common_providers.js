'use strict';"use strict";
var lang_1 = require('angular2/src/facade/lang');
var di_1 = require('angular2/src/core/di');
var application_tokens_1 = require('./application_tokens');
var change_detection_1 = require('./change_detection/change_detection');
var view_manager_1 = require('./linker/view_manager');
var view_manager_2 = require("./linker/view_manager");
var compiler_1 = require('./linker/compiler');
var compiler_2 = require("./linker/compiler");
var dynamic_component_loader_1 = require('./linker/dynamic_component_loader');
var dynamic_component_loader_2 = require("./linker/dynamic_component_loader");
var __unused; // avoid unused import when Type union types are erased
/**
 * A default set of providers which should be included in any Angular
 * application, regardless of the platform it runs onto.
 */
exports.APPLICATION_COMMON_PROVIDERS = lang_1.CONST_EXPR([
    new di_1.Provider(compiler_1.Compiler, { useClass: compiler_2.Compiler_ }),
    application_tokens_1.APP_ID_RANDOM_PROVIDER,
    new di_1.Provider(view_manager_1.AppViewManager, { useClass: view_manager_2.AppViewManager_ }),
    new di_1.Provider(change_detection_1.IterableDiffers, { useValue: change_detection_1.defaultIterableDiffers }),
    new di_1.Provider(change_detection_1.KeyValueDiffers, { useValue: change_detection_1.defaultKeyValueDiffers }),
    new di_1.Provider(dynamic_component_loader_1.DynamicComponentLoader, { useClass: dynamic_component_loader_2.DynamicComponentLoader_ })
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25fY29tbW9uX3Byb3ZpZGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtdHVWVDN5Z2MudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2FwcGxpY2F0aW9uX2NvbW1vbl9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUErQiwwQkFBMEIsQ0FBQyxDQUFBO0FBQzFELG1CQUF1RCxzQkFBc0IsQ0FBQyxDQUFBO0FBQzlFLG1DQUlPLHNCQUFzQixDQUFDLENBQUE7QUFDOUIsaUNBS08scUNBQXFDLENBQUMsQ0FBQTtBQUM3Qyw2QkFBNkIsdUJBQXVCLENBQUMsQ0FBQTtBQUNyRCw2QkFBOEIsdUJBQXVCLENBQUMsQ0FBQTtBQUN0RCx5QkFBdUIsbUJBQW1CLENBQUMsQ0FBQTtBQUMzQyx5QkFBd0IsbUJBQW1CLENBQUMsQ0FBQTtBQUM1Qyx5Q0FBcUMsbUNBQW1DLENBQUMsQ0FBQTtBQUN6RSx5Q0FBc0MsbUNBQW1DLENBQUMsQ0FBQTtBQUUxRSxJQUFJLFFBQWMsQ0FBQyxDQUFFLHVEQUF1RDtBQUU1RTs7O0dBR0c7QUFDVSxvQ0FBNEIsR0FBbUMsaUJBQVUsQ0FBQztJQUNyRixJQUFJLGFBQVEsQ0FBQyxtQkFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLG9CQUFTLEVBQUMsQ0FBQztJQUM3QywyQ0FBc0I7SUFDdEIsSUFBSSxhQUFRLENBQUMsNkJBQWMsRUFBRSxFQUFDLFFBQVEsRUFBRSw4QkFBZSxFQUFDLENBQUM7SUFDekQsSUFBSSxhQUFRLENBQUMsa0NBQWUsRUFBRSxFQUFDLFFBQVEsRUFBRSx5Q0FBc0IsRUFBQyxDQUFDO0lBQ2pFLElBQUksYUFBUSxDQUFDLGtDQUFlLEVBQUUsRUFBQyxRQUFRLEVBQUUseUNBQXNCLEVBQUMsQ0FBQztJQUNqRSxJQUFJLGFBQVEsQ0FBQyxpREFBc0IsRUFBRSxFQUFDLFFBQVEsRUFBRSxrREFBdUIsRUFBQyxDQUFDO0NBQzFFLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VHlwZSwgQ09OU1RfRVhQUn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7cHJvdmlkZSwgUHJvdmlkZXIsIEluamVjdG9yLCBPcGFxdWVUb2tlbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtcbiAgQVBQX0NPTVBPTkVOVF9SRUZfUFJPTUlTRSxcbiAgQVBQX0NPTVBPTkVOVCxcbiAgQVBQX0lEX1JBTkRPTV9QUk9WSURFUlxufSBmcm9tICcuL2FwcGxpY2F0aW9uX3Rva2Vucyc7XG5pbXBvcnQge1xuICBJdGVyYWJsZURpZmZlcnMsXG4gIGRlZmF1bHRJdGVyYWJsZURpZmZlcnMsXG4gIEtleVZhbHVlRGlmZmVycyxcbiAgZGVmYXVsdEtleVZhbHVlRGlmZmVyc1xufSBmcm9tICcuL2NoYW5nZV9kZXRlY3Rpb24vY2hhbmdlX2RldGVjdGlvbic7XG5pbXBvcnQge0FwcFZpZXdNYW5hZ2VyfSBmcm9tICcuL2xpbmtlci92aWV3X21hbmFnZXInO1xuaW1wb3J0IHtBcHBWaWV3TWFuYWdlcl99IGZyb20gXCIuL2xpbmtlci92aWV3X21hbmFnZXJcIjtcbmltcG9ydCB7Q29tcGlsZXJ9IGZyb20gJy4vbGlua2VyL2NvbXBpbGVyJztcbmltcG9ydCB7Q29tcGlsZXJffSBmcm9tIFwiLi9saW5rZXIvY29tcGlsZXJcIjtcbmltcG9ydCB7RHluYW1pY0NvbXBvbmVudExvYWRlcn0gZnJvbSAnLi9saW5rZXIvZHluYW1pY19jb21wb25lbnRfbG9hZGVyJztcbmltcG9ydCB7RHluYW1pY0NvbXBvbmVudExvYWRlcl99IGZyb20gXCIuL2xpbmtlci9keW5hbWljX2NvbXBvbmVudF9sb2FkZXJcIjtcblxudmFyIF9fdW51c2VkOiBUeXBlOyAgLy8gYXZvaWQgdW51c2VkIGltcG9ydCB3aGVuIFR5cGUgdW5pb24gdHlwZXMgYXJlIGVyYXNlZFxuXG4vKipcbiAqIEEgZGVmYXVsdCBzZXQgb2YgcHJvdmlkZXJzIHdoaWNoIHNob3VsZCBiZSBpbmNsdWRlZCBpbiBhbnkgQW5ndWxhclxuICogYXBwbGljYXRpb24sIHJlZ2FyZGxlc3Mgb2YgdGhlIHBsYXRmb3JtIGl0IHJ1bnMgb250by5cbiAqL1xuZXhwb3J0IGNvbnN0IEFQUExJQ0FUSU9OX0NPTU1PTl9QUk9WSURFUlM6IEFycmF5PFR5cGUgfCBQcm92aWRlciB8IGFueVtdPiA9IENPTlNUX0VYUFIoW1xuICBuZXcgUHJvdmlkZXIoQ29tcGlsZXIsIHt1c2VDbGFzczogQ29tcGlsZXJffSksXG4gIEFQUF9JRF9SQU5ET01fUFJPVklERVIsXG4gIG5ldyBQcm92aWRlcihBcHBWaWV3TWFuYWdlciwge3VzZUNsYXNzOiBBcHBWaWV3TWFuYWdlcl99KSxcbiAgbmV3IFByb3ZpZGVyKEl0ZXJhYmxlRGlmZmVycywge3VzZVZhbHVlOiBkZWZhdWx0SXRlcmFibGVEaWZmZXJzfSksXG4gIG5ldyBQcm92aWRlcihLZXlWYWx1ZURpZmZlcnMsIHt1c2VWYWx1ZTogZGVmYXVsdEtleVZhbHVlRGlmZmVyc30pLFxuICBuZXcgUHJvdmlkZXIoRHluYW1pY0NvbXBvbmVudExvYWRlciwge3VzZUNsYXNzOiBEeW5hbWljQ29tcG9uZW50TG9hZGVyX30pXG5dKTsiXX0=