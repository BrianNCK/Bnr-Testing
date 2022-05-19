define(['brease/core/BaseWidget',
    'brease/events/BreaseEvent',
    'brease/decorators/LanguageDependency',
    'brease/decorators/MeasurementSystemDependency',
    'brease/core/Types',
    'brease/datatype/Node',
    'brease/config/NumberFormat',
    'brease/core/Utils',
    'widgets/brease/RadialGauge/libs/Config',
    'widgets/brease/RadialGauge/libs/Renderer'],
    function (SuperClass, BreaseEvent, languageDependency, measurementSystemDependency, Types, Node, NumberFormat, Utils, Config, Renderer) {


    'use strict';

    /**
    * @class widgets.brease.RadialGauge
    * @extends brease.core.BaseWidget
    
    
    * @iatMeta category:Category
    * Chart,Numeric
    * @iatMeta description:short
    * Zeigerinstrument rund
    * @iatMeta description:de
    * Zeigt einen numerischen Wert in einem Zeigerinstrument mit optionaler Skala an
    * @iatMeta description:en
    * Displays a numeric value in a radial gauge with an optional scale
    */

	var defaultSettings = Config,

	WidgetClass = SuperClass.extend(function RadialGauge() {
	    SuperClass.apply(this, arguments);
	}, defaultSettings),

    p = WidgetClass.prototype;

    p.init = function () {
        if (this.settings.omitClass !== true) {
            this.addInitialClass('breaseRadialGauge');
        }

        this.data = {
            node: new Node(this.settings.value, null, this.settings.minValue, this.settings.maxValue)
        };

        if (this.settings.height === undefined || this.settings.width === undefined) {
            _readWidgetProperties(this);
        }
        
        this.settings.startAngle = this.settings.startAngle % 360;
        this.settings.range = this.settings.range % 360;
        this.renderer = new Renderer(this);

        _initSettings(this);
        SuperClass.prototype.init.call(this);

        if (brease.config.editMode === true) {
            var widget = this;
            require(['widgets/brease/RadialGauge/libs/EditorHandles'], function (EditorHandles) {
                var editorHandles = new EditorHandles(widget);
                widget.getHandles = function () {
                    return editorHandles.getHandles();
                };
                // workaround
                widget.designer.getSelectionDecoratables = function () {
                    return editorHandles.getSelectionDecoratables();
                };
            });
        }
    };

    /**
	* @method setFormat
	* Sets format
	* @param {brease.config.MeasurementSystemFormat} format
	*/
    p.setFormat = function (format) {
        this.settings.format = format;
        _updateFormat(this.settings.format, this);
    };

    /**
	* @method getFormat 
	* Returns format.
	* @return {brease.config.MeasurementSystemFormat}
	*/
    p.getFormat = function () {
        return this.settings.format;
    };

    /**
	* @method setMinValue
	* Sets minValue
	* @param {Number} minValue
	*/
    p.setMinValue = function (minValue) {

        if (Utils.isNumeric(minValue)) {
            this.data.node.setMinValue(minValue);
            this.renderer.writeNumbers();
            this.renderer.updateNeedle();
            this.renderer.updateScaleAreas();
        }
    };

    /**
	* @method getMinValue 
	* Returns minValue.
	* @return {Number}
	*/
    p.getMinValue = function () {
        return this.data.node.minValue;
    };

    /**
	* @method setMaxValue
	* Sets maxValue
	* @param {Number} maxValue
	*/
    p.setMaxValue = function (maxValue) {

        if (Utils.isNumeric(maxValue)) {
            this.data.node.setMaxValue(maxValue);
            this.renderer.writeNumbers();
            this.renderer.updateNeedle();
            this.renderer.updateScaleAreas();
        }
    };

    /**
	* @method getMaxValue 
	* Returns maxValue.
	* @return {Number}
	*/
    p.getMaxValue = function () {
        return this.data.node.maxValue;
    };

    /**
	* @method setMajorTicks
	* Sets majorTicks
	* @param {UInteger} majorTicks
	*/
    p.setMajorTicks = function (majorTicks) {
        this.settings.majorTicks = parseInt(majorTicks, 10);
        this.el.find('.groupMajorTicks').remove();
        this.el.find('.groupMinorTicks').remove();
        this.el.find('.groupNumbers').remove();
        this.renderer.calcMajorTick();
        this.renderer.calcMinorTick();
        this.renderer.writeNumbers();
    };

    /**
	* @method getMajorTicks 
	* Returns majorTicks.
	* @return {UInteger}
	*/
    p.getMajorTicks = function () {
        return this.settings.majorTicks;
    };

    /**
	* @method setMinorTicks
	* Sets minorTicks
	* @param {UInteger} minorTicks
	*/
    p.setMinorTicks = function (minorTicks) {
        this.settings.minorTicks = parseInt(minorTicks, 10);
        this.el.find('.groupMinorTicks').remove();
        this.renderer.calcMinorTick();
    };

    /**
	* @method getMinorTicks 
	* Returns minorTicks.
	* @return {UInteger}
	*/
    p.getMinorTicks = function () {
        return this.settings.minorTicks;
    };

    /**
	* @method setStartAngle
	* Sets startAngle
	* @param {Number} startAngle
	*/
    p.setStartAngle = function (startAngle) {
        this.settings.startAngle = parseInt(startAngle, 10) % 360;
        this.el.find('.groupMajorTicks').remove();
        this.el.find('.groupMinorTicks').remove();
        this.el.find('.groupNumbers').remove();
        this.el.find('.groupText').remove();
        this.renderer.updateScaleAreas();
        this.renderer.calcMajorTick();
        this.renderer.calcMinorTick();
        this.renderer.updateNeedle();
        this.renderer.drawText();
        this.renderer.writeNumbers();
        this.setText(this.settings.text);
    };

    /**
	* @method getStartAngle 
	* Returns startAngle.
	* @return {Number}
	*/
    p.getStartAngle = function () {
        return this.settings.startAngle;
    };

    /**
	* @method setNode
	* Sets node
	* @param {brease.datatype.Node} node
	*/
    p.setNode = function (node) {

        if (node.minValue !== undefined) {
            if (this.data.node.minValue !== node.minValue) {
                this.data.node.setMinValue(node.minValue);
                this.renderer.writeNumbers();
            }
        }
        if (node.maxValue !== undefined) {
            if (this.data.node.maxValue !== node.maxValue) {
                this.data.node.setMaxValue(node.maxValue);
                this.renderer.writeNumbers();
            }
        }
        if (node.value !== undefined) {
            this.data.node.setValue(node.value);
        }

        if (this.valueChange !== undefined && this.valueChange.state() !== "resolved") {
            this.valueChange.resolve();
        }
        else {
            this.renderer.updateNeedle();
        }
    };

    /**
	* @method getNode 
	* Returns node.
	* @return {brease.datatype.Node}
	*/
    p.getNode = function () {
        return this.data.node;
    };

    /**
	* @method setValue
	* @iatStudioExposed
	* Sets value
	* @param {Number} value
	*/
    p.setValue = function (value) {

        if (value !== undefined) {
            this.data.node.setValue(value);
        }

        if (this.valueChange !== undefined && this.valueChange.state() !== "resolved") {
            this.valueChange.resolve();
        } else {
            this.renderer.updateNeedle();
        }
    };

    /**
	* @method getValue 
	* Returns value.
	* @return {Number}
	*/
    p.getValue = function () {
        return this.data.node.value;
    };

    /**
    * @method setScaleArea0
    * Sets scaleArea0
    * @param {Integer} scaleArea0
    */
    p.setScaleArea0 = function (scaleArea0) {
        if (scaleArea0 !== undefined) {
            this.settings.scaleArea0 = parseInt(scaleArea0, 10);
            this.renderer.updateScaleAreas();
        }
    };

    /**
	* @method getScaleArea0
	* Returns scaleArea0.
	* @return {Integer}
	*/
    p.getScaleArea0 = function () {
        return this.settings.scaleArea0;
    };

    /**
	* @method setScaleArea1
	* Sets scaleArea1
	* @param {Integer} scaleArea1
	*/
    p.setScaleArea1 = function (scaleArea1) {
        if (scaleArea1 !== undefined) {
            this.settings.scaleArea1 = parseInt(scaleArea1, 10);
            this.renderer.updateScaleAreas();
        }
    };

    /**
	* @method getScaleArea1 
	* Returns scaleArea1.
	* @return {Integer}
	*/
    p.getScaleArea1 = function () {
        return this.settings.scaleArea1;
    };

    /**
    * @method setScaleArea2
    * Sets scaleArea2
    * @param {Integer} scaleArea2
    */
    p.setScaleArea2 = function (scaleArea2) {
        if (scaleArea2 !== undefined) {
            this.settings.scaleArea2 = parseInt(scaleArea2, 10);
            this.renderer.updateScaleAreas();
        }
    };

    /**
	* @method getScaleArea2
	* Returns scaleArea2.
	* @return {Integer}
	*/
    p.getScaleArea2 = function () {
        return this.settings.scaleArea2;
    };

    /**
    * @method setScaleArea3
    * Sets scaleArea3
    * @param {Integer} scaleArea3
    */
    p.setScaleArea3 = function (scaleArea3) {
        if (scaleArea3 !== undefined) {
            this.settings.scaleArea3 = parseInt(scaleArea3, 10);
            this.renderer.updateScaleAreas();
        }
    };

    /**
	* @method getScaleArea3
	* Returns scaleArea3.
	* @return {Integer}
	*/
    p.getScaleArea3 = function () {
        return this.settings.scaleArea3;
    };

    /**
    * @method setScaleArea4
    * Sets scaleArea4
    * @param {Integer} scaleArea4
    */
    p.setScaleArea4 = function (scaleArea4) {
        if (scaleArea4 !== undefined) {
            this.settings.scaleArea4 = parseInt(scaleArea4, 10);
            this.renderer.updateScaleAreas();
        }
    };

    /**
	* @method getScaleArea4
	* Returns scaleArea4.
	* @return {Integer}
	*/
    p.getScaleArea4 = function () {
        return this.settings.scaleArea4;
    };

    /**
    * @method setScaleArea5
    * Sets scaleArea5
    * @param {Integer} scaleArea5
    */
    p.setScaleArea5 = function (scaleArea5) {
        if (scaleArea5 !== undefined) {
            this.settings.scaleArea5 = parseInt(scaleArea5, 10);
            this.renderer.updateScaleAreas();
        }
    };

    /**
	* @method getScaleArea5
	* Returns scaleArea5.
	* @return {Integer}
	*/
    p.getScaleArea5 = function () {
        return this.settings.scaleArea5;
    };


    /**
	* @method setText
	* Sets text
	* @param {String} text
	*/
    p.setText = function (text) {
        this.settings.text = text;
        this.renderer.textElement.text(text);
    };

    /**
	* @method getText 
	* Returns text.
	* @return {String}
	*/
    p.getText = function () {
        return this.settings.text;
    };

    /**
    * @method setTextKey
    * set the textkey
    * @param {String} key The new textkey
    */
    p.setTextKey = function (key) {

        if (key !== undefined) {
            this.settings.textkey = key;
            this.setLangDependency(true);
        }
    };

    /**
	* @method getTextKey
	* get the textkey
	*/
    p.getTextKey = function () {
        return this.settings.textkey;
    };

    /**
	* @method setShowUnit
	* Sets showUnit
	* @param {Boolean} showUnit
	*/
    p.setShowUnit = function (showUnit) {
        this.settings.showUnit = showUnit;
        this.showUnit();
    };

    /**
	* @method getShowUnit 
	* Returns showUnit.
	* @return {Boolean}
	*/
    p.getShowUnit = function () {
        return this.settings.showUnit;
    };

    /**
	* @method setUnit
	* Sets unit
	* @param {brease.config.MeasurementSystemUnit} unit
	*/
    p.setUnit = function (unit) {

        if (Utils.isObject(unit)) {
            this.settings.unitTextKey = undefined;
            this.settings.unit = unit;
        } else {
            if (brease.language.isKey(unit)) {
                try {
                    this.setLangDependency(true);
                    this.settings.unitTextKey = brease.language.parseKey(unit);
                    this.settings.unit = JSON.parse(brease.language.getTextByKey(this.settings.unitTextKey).replace(/\'/g, '"'));
                } catch (error) {
                    console.iatWarn(this.elem.id + ':Unit String "' + unit + '" is invalid!');
                }
            } else {
                this.settings.unitTextKey = undefined;
                try {
                    this.settings.unit = JSON.parse(unit.replace(/\'/g, '"'));
                } catch (error) {
                    console.iatWarn(this.elem.id + ':Unit String "' + unit + '" is invalid!');
                }
            }
        }
        if (unit === undefined) {
            this.settings.unit = undefined;
        }

        this.processMeasurementSystemUpdate();
    };

    /**
	* @method getUnit 
	* Returns unit
	* @return {brease.config.MeasurementSystemUnit}
	*/
    p.getUnit = function () {
        return this.settings.unit;
    };

    /**
	* @method setScaleAreaInPercent
	* Sets scaleAreaInPercent
	* @param {Boolean} scaleAreaInPercent
	*/
    p.setScaleAreaInPercent = function (scaleAreaInPercent) {
        this.settings.scaleAreaInPercent = scaleAreaInPercent;
        this.renderer.updateScaleAreas();
    };

    /**
	* @method getScaleAreaInPercent 
	* Returns scaleAreaInPercent.
	* @return {Boolean}
	*/
    p.getScaleAreaInPercent = function () {
        return this.settings.scaleAreaInPercent;
    };

    /**
    * @method setRange
    * Sets range
    * @param {UNumber} range
    */
    p.setRange = function (range) {
        this.settings.range = range;
        this.settings.range = parseInt(range, 10) % 360;
        this.el.find('.groupMajorTicks').remove();
        this.el.find('.groupMinorTicks').remove();
        this.el.find('.groupNumbers').remove();
        this.el.find('.groupText').remove();
        this.renderer.updateScaleAreas();
        this.renderer.calcMajorTick();
        this.renderer.calcMinorTick();
        this.renderer.updateNeedle();
        this.renderer.drawText();
        this.renderer.writeNumbers();
        this.setText(this.settings.text);
    };

    /**
	* @method getRange 
	* Returns range.
	* @return {UNumber}
	*/
    p.getRange = function () {
        return this.settings.range;
    };

    /**
    * @method setTransitionTime
    * Sets transitionTime
    * @param {UInteger} transitionTime
    */
    p.setTransitionTime = function (transitionTime) {
        this.settings.transitionTime = transitionTime;
    };

    /**
	* @method getTransitionTime 
	* Returns transitionTime.
	* @return {UInteger}
	*/
    p.getTransitionTime = function () {
        return this.settings.transitionTime;
    };

    p.showUnit = function () {
        brease.language.pipeAsyncUnitSymbol(this.data.node.unit, this._bind('writeUnit'));
    };

    p.writeUnit = function (symbol) {
        if (brease.config.editMode === true) {
            this.settings.unitSymbol = 'unit';
        } else {
            this.settings.unitSymbol = symbol;
        }
        if (this.settings.showUnit === true || this.settings.showUnit === 'true') {
            this.renderer.unitElement.text(this.settings.unitSymbol);
        } else {
            this.renderer.unitElement.text('');
        }    
    };

    p.dispose = function () {
        this.renderer.dispose();
        SuperClass.prototype.dispose.apply(this, arguments);
    };

    p.langChangeHandler = function (e) {
        if (this.data.node.unit !== null && this.settings.showUnit === true) {
            this.showUnit();
        }
        if (this.settings.textkey) {
            this.setText(brease.language.getTextByKey(this.settings.textkey));
        }
    };

    p.processMeasurementSystemUpdate = function () {

        var widget = this;

        this.settings.mms = brease.measurementSystem.getCurrentMeasurementSystem();
        _updateFormat(this.settings.format, this);

        this.valueChange = $.Deferred();
        this.unitChange = $.Deferred();

        $.when(
            this.valueChange.promise(),
            this.unitChange.promise()
            ).then(function successHandler() {
                _updateNodeDisplay(widget);
            });

        var previousUnitCode = this.data.node.unit;
        if (this.settings.unit !== undefined) {
            this.data.node.setUnit(this.settings.unit[this.settings.mms]);
        }
        if (this.data.node.unit !== previousUnitCode) {
            brease.language.pipeAsyncUnitSymbol(this.data.node.unit, this._bind(_setUnitSymbol));
        } else {
            this.unitChange.resolve();
        }

        var subscriptions = brease.uiController.getSubscriptionsForElement(this.elem.id);
        if (subscriptions !== undefined && subscriptions.node !== undefined) {
            if (this.data.node.unit !== previousUnitCode) {
                this.sendNodeChange({ attribute: "node", nodeAttribute: "unit", value: this.data.node.unit });
            } else {
                this.valueChange.resolve();
            }
        } else {
            this.valueChange.resolve();
        }
    };

    p.measurementSystemChangeHandler = function () {
        this.processMeasurementSystemUpdate();
    };

    p._setHeight = function (h) {
        SuperClass.prototype._setHeight.call(this, h);
        this.settings.width = this.settings.height;
        this.renderer.redraw();
    };

    p._setWidth = function (w) {
        SuperClass.prototype._setWidth.call(this, w);
        this.settings.height = this.settings.width;
        this.renderer.redraw();
    };

    p._getHeight = function () {
        return this.settings.height;
    };

    p._getWidth = function () {
        return this.settings.width;
    };

    /*PRIVATE
    **FUNCTIONS*/

    function _initSettings(widget) {

        widget.settings.separators = brease.user.getSeparators();
        widget.settings.mms = brease.measurementSystem.getCurrentMeasurementSystem();

        _updateFormat(widget.settings.format, widget);
        _unitSettings(widget);
        _initText(widget);
    }

    function _updateFormat(format, widget) {
        if (widget.settings.format !== undefined) {
            var formatObject;
            if (Utils.isObject(format)) {
                widget.settings.numberFormat = NumberFormat.getFormat(widget.settings.format, widget.settings.mms);
            }
            else if (typeof (format) === 'string') {
                if (brease.language.isKey(format)) {
                    try {
                        widget.setLangDependency(true);
                        var textKey = brease.language.parseKey(format);
                        formatObject = JSON.parse(brease.language.getTextByKey(textKey).replace(/\'/g, '"'));
                        widget.settings.numberFormat = NumberFormat.getFormat(formatObject, widget.settings.mms);
                    } catch (error) {
                        console.iatWarn(widget.elem.id + ': Format String "' + format + '" is invalid!');
                        widget.settings.numberFormat = NumberFormat.getFormat({}, widget.settings.mms);
                    }
                } else {
                    try {
                        formatObject = JSON.parse(format.replace(/\'/g, '"'));
                        //console.log(formatObject);
                        widget.settings.numberFormat = NumberFormat.getFormat(formatObject, widget.settings.mms);
                    } catch (error) {
                        console.iatWarn(widget.elem.id + ': Format String "' + format + '" is invalid!');
                        widget.settings.numberFormat = NumberFormat.getFormat({}, widget.settings.mms);
                    }
                }
            }
        } else {
            widget.settings.numberFormat = NumberFormat.getFormat({}, widget.settings.mms);
        }
        widget.settings.separators = brease.user.getSeparators();
        widget.renderer.writeNumbers();
    }

    function _setUnitSymbol(symbol) {
        this.settings.unitSymbol = symbol;
        this.unitChange.resolve();
    }

    function _updateNodeDisplay(widget) {
        widget.writeUnit(widget.settings.unitSymbol);
    }

    function _unitSettings(widget) {

        widget.settings.mms = brease.measurementSystem.getCurrentMeasurementSystem();
        if (Utils.isObject(widget.settings.unit)) {
            widget.data.node.unit = widget.settings.unit[brease.measurementSystem.getCurrentMeasurementSystem()];
            widget.showUnit();
            widget.setLangDependency(true);
        }

    }

    function _initText(widget) {
        if (widget.settings.text !== undefined) {
            if (brease.language.isKey(widget.settings.text) === false) {
                widget.setText(widget.settings.text);
            } else {
                widget.setTextKey(brease.language.parseKey(widget.settings.text));
                widget.setText(brease.language.getTextByKey(widget.settings.textkey));
            }
        }
    }

    function _readWidgetProperties(widget) {
        widget.settings.height = parseInt(widget.el.css('height'), 10);
        widget.settings.width = parseInt(widget.el.css('height'), 10);
        widget.settings.left = parseInt(widget.el.css('height'), 10);
        widget.settings.top = parseInt(widget.el.css('height'), 10);
    }

    return measurementSystemDependency.decorate(languageDependency.decorate(WidgetClass, false), true);

});
