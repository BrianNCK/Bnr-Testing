/*global define,brease,console,CustomEvent,_*/
define(['widgets/brease/Button/Button',
    'brease/enum/Enum',
    'brease/core/Utils',
    'brease/core/Types',
    'brease/events/BreaseEvent'],
    function (SuperClass, Enum, Utils, Types, BreaseEvent) {

    'use strict';

    /**
    * @class widgets.brease.ToggleButton
    * #Description
    * Toggle widget with background and text and/or icon.  
    * Text can be language dependent.  
    * Width depends on icon and text or can be set to a fixed value via css.  
    * @breaseNote
    * @extends widgets.brease.Button
    * @aside example buttons
    
    * @iatMeta category:Category
    * Buttons
    * @iatMeta description:short
    * Umschalten zwischen true/false
    * @iatMeta description:de
    * Schaltet einen Wert zwischen true und false wenn der Benutzer darauf klickt
    * @iatMeta description:en
    * Toggles a value between true and false when the user clicks it
    */

    /**
    * @cfg {Boolean} value=false
    * Represents the boolean state of the element.
    * @iatCategory Data
    * @iatStudioExposed
    * @bindable
    * @editableBinding
    */

    /**
    * @cfg {ImagePath} mouseDownImage=''
    * @iatStudioExposed
    * @iatCategory Appearance
    * @bindable
    * Path to an optional image to be shown in 'checked' state.
    */

    var defaultSettings = {
        value: false
    },

    WidgetClass = SuperClass.extend(function ToggleButton() {
        SuperClass.apply(this, arguments);
    }, defaultSettings),

    p = WidgetClass.prototype;

    /**
    * @property {Object} values
    * Possible values for property "value".  
    * @property {Boolean} values.checked=true
    * @property {Boolean} values.unchecked=false
    * @static
    * @readonly
    */
    WidgetClass.values = {
        checked: true,
        unchecked: false
    };

    p.init = function () {
        if (this.settings.omitClass !== true) {
            this.addInitialClass('breaseToggleButton');
        }
        SuperClass.prototype.init.call(this);

        this.settings.value = Types.parseValue(this.settings.value, 'Boolean');
        if (this.settings.value === WidgetClass.values.checked) {
            this.toggle(this.settings.value, true);
        }
    };

    /**
    * @method toggle
    * Switch between states.
    * @param {Integer} [status] This parameter is optional. If not set, this method toggles between states.
    * @param {Boolean} [omitSubmit] If true, value change is not submitted to SPS
    */
    p.toggle = function (status, omitSubmit) {
        //console.log('ToggleButton[' + this.elem.id + '].toggle(status=' + status + ', omitSubmit=' + omitSubmit + ')');

        var sendChange = false;

        status = toggleStatus.call(this, status);

        if (status === WidgetClass.values.checked) {
            if (this.settings.value === WidgetClass.values.unchecked) {
                sendChange = true;
            }
            this.settings.value = WidgetClass.values.checked;
        } else {
            if (this.settings.value === WidgetClass.values.checked) {
                sendChange = true;
            }
            this.settings.value = WidgetClass.values.unchecked;
        }
        _setToggleStatusStyle(this, this.settings.value);

        if (sendChange === true && omitSubmit !== true) {
            /**
            * @event ValueChanged
            * @param {Integer} newValue
            * @param {Boolean} newValueBool
            * @param {Integer} newValueInteger
            * @iatStudioExposed
            * Fired when the status of the widget is changed by user interaction
            */
            var ev = this.createEvent('ValueChanged', {
                newValue: this.getValue(),
                newValueBool: this.getValueBool(),
                newValueInteger: this.getValueInteger()
            });
            ev.dispatch();
            this.submitChange();
        }
        this.dispatchEvent(new CustomEvent(BreaseEvent.CHANGE, { bubbles: true, cancelable: true, detail: { checked: this.isChecked() } }));
    };

    function toggleStatus(status) {
        if (status === undefined) {
            status = (this.settings.value === WidgetClass.values.unchecked) ? WidgetClass.values.checked : WidgetClass.values.unchecked;
        }
        return status;
    }

    /**
    * @method setValueInteger
    * @iatStudioExposed
    * Toggle button dependent of a value. 0 -> not checked, 1 -> checked.
    * @param {Integer} value
    */
    p.setValueInteger = function (value, metaData) {
        this.setValue(value, metaData);
    };

    /**
    * @method setValueBool
    * @iatStudioExposed
    * Toggle button dependent of a value. false -> not checked, true -> checked.
    * @param {Boolean} value
    */
    p.setValueBool = function (value, metaData) {
        this.setValue(value, metaData);
    };

    /**
    * @method setValue
    * @iatStudioExposed
    * Toggle button dependent of a value.  
    * This method is used for binding. 
    * @param {Integer} value
    */
    p.setValue = function (value, metaData) {
        //workaround to allow setValue Integer
        if (value === 1) {
                value = true;
        } else if (value === 0) {
                value = false;
        } // end of workaround
        //console.log('ToggleButton[' + this.elem.id + '].setValue:', value, metaData);
        this.toggle(value, (metaData !== undefined && metaData.origin === 'server'));
    };

    /**
    * @method getValue
    * Get value dependent on state
    * @return {Integer}
    */
    p.getValue = function () {
        return this.settings.value;
    };

    /**
    * @method getValueInteger
    * @iatStudioExposed
    * Get value dependent on state0 -> not checked, 1 -> checked.
    * @return {Integer}
    */
    p.getValueInteger = function () {
        return this.getValue() ? 1 : 0;
    };

     /**
    * @method getValueBool
    * @iatStudioExposed
    * Get value dependent on state. false -> not checked, true -> checked.
    * @return {Boolean}
    */
    p.getValueBool = function () {
        return this.getValue();
    };

    /**
	* @method setImage
	* @iatStudioExposed
	* Sets an image.
	* @param {ImagePath} image
	*/
    p.setImage = function (image, omitSettings) {
        if (omitSettings !== true && (this.el.hasClass('checked') || this.el.hasClass('active')) && (this.settings.mouseDownImage !== undefined)) {
            if (image !== undefined || image !== '') {
                this.settings.image = image;
            }
        } else {
            SuperClass.prototype.setImage.call(this, image, omitSettings);
        }
    };

    p.setEditable = function (editable, metaData) {
        //console.log('%c' + this.constructor.name + '[' + this.elem.id + '].setEditable:' + JSON.stringify(metaData), 'color:#cc00cc;');
        if (metaData !== undefined && metaData.refAttribute !== undefined) {
            var refAttribute = metaData.refAttribute;
            if (refAttribute === 'value') {
                this.settings.editable = editable;
                this._internalEnable();
            }
        }
    };

    /**
    * @method isChecked
    * @return {Boolean}
    */
    p.isChecked = function () {
        return (this.settings.value === WidgetClass.values.checked);
    };

    p.submitChange = function () {
        //console.log(this.constructor.name + '[' + this.elem.id + '].submitChange');
        this.sendValueChange({ value: this.getValue() });
    };

    p._onButtonClick = function (e) {
        this.toggle();
    };

    p._downHandler = function (e) {

        if (this.isDisabled || brease.config.editMode || this.isActive) { return; }
        this.isActive = true;
        this.pointerId = Utils.getPointerId(e);
        
        this.el.addClass('active');
        
        $(document).on(BreaseEvent.MOUSE_UP, this._bind('_upHandler'));

        /**
        * @event MouseDown
        * @iatStudioExposed
        * Fired when widget enters mouseDown state
        */
        var clickEv = this.createEvent("MouseDown");
        clickEv.dispatch();
    };

    p._upHandler = function (e) {

        if (this.isDisabled || brease.config.editMode || Utils.getPointerId(e) !== this.pointerId) { return; }
        this.isActive = false;

        this.el.removeClass('active');
        $(document).off(BreaseEvent.MOUSE_UP, this._bind('_upHandler'));

        /**
        * @event MouseUp
        * @iatStudioExposed
        * Fired when widget enters mouseUp state
        */
        var clickEv = this.createEvent("MouseUp");
        clickEv.dispatch();
    };

    p.isToggleButton = function () {

        return true;
    };

    // Private Functions
    function _setToggleStatusStyle(widget, value) {
        if (value) {
            widget.el.addClass('checked');
            if (widget.settings.mouseDownImage !== undefined && widget.settings.mouseDownImage !== '') {
                widget.setImage(widget.settings.mouseDownImage, true);
            }
        } else {
            widget.el.removeClass('checked');
            if (widget.settings.mouseDownImage !== undefined) {
                widget.setImage(widget.settings.image, true);
            }
        }
    }

    return WidgetClass;

});
