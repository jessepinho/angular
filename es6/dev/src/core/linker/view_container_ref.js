import { ListWrapper } from 'angular2/src/facade/collection';
import { unimplemented } from 'angular2/src/facade/exceptions';
import { Injector_, ProtoInjector } from 'angular2/src/core/di/injector';
import { isPresent } from 'angular2/src/facade/lang';
import { wtfCreateScope, wtfLeave } from '../profile/profile';
/**
 * Represents a container where one or more Views can be attached.
 *
 * The container can contain two kinds of Views. Host Views, created by instantiating a
 * {@link Component} via {@link #createHostView}, and Embedded Views, created by instantiating an
 * {@link TemplateRef Embedded Template} via {@link #createEmbeddedView}.
 *
 * The location of the View Container within the containing View is specified by the Anchor
 * `element`. Each View Container can have only one Anchor Element and each Anchor Element can only
 * have a single View Container.
 *
 * Root elements of Views attached to this container become siblings of the Anchor Element in
 * the Rendered View.
 *
 * To access a `ViewContainerRef` of an Element, you can either place a {@link Directive} injected
 * with `ViewContainerRef` on the Element, or you obtain it via
 * {@link AppViewManager#getViewContainer}.
 *
 * <!-- TODO(i): we are also considering ElementRef#viewContainer api -->
 */
