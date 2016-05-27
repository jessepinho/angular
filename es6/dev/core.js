/**
 * @module
 * @description
 * Starting point to import all public core APIs.
 */
export * from './src/core/metadata';
export * from './src/core/util';
export * from './src/core/prod_mode';
export * from './src/core/di';
export * from './src/facade/facade';
export { enableProdMode } from 'angular2/src/facade/lang';
export { platform, createNgZone, PlatformRef, ApplicationRef } from './src/core/application_ref';
export { APP_ID, APP_COMPONENT, APP_INITIALIZER, PACKAGE_ROOT_URL, PLATFORM_INITIALIZER } from './src/core/application_tokens';
export * from './src/core/zone';
export * from './src/core/render';
export * from './src/core/linker';
export { DebugElement, DebugNode, asNativeElements } from './src/core/debug/debug_node';
export * from './src/core/testability/testability';
export * from './src/core/change_detection';
export * from './src/core/platform_directives_and_pipes';
export * from './src/core/platform_common_providers';
export * from './src/core/application_common_providers';
export * from './src/core/reflection/reflection';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtc200NmxFNHQudG1wL2FuZ3VsYXIyL2NvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUNILGNBQWMscUJBQXFCLENBQUM7QUFDcEMsY0FBYyxpQkFBaUIsQ0FBQztBQUNoQyxjQUFjLHNCQUFzQixDQUFDO0FBQ3JDLGNBQWMsZUFBZSxDQUFDO0FBQzlCLGNBQWMscUJBQXFCLENBQUM7QUFDcEMsU0FBUSxjQUFjLFFBQU8sMEJBQTBCLENBQUM7QUFDeEQsU0FBUSxRQUFRLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxjQUFjLFFBQU8sNEJBQTRCLENBQUM7QUFDL0YsU0FDRSxNQUFNLEVBQ04sYUFBYSxFQUNiLGVBQWUsRUFDZixnQkFBZ0IsRUFDaEIsb0JBQW9CLFFBQ2YsK0JBQStCLENBQUM7QUFDdkMsY0FBYyxpQkFBaUIsQ0FBQztBQUNoQyxjQUFjLG1CQUFtQixDQUFDO0FBQ2xDLGNBQWMsbUJBQW1CLENBQUM7QUFDbEMsU0FBUSxZQUFZLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixRQUFPLDZCQUE2QixDQUFDO0FBQ3RGLGNBQWMsb0NBQW9DLENBQUM7QUFDbkQsY0FBYyw2QkFBNkIsQ0FBQztBQUM1QyxjQUFjLDBDQUEwQyxDQUFDO0FBQ3pELGNBQWMsc0NBQXNDLENBQUM7QUFDckQsY0FBYyx5Q0FBeUMsQ0FBQztBQUN4RCxjQUFjLGtDQUFrQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbW9kdWxlXG4gKiBAZGVzY3JpcHRpb25cbiAqIFN0YXJ0aW5nIHBvaW50IHRvIGltcG9ydCBhbGwgcHVibGljIGNvcmUgQVBJcy5cbiAqL1xuZXhwb3J0ICogZnJvbSAnLi9zcmMvY29yZS9tZXRhZGF0YSc7XG5leHBvcnQgKiBmcm9tICcuL3NyYy9jb3JlL3V0aWwnO1xuZXhwb3J0ICogZnJvbSAnLi9zcmMvY29yZS9wcm9kX21vZGUnO1xuZXhwb3J0ICogZnJvbSAnLi9zcmMvY29yZS9kaSc7XG5leHBvcnQgKiBmcm9tICcuL3NyYy9mYWNhZGUvZmFjYWRlJztcbmV4cG9ydCB7ZW5hYmxlUHJvZE1vZGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5leHBvcnQge3BsYXRmb3JtLCBjcmVhdGVOZ1pvbmUsIFBsYXRmb3JtUmVmLCBBcHBsaWNhdGlvblJlZn0gZnJvbSAnLi9zcmMvY29yZS9hcHBsaWNhdGlvbl9yZWYnO1xuZXhwb3J0IHtcbiAgQVBQX0lELFxuICBBUFBfQ09NUE9ORU5ULFxuICBBUFBfSU5JVElBTElaRVIsXG4gIFBBQ0tBR0VfUk9PVF9VUkwsXG4gIFBMQVRGT1JNX0lOSVRJQUxJWkVSXG59IGZyb20gJy4vc3JjL2NvcmUvYXBwbGljYXRpb25fdG9rZW5zJztcbmV4cG9ydCAqIGZyb20gJy4vc3JjL2NvcmUvem9uZSc7XG5leHBvcnQgKiBmcm9tICcuL3NyYy9jb3JlL3JlbmRlcic7XG5leHBvcnQgKiBmcm9tICcuL3NyYy9jb3JlL2xpbmtlcic7XG5leHBvcnQge0RlYnVnRWxlbWVudCwgRGVidWdOb2RlLCBhc05hdGl2ZUVsZW1lbnRzfSBmcm9tICcuL3NyYy9jb3JlL2RlYnVnL2RlYnVnX25vZGUnO1xuZXhwb3J0ICogZnJvbSAnLi9zcmMvY29yZS90ZXN0YWJpbGl0eS90ZXN0YWJpbGl0eSc7XG5leHBvcnQgKiBmcm9tICcuL3NyYy9jb3JlL2NoYW5nZV9kZXRlY3Rpb24nO1xuZXhwb3J0ICogZnJvbSAnLi9zcmMvY29yZS9wbGF0Zm9ybV9kaXJlY3RpdmVzX2FuZF9waXBlcyc7XG5leHBvcnQgKiBmcm9tICcuL3NyYy9jb3JlL3BsYXRmb3JtX2NvbW1vbl9wcm92aWRlcnMnO1xuZXhwb3J0ICogZnJvbSAnLi9zcmMvY29yZS9hcHBsaWNhdGlvbl9jb21tb25fcHJvdmlkZXJzJztcbmV4cG9ydCAqIGZyb20gJy4vc3JjL2NvcmUvcmVmbGVjdGlvbi9yZWZsZWN0aW9uJztcbiJdfQ==