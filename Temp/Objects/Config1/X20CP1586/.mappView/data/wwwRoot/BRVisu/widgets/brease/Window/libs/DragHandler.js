define(['brease/events/BreaseEvent', 'brease/core/Utils'], function (BreaseEvent, Utils) {

    'use strict';

    var DragHandler = function (widget) {
        this.start = _start.bind(this, widget);
        this.headerMoveHandler = _headerMoveHandler.bind(this, widget);
        this.headerUpHandler = _headerUpHandler.bind(this, widget);
        this.updatePosition = _updatePosition.bind(this, widget);
        
        var devicePixelRatio = (window.devicePixelRatio > 1) ? window.devicePixelRatio : 1;
        this.tolerance = 40 * devicePixelRatio;
    };

    function _start(widget, e) {
        brease.bodyEl.on(BreaseEvent.MOUSE_MOVE, this.headerMoveHandler);
        brease.bodyEl.on(BreaseEvent.MOUSE_UP, this.headerUpHandler);

        this.startPointer = {
            left: e.pageX, 
            top: e.pageY
        };
        var startPos = widget.el.css(['left', 'top']);
        this.startWidget = this.actPos = {
            left: parseInt(startPos.left, 10),
            top: parseInt(startPos.top, 10)
        };
        // calculate window boundaries once
        this.boundary = {
            top: 0,
            right: window.innerWidth - this.tolerance,
            bottom: window.innerHeight - widget.header.height() * widget.dimensions.scale,
            left: this.tolerance - widget.dimensions.width * widget.dimensions.scale
        };
    }

    function _headerMoveHandler(widget, e) {
        var newPos = {
            left: this.startWidget.left + (e.pageX - this.startPointer.left),
            top: this.startWidget.top + (e.pageY - this.startPointer.top)
        };

        //check if widget element is inside window boundaries
        if (newPos.left < this.boundary.left || newPos.left > this.boundary.right || newPos.top < this.boundary.top || newPos.top > this.boundary.bottom) {
            return;
        }
        this.newPos = newPos;
        
        if (!this.active) {
            this.active = true;
            Utils.requestAnimationFrame(this.updatePosition);
        }
    }

    function _updatePosition(widget) {
        if (this.actPos.left !== this.newPos.left || this.actPos.top !== this.newPos.top) {
            widget.el.css(this.newPos); 
            this.actPos = {
                left: this.newPos.left, 
                top: this.newPos.top
            };
        }
        if (this.active) {
            this.animationFrame = requestAnimationFrame(this.updatePosition);
        }
    }
    
    function _headerUpHandler(widget) {
        brease.bodyEl.off(BreaseEvent.MOUSE_MOVE, this.headerMoveHandler);
        brease.bodyEl.off(BreaseEvent.MOUSE_UP, this.headerUpHandler);
        Utils.cancelAnimationFrame(this.animationFrame);
        this.active = false;
    }

    return DragHandler;

});