export class ViewContainerRef {
    /**
     * Anchor element that specifies the location of this container in the containing View.
     * <!-- TODO: rename to anchorElement -->
     */
    get element() { return unimplemented(); }
    /**
     * Returns the number of Views currently attached to this container.
     */
    get length() { return unimplemented(); }
    ;
}
export class ViewContainerRef_ {
    constructor(_element) {
        this._element = _element;
        /** @internal */
        this._createEmbeddedViewInContainerScope = wtfCreateScope('ViewContainerRef#createEmbeddedView()');
        /** @internal */
        this._createHostViewInContainerScope = wtfCreateScope('ViewContainerRef#createHostView()');
        /** @internal */
        this._insertScope = wtfCreateScope('ViewContainerRef#insert()');
        /** @internal */
        this._removeScope = wtfCreateScope('ViewContainerRef#remove()');
        /** @internal */
        this._detachScope = wtfCreateScope('ViewContainerRef#detach()');
    }
    get(index) { return this._element.nestedViews[index].ref; }
    get length() {
        var views = this._element.nestedViews;
        return isPresent(views) ? views.length : 0;
    }
    get element() { return this._element.ref; }
    // TODO(rado): profile and decide whether bounds checks should be added
    // to the methods below.
    createEmbeddedView(templateRef, index = -1) {
        var s = this._createEmbeddedViewInContainerScope();
        if (index == -1)
            index = this.length;
        var templateRef_ = templateRef;
        var view = templateRef_.createEmbeddedView();
        this._element.attachView(view, index);
        return wtfLeave(s, view.ref);
    }
    createHostView(hostViewFactoryRef, index = -1, dynamicallyCreatedProviders = null, projectableNodes = null) {
        var s = this._createHostViewInContainerScope();
        if (index == -1)
            index = this.length;
        var contextEl = this._element;
        var contextInjector = this._element.parentInjector;
        var hostViewFactory = hostViewFactoryRef.internalHostViewFactory;
        var childInjector = isPresent(dynamicallyCreatedProviders) && dynamicallyCreatedProviders.length > 0 ?
            new Injector_(ProtoInjector.fromResolvedProviders(dynamicallyCreatedProviders), contextInjector) :
            contextInjector;
        var view = hostViewFactory.viewFactory(contextEl.parentView.viewManager, childInjector, contextEl);
        view.create(projectableNodes, null);
        this._element.attachView(view, index);
        return wtfLeave(s, view.ref);
    }
    // TODO(i): refactor insert+remove into move
    insert(viewRef, index = -1) {
        var s = this._insertScope();
        if (index == -1)
            index = this.length;
        var viewRef_ = viewRef;
        this._element.attachView(viewRef_.internalView, index);
        return wtfLeave(s, viewRef_);
    }
    indexOf(viewRef) {
        return ListWrapper.indexOf(this._element.nestedViews, viewRef.internalView);
    }
    // TODO(i): rename to destroy
    remove(index = -1) {
        var s = this._removeScope();
        if (index == -1)
            index = this.length - 1;
        var view = this._element.detachView(index);
        view.destroy();
        // view is intentionally not returned to the client.
        wtfLeave(s);
    }
    // TODO(i): refactor insert+remove into move
    detach(index = -1) {
        var s = this._detachScope();
        if (index == -1)
            index = this.length - 1;
        var view = this._element.detachView(index);
        return wtfLeave(s, view.ref);
    }
    clear() {
        for (var i = this.length - 1; i >= 0; i--) {
            this.remove(i);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19jb250YWluZXJfcmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1zbTQ2bEU0dC50bXAvYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL3ZpZXdfY29udGFpbmVyX3JlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdDQUFnQztPQUNuRCxFQUFDLGFBQWEsRUFBQyxNQUFNLGdDQUFnQztPQUNyRCxFQUFXLFNBQVMsRUFBRSxhQUFhLEVBQUMsTUFBTSwrQkFBK0I7T0FFekUsRUFBQyxTQUFTLEVBQVUsTUFBTSwwQkFBMEI7T0FDcEQsRUFBQyxjQUFjLEVBQUUsUUFBUSxFQUFhLE1BQU0sb0JBQW9CO0FBZ0J2RTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1CRztBQUNIO0lBQ0U7OztPQUdHO0lBQ0gsSUFBSSxPQUFPLEtBQWlCLE1BQU0sQ0FBYSxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFZakU7O09BRUc7SUFDSCxJQUFJLE1BQU0sS0FBYSxNQUFNLENBQVMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQTBEMUQsQ0FBQztBQUVEO0lBQ0UsWUFBb0IsUUFBb0I7UUFBcEIsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQVV4QyxnQkFBZ0I7UUFDaEIsd0NBQW1DLEdBQy9CLGNBQWMsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1FBYTVELGdCQUFnQjtRQUNoQixvQ0FBK0IsR0FBZSxjQUFjLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQXlCbEcsZ0JBQWdCO1FBQ2hCLGlCQUFZLEdBQUcsY0FBYyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFlM0QsZ0JBQWdCO1FBQ2hCLGlCQUFZLEdBQUcsY0FBYyxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFZM0QsZ0JBQWdCO1FBQ2hCLGlCQUFZLEdBQUcsY0FBYyxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFq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QUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQixDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge3VuaW1wbGVtZW50ZWR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge0luamVjdG9yLCBJbmplY3Rvcl8sIFByb3RvSW5qZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpL2luamVjdG9yJztcbmltcG9ydCB7UmVzb2x2ZWRQcm92aWRlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGkvcHJvdmlkZXInO1xuaW1wb3J0IHtpc1ByZXNlbnQsIGlzQmxhbmt9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge3d0ZkNyZWF0ZVNjb3BlLCB3dGZMZWF2ZSwgV3RmU2NvcGVGbn0gZnJvbSAnLi4vcHJvZmlsZS9wcm9maWxlJztcblxuaW1wb3J0IHtBcHBFbGVtZW50fSBmcm9tICcuL2VsZW1lbnQnO1xuXG5pbXBvcnQge0VsZW1lbnRSZWYsIEVsZW1lbnRSZWZffSBmcm9tICcuL2VsZW1lbnRfcmVmJztcbmltcG9ydCB7VGVtcGxhdGVSZWYsIFRlbXBsYXRlUmVmX30gZnJvbSAnLi90ZW1wbGF0ZV9yZWYnO1xuaW1wb3J0IHtcbiAgRW1iZWRkZWRWaWV3UmVmLFxuICBIb3N0Vmlld1JlZixcbiAgSG9zdFZpZXdGYWN0b3J5UmVmLFxuICBIb3N0Vmlld0ZhY3RvcnlSZWZfLFxuICBWaWV3UmVmLFxuICBWaWV3UmVmX1xufSBmcm9tICcuL3ZpZXdfcmVmJztcbmltcG9ydCB7QXBwVmlld30gZnJvbSAnLi92aWV3JztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgY29udGFpbmVyIHdoZXJlIG9uZSBvciBtb3JlIFZpZXdzIGNhbiBiZSBhdHRhY2hlZC5cbiAqXG4gKiBUaGUgY29udGFpbmVyIGNhbiBjb250YWluIHR3byBraW5kcyBvZiBWaWV3cy4gSG9zdCBWaWV3cywgY3JlYXRlZCBieSBpbnN0YW50aWF0aW5nIGFcbiAqIHtAbGluayBDb21wb25lbnR9IHZpYSB7QGxpbmsgI2NyZWF0ZUhvc3RWaWV3fSwgYW5kIEVtYmVkZGVkIFZpZXdzLCBjcmVhdGVkIGJ5IGluc3RhbnRpYXRpbmcgYW5cbiAqIHtAbGluayBUZW1wbGF0ZVJlZiBFbWJlZGRlZCBUZW1wbGF0ZX0gdmlhIHtAbGluayAjY3JlYXRlRW1iZWRkZWRWaWV3fS5cbiAqXG4gKiBUaGUgbG9jYXRpb24gb2YgdGhlIFZpZXcgQ29udGFpbmVyIHdpdGhpbiB0aGUgY29udGFpbmluZyBWaWV3IGlzIHNwZWNpZmllZCBieSB0aGUgQW5jaG9yXG4gKiBgZWxlbWVudGAuIEVhY2ggVmlldyBDb250YWluZXIgY2FuIGhhdmUgb25seSBvbmUgQW5jaG9yIEVsZW1lbnQgYW5kIGVhY2ggQW5jaG9yIEVsZW1lbnQgY2FuIG9ubHlcbiAqIGhhdmUgYSBzaW5nbGUgVmlldyBDb250YWluZXIuXG4gKlxuICogUm9vdCBlbGVtZW50cyBvZiBWaWV3cyBhdHRhY2hlZCB0byB0aGlzIGNvbnRhaW5lciBiZWNvbWUgc2libGluZ3Mgb2YgdGhlIEFuY2hvciBFbGVtZW50IGluXG4gKiB0aGUgUmVuZGVyZWQgVmlldy5cbiAqXG4gKiBUbyBhY2Nlc3MgYSBgVmlld0NvbnRhaW5lclJlZmAgb2YgYW4gRWxlbWVudCwgeW91IGNhbiBlaXRoZXIgcGxhY2UgYSB7QGxpbmsgRGlyZWN0aXZlfSBpbmplY3RlZFxuICogd2l0aCBgVmlld0NvbnRhaW5lclJlZmAgb24gdGhlIEVsZW1lbnQsIG9yIHlvdSBvYnRhaW4gaXQgdmlhXG4gKiB7QGxpbmsgQXBwVmlld01hbmFnZXIjZ2V0Vmlld0NvbnRhaW5lcn0uXG4gKlxuICogPCEtLSBUT0RPKGkpOiB3ZSBhcmUgYWxzbyBjb25zaWRlcmluZyBFbGVtZW50UmVmI3ZpZXdDb250YWluZXIgYXBpIC0tPlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVmlld0NvbnRhaW5lclJlZiB7XG4gIC8qKlxuICAgKiBBbmNob3IgZWxlbWVudCB0aGF0IHNwZWNpZmllcyB0aGUgbG9jYXRpb24gb2YgdGhpcyBjb250YWluZXIgaW4gdGhlIGNvbnRhaW5pbmcgVmlldy5cbiAgICogPCEtLSBUT0RPOiByZW5hbWUgdG8gYW5jaG9yRWxlbWVudCAtLT5cbiAgICovXG4gIGdldCBlbGVtZW50KCk6IEVsZW1lbnRSZWYgeyByZXR1cm4gPEVsZW1lbnRSZWY+dW5pbXBsZW1lbnRlZCgpOyB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIGFsbCBWaWV3cyBpbiB0aGlzIGNvbnRhaW5lci5cbiAgICovXG4gIGFic3RyYWN0IGNsZWFyKCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHtAbGluayBWaWV3UmVmfSBmb3IgdGhlIFZpZXcgbG9jYXRlZCBpbiB0aGlzIGNvbnRhaW5lciBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0KGluZGV4OiBudW1iZXIpOiBWaWV3UmVmO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgVmlld3MgY3VycmVudGx5IGF0dGFjaGVkIHRvIHRoaXMgY29udGFpbmVyLlxuICAgKi9cbiAgZ2V0IGxlbmd0aCgpOiBudW1iZXIgeyByZXR1cm4gPG51bWJlcj51bmltcGxlbWVudGVkKCk7IH07XG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlcyBhbiBFbWJlZGRlZCBWaWV3IGJhc2VkIG9uIHRoZSB7QGxpbmsgVGVtcGxhdGVSZWYgYHRlbXBsYXRlUmVmYH0gYW5kIGluc2VydHMgaXRcbiAgICogaW50byB0aGlzIGNvbnRhaW5lciBhdCB0aGUgc3BlY2lmaWVkIGBpbmRleGAuXG4gICAqXG4gICAqIElmIGBpbmRleGAgaXMgbm90IHNwZWNpZmllZCwgdGhlIG5ldyBWaWV3IHdpbGwgYmUgaW5zZXJ0ZWQgYXMgdGhlIGxhc3QgVmlldyBpbiB0aGUgY29udGFpbmVyLlxuICAgKlxuICAgKiBSZXR1cm5zIHRoZSB7QGxpbmsgVmlld1JlZn0gZm9yIHRoZSBuZXdseSBjcmVhdGVkIFZpZXcuXG4gICAqL1xuICBhYnN0cmFjdCBjcmVhdGVFbWJlZGRlZFZpZXcodGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmLCBpbmRleD86IG51bWJlcik6IEVtYmVkZGVkVmlld1JlZjtcblxuICAvKipcbiAgICogSW5zdGFudGlhdGVzIGEgc2luZ2xlIHtAbGluayBDb21wb25lbnR9IGFuZCBpbnNlcnRzIGl0cyBIb3N0IFZpZXcgaW50byB0aGlzIGNvbnRhaW5lciBhdCB0aGVcbiAgICogc3BlY2lmaWVkIGBpbmRleGAuXG4gICAqXG4gICAqIFRoZSBjb21wb25lbnQgaXMgaW5zdGFudGlhdGVkIHVzaW5nIGl0cyB7QGxpbmsgUHJvdG9WaWV3UmVmIGBwcm90b1ZpZXdgfSB3aGljaCBjYW4gYmVcbiAgICogb2J0YWluZWQgdmlhIHtAbGluayBDb21waWxlciNjb21waWxlSW5Ib3N0fS5cbiAgICpcbiAgICogSWYgYGluZGV4YCBpcyBub3Qgc3BlY2lmaWVkLCB0aGUgbmV3IFZpZXcgd2lsbCBiZSBpbnNlcnRlZCBhcyB0aGUgbGFzdCBWaWV3IGluIHRoZSBjb250YWluZXIuXG4gICAqXG4gICAqIFlvdSBjYW4gb3B0aW9uYWxseSBzcGVjaWZ5IGBkeW5hbWljYWxseUNyZWF0ZWRQcm92aWRlcnNgLCB3aGljaCBjb25maWd1cmUgdGhlIHtAbGluayBJbmplY3Rvcn1cbiAgICogdGhhdCB3aWxsIGJlIGNyZWF0ZWQgZm9yIHRoZSBIb3N0IFZpZXcuXG4gICAqXG4gICAqIFJldHVybnMgdGhlIHtAbGluayBIb3N0Vmlld1JlZn0gb2YgdGhlIEhvc3QgVmlldyBjcmVhdGVkIGZvciB0aGUgbmV3bHkgaW5zdGFudGlhdGVkIENvbXBvbmVudC5cbiAgICovXG4gIGFic3RyYWN0IGNyZWF0ZUhvc3RWaWV3KGhvc3RWaWV3RmFjdG9yeVJlZjogSG9zdFZpZXdGYWN0b3J5UmVmLCBpbmRleD86IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZHluYW1pY2FsbHlDcmVhdGVkUHJvdmlkZXJzPzogUmVzb2x2ZWRQcm92aWRlcltdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0YWJsZU5vZGVzPzogYW55W11bXSk6IEhvc3RWaWV3UmVmO1xuXG4gIC8qKlxuICAgKiBJbnNlcnRzIGEgVmlldyBpZGVudGlmaWVkIGJ5IGEge0BsaW5rIFZpZXdSZWZ9IGludG8gdGhlIGNvbnRhaW5lciBhdCB0aGUgc3BlY2lmaWVkIGBpbmRleGAuXG4gICAqXG4gICAqIElmIGBpbmRleGAgaXMgbm90IHNwZWNpZmllZCwgdGhlIG5ldyBWaWV3IHdpbGwgYmUgaW5zZXJ0ZWQgYXMgdGhlIGxhc3QgVmlldyBpbiB0aGUgY29udGFpbmVyLlxuICAgKlxuICAgKiBSZXR1cm5zIHRoZSBpbnNlcnRlZCB7QGxpbmsgVmlld1JlZn0uXG4gICAqL1xuICBhYnN0cmFjdCBpbnNlcnQodmlld1JlZjogVmlld1JlZiwgaW5kZXg/OiBudW1iZXIpOiBWaWV3UmVmO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgVmlldywgc3BlY2lmaWVkIHZpYSB7QGxpbmsgVmlld1JlZn0sIHdpdGhpbiB0aGUgY3VycmVudCBjb250YWluZXIgb3JcbiAgICogYC0xYCBpZiB0aGlzIGNvbnRhaW5lciBkb2Vzbid0IGNvbnRhaW4gdGhlIFZpZXcuXG4gICAqL1xuICBhYnN0cmFjdCBpbmRleE9mKHZpZXdSZWY6IFZpZXdSZWYpOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIGEgVmlldyBhdHRhY2hlZCB0byB0aGlzIGNvbnRhaW5lciBhdCB0aGUgc3BlY2lmaWVkIGBpbmRleGAuXG4gICAqXG4gICAqIElmIGBpbmRleGAgaXMgbm90IHNwZWNpZmllZCwgdGhlIGxhc3QgVmlldyBpbiB0aGUgY29udGFpbmVyIHdpbGwgYmUgcmVtb3ZlZC5cbiAgICovXG4gIGFic3RyYWN0IHJlbW92ZShpbmRleD86IG51bWJlcik6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFVzZSBhbG9uZyB3aXRoIHtAbGluayAjaW5zZXJ0fSB0byBtb3ZlIGEgVmlldyB3aXRoaW4gdGhlIGN1cnJlbnQgY29udGFpbmVyLlxuICAgKlxuICAgKiBJZiB0aGUgYGluZGV4YCBwYXJhbSBpcyBvbWl0dGVkLCB0aGUgbGFzdCB7QGxpbmsgVmlld1JlZn0gaXMgZGV0YWNoZWQuXG4gICAqL1xuICBhYnN0cmFjdCBkZXRhY2goaW5kZXg/OiBudW1iZXIpOiBWaWV3UmVmO1xufVxuXG5leHBvcnQgY2xhc3MgVmlld0NvbnRhaW5lclJlZl8gaW1wbGVtZW50cyBWaWV3Q29udGFpbmVyUmVmIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogQXBwRWxlbWVudCkge31cblxuICBnZXQoaW5kZXg6IG51bWJlcik6IEVtYmVkZGVkVmlld1JlZiB7IHJldHVybiB0aGlzLl9lbGVtZW50Lm5lc3RlZFZpZXdzW2luZGV4XS5yZWY7IH1cbiAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgIHZhciB2aWV3cyA9IHRoaXMuX2VsZW1lbnQubmVzdGVkVmlld3M7XG4gICAgcmV0dXJuIGlzUHJlc2VudCh2aWV3cykgPyB2aWV3cy5sZW5ndGggOiAwO1xuICB9XG5cbiAgZ2V0IGVsZW1lbnQoKTogRWxlbWVudFJlZiB7IHJldHVybiB0aGlzLl9lbGVtZW50LnJlZjsgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NyZWF0ZUVtYmVkZGVkVmlld0luQ29udGFpbmVyU2NvcGU6IFd0ZlNjb3BlRm4gPVxuICAgICAgd3RmQ3JlYXRlU2NvcGUoJ1ZpZXdDb250YWluZXJSZWYjY3JlYXRlRW1iZWRkZWRWaWV3KCknKTtcblxuICAvLyBUT0RPKHJhZG8pOiBwcm9maWxlIGFuZCBkZWNpZGUgd2hldGhlciBib3VuZHMgY2hlY2tzIHNob3VsZCBiZSBhZGRlZFxuICAvLyB0byB0aGUgbWV0aG9kcyBiZWxvdy5cbiAgY3JlYXRlRW1iZWRkZWRWaWV3KHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZiwgaW5kZXg6IG51bWJlciA9IC0xKTogRW1iZWRkZWRWaWV3UmVmIHtcbiAgICB2YXIgcyA9IHRoaXMuX2NyZWF0ZUVtYmVkZGVkVmlld0luQ29udGFpbmVyU2NvcGUoKTtcbiAgICBpZiAoaW5kZXggPT0gLTEpIGluZGV4ID0gdGhpcy5sZW5ndGg7XG4gICAgdmFyIHRlbXBsYXRlUmVmXyA9ICg8VGVtcGxhdGVSZWZfPnRlbXBsYXRlUmVmKTtcbiAgICB2YXIgdmlldzogQXBwVmlldzxhbnk+ID0gdGVtcGxhdGVSZWZfLmNyZWF0ZUVtYmVkZGVkVmlldygpO1xuICAgIHRoaXMuX2VsZW1lbnQuYXR0YWNoVmlldyh2aWV3LCBpbmRleCk7XG4gICAgcmV0dXJuIHd0ZkxlYXZlKHMsIHZpZXcucmVmKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NyZWF0ZUhvc3RWaWV3SW5Db250YWluZXJTY29wZTogV3RmU2NvcGVGbiA9IHd0ZkNyZWF0ZVNjb3BlKCdWaWV3Q29udGFpbmVyUmVmI2NyZWF0ZUhvc3RWaWV3KCknKTtcblxuICBjcmVhdGVIb3N0Vmlldyhob3N0Vmlld0ZhY3RvcnlSZWY6IEhvc3RWaWV3RmFjdG9yeVJlZiwgaW5kZXg6IG51bWJlciA9IC0xLFxuICAgICAgICAgICAgICAgICBkeW5hbWljYWxseUNyZWF0ZWRQcm92aWRlcnM6IFJlc29sdmVkUHJvdmlkZXJbXSA9IG51bGwsXG4gICAgICAgICAgICAgICAgIHByb2plY3RhYmxlTm9kZXM6IGFueVtdW10gPSBudWxsKTogSG9zdFZpZXdSZWYge1xuICAgIHZhciBzID0gdGhpcy5fY3JlYXRlSG9zdFZpZXdJbkNvbnRhaW5lclNjb3BlKCk7XG4gICAgaWYgKGluZGV4ID09IC0xKSBpbmRleCA9IHRoaXMubGVuZ3RoO1xuICAgIHZhciBjb250ZXh0RWwgPSB0aGlzLl9lbGVtZW50O1xuICAgIHZhciBjb250ZXh0SW5qZWN0b3IgPSB0aGlzLl9lbGVtZW50LnBhcmVudEluamVjdG9yO1xuXG4gICAgdmFyIGhvc3RWaWV3RmFjdG9yeSA9ICg8SG9zdFZpZXdGYWN0b3J5UmVmXz5ob3N0Vmlld0ZhY3RvcnlSZWYpLmludGVybmFsSG9zdFZpZXdGYWN0b3J5O1xuXG4gICAgdmFyIGNoaWxkSW5qZWN0b3IgPVxuICAgICAgICBpc1ByZXNlbnQoZHluYW1pY2FsbHlDcmVhdGVkUHJvdmlkZXJzKSAmJiBkeW5hbWljYWxseUNyZWF0ZWRQcm92aWRlcnMubGVuZ3RoID4gMCA/XG4gICAgICAgICAgICBuZXcgSW5qZWN0b3JfKFByb3RvSW5qZWN0b3IuZnJvbVJlc29sdmVkUHJvdmlkZXJzKGR5bmFtaWNhbGx5Q3JlYXRlZFByb3ZpZGVycyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHRJbmplY3RvcikgOlxuICAgICAgICAgICAgY29udGV4dEluamVjdG9yO1xuXG4gICAgdmFyIHZpZXcgPVxuICAgICAgICBob3N0Vmlld0ZhY3Rvcnkudmlld0ZhY3RvcnkoY29udGV4dEVsLnBhcmVudFZpZXcudmlld01hbmFnZXIsIGNoaWxkSW5qZWN0b3IsIGNvbnRleHRFbCk7XG4gICAgdmlldy5jcmVhdGUocHJvamVjdGFibGVOb2RlcywgbnVsbCk7XG4gICAgdGhpcy5fZWxlbWVudC5hdHRhY2hWaWV3KHZpZXcsIGluZGV4KTtcbiAgICByZXR1cm4gd3RmTGVhdmUocywgdmlldy5yZWYpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaW5zZXJ0U2NvcGUgPSB3dGZDcmVhdGVTY29wZSgnVmlld0NvbnRhaW5lclJlZiNpbnNlcnQoKScpO1xuXG4gIC8vIFRPRE8oaSk6IHJlZmFjdG9yIGluc2VydCtyZW1vdmUgaW50byBtb3ZlXG4gIGluc2VydCh2aWV3UmVmOiBWaWV3UmVmLCBpbmRleDogbnVtYmVyID0gLTEpOiBWaWV3UmVmIHtcbiAgICB2YXIgcyA9IHRoaXMuX2luc2VydFNjb3BlKCk7XG4gICAgaWYgKGluZGV4ID09IC0xKSBpbmRleCA9IHRoaXMubGVuZ3RoO1xuICAgIHZhciB2aWV3UmVmXyA9IDxWaWV3UmVmXz52aWV3UmVmO1xuICAgIHRoaXMuX2VsZW1lbnQuYXR0YWNoVmlldyh2aWV3UmVmXy5pbnRlcm5hbFZpZXcsIGluZGV4KTtcbiAgICByZXR1cm4gd3RmTGVhdmUocywgdmlld1JlZl8pO1xuICB9XG5cbiAgaW5kZXhPZih2aWV3UmVmOiBWaWV3UmVmKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTGlzdFdyYXBwZXIuaW5kZXhPZih0aGlzLl9lbGVtZW50Lm5lc3RlZFZpZXdzLCAoPFZpZXdSZWZfPnZpZXdSZWYpLmludGVybmFsVmlldyk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9yZW1vdmVTY29wZSA9IHd0ZkNyZWF0ZVNjb3BlKCdWaWV3Q29udGFpbmVyUmVmI3JlbW92ZSgpJyk7XG5cbiAgLy8gVE9ETyhpKTogcmVuYW1lIHRvIGRlc3Ryb3lcbiAgcmVtb3ZlKGluZGV4OiBudW1iZXIgPSAtMSk6IHZvaWQge1xuICAgIHZhciBzID0gdGhpcy5fcmVtb3ZlU2NvcGUoKTtcbiAgICBpZiAoaW5kZXggPT0gLTEpIGluZGV4ID0gdGhpcy5sZW5ndGggLSAxO1xuICAgIHZhciB2aWV3ID0gdGhpcy5fZWxlbWVudC5kZXRhY2hWaWV3KGluZGV4KTtcbiAgICB2aWV3LmRlc3Ryb3koKTtcbiAgICAvLyB2aWV3IGlzIGludGVudGlvbmFsbHkgbm90IHJldHVybmVkIHRvIHRoZSBjbGllbnQuXG4gICAgd3RmTGVhdmUocyk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9kZXRhY2hTY29wZSA9IHd0ZkNyZWF0ZVNjb3BlKCdWaWV3Q29udGFpbmVyUmVmI2RldGFjaCgpJyk7XG5cbiAgLy8gVE9ETyhpKTogcmVmYWN0b3IgaW5zZXJ0K3JlbW92ZSBpbnRvIG1vdmVcbiAgZGV0YWNoKGluZGV4OiBudW1iZXIgPSAtMSk6IFZpZXdSZWYge1xuICAgIHZhciBzID0gdGhpcy5fZGV0YWNoU2NvcGUoKTtcbiAgICBpZiAoaW5kZXggPT0gLTEpIGluZGV4ID0gdGhpcy5sZW5ndGggLSAxO1xuICAgIHZhciB2aWV3ID0gdGhpcy5fZWxlbWVudC5kZXRhY2hWaWV3KGluZGV4KTtcbiAgICByZXR1cm4gd3RmTGVhdmUocywgdmlldy5yZWYpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgZm9yICh2YXIgaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHRoaXMucmVtb3ZlKGkpO1xuICAgIH1cbiAgfVxufVxuIl19