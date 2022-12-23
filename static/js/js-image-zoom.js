(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.ImageZoom = factory();
    }
}(this, function () {
    /**
     * @param {Object} container DOM element, which contains an image to be zoomed (required)
     * @param {Object} options js-image-zoom options (required)
     * **width** (number) - width of the source image (optional)
     * **height** (number) - height of the source image (optional).
     * **zoomWidth** (number) - width of the zoomed image. Zoomed image height equals source image height (optional)
     * **img** (string) - url of the source image. Provided if container does not contain img element as a tag (optional)
     * **scale** (number) - zoom scale. if not provided, scale is calculated as natural image size / image size, provided in params (optional if zoomWidth param is provided)
     * **offset** (object) - {vertical: number, horizontal: number}. Zoomed image offset (optional)
     * **zoomContainer** (node) - DOM node reference where zoomedImage will be appended to (default to the container element of image)
     * **zoomStyle** (string) - custom style applied to the zoomed image (i.e. 'opacity: 0.1;background-color: white;')
     * **zoomPosition** (string) - position of zoomed image. It can be:  `top`, `left`, `bottom`, `original` or the default `right`.
     * **zoomLensStyle** (string) custom style applied to to zoom lents (i.e. 'opacity: 0.1;background-color: white;')
     */
    return function ImageZoom(container, opts) {
        "use strict";
        var options = opts;
        if (!container) {
            return;
        }
        let self = this
        this.data = {
            sourceImg: {
                element: null,
                width: 0,
                height: 0,
                naturalWidth: 0,
                naturalHeight: 0
            },
            zoomedImgOffset: {
                vertical: 0,
                horizontal: 0
            },
            zoomedImg: {
                element: null,
                width: 0,
                height: 0
            },
            zoomLens: {
                element: null,
                width: 0,
                height: 0
            }
        };

        var div = document.createElement('div');
        var lensDiv = document.createElement('div');
        var scaleX;
        var scaleY;
        var offset;
        this.data.zoomedImgOffset = {
            vertical: options.offset && options.offset.vertical ? options.offset.vertical : 0,
            horizontal: options.offset && options.offset.horizontal ? options.offset.horizontal : 0
        };
        this.data.zoomPosition = options.zoomPosition || 'right';
        this.data.zoomContainer = (options.zoomContainer) ? options.zoomContainer : container;
        function getOffset(el) {
            if (el) {
                var elRect = el.getBoundingClientRect();
                return {left: elRect.left, top: elRect.top};
            }
            return {left: 0, top: 0};
        }

        function leftLimit(min) {
            return options.width - min;
        }

        function topLimit(min) {
            return options.height - min;
        }

        function getValue(val, min, max) {
            if (val < min) {
                return min;
            }
            if (val > max) {
                return max;
            }
            return val;
        }

        function getPosition(v, min, max) {
            var value = getValue(v, min, max);
            return value - min;
        }

        function zoomLensLeft(left) {
            var leftMin = self.data.zoomLens.width / 2;
            return getPosition(left, leftMin, leftLimit(leftMin));
        }

        function zoomLensTop(top) {
            var topMin = self.data.zoomLens.height / 2;
            return getPosition(top, topMin, topLimit(topMin));
        }

        function setZoomedImgSize(options, data) {
            if (options.scale) {
                self.data.zoomedImg.element.style.width = options.width * options.scale + 'px';
                self.data.zoomedImg.element.style.height = options.height * options.scale + 'px';
            } else if (options.zoomWidth) {
                self.data.zoomedImg.element.style.width = options.zoomWidth + 'px';
                self.data.zoomedImg.element.style.height = self.data.sourceImg.element.style.height;
            } else {
                self.data.zoomedImg.element.style.width = '100%';
                self.data.zoomedImg.element.style.height = '100%';
            }
        }

        function onSourceImgLoad() {
            // use height determined by browser if height is not set in options
            options.height = options.height || self.data.sourceImg.element.height;
            self.data.sourceImg.element.style.height = options.fillContainer ? '100%': options.height + 'px';

            // use width determined by browser if width is not set in options
            options.width =  options.width || self.data.sourceImg.element.width;
            self.data.sourceImg.element.style.width = options.fillContainer ? '100%': options.width + 'px';

            setZoomedImgSize(options, self.data);

            self.data.sourceImg.naturalWidth = self.data.sourceImg.element.naturalWidth;
            self.data.sourceImg.naturalHeight = self.data.sourceImg.element.naturalHeight;
            self.data.zoomedImg.element.style.backgroundSize = self.data.sourceImg.naturalWidth + 'px ' + self.data.sourceImg.naturalHeight + 'px';

            if (options.zoomStyle) {
                self.data.zoomedImg.element.style.cssText += options.zoomStyle;
            }
            if (options.zoomLensStyle) {
                self.data.zoomLens.element.style.cssText += options.zoomLensStyle;
            } else {
                self.data.zoomLens.element.style.background = 'white';
                self.data.zoomLens.element.style.opacity = '0.4';
            }

            scaleX = self.data.sourceImg.naturalWidth / options.width;
            scaleY = self.data.sourceImg.naturalHeight / options.height;
            offset = getOffset(self.data.sourceImg.element);

            // set zoomLens dimensions
            // if custom scale is set
            if (options.scale) {
                self.data.zoomLens.width = options.width / (self.data.sourceImg.naturalWidth / (options.width * options.scale));
                self.data.zoomLens.height = options.height / (self.data.sourceImg.naturalHeight / (options.height * options.scale));
            }

            // else if zoomWidth is set
            else if (options.zoomWidth) {
                self.data.zoomLens.width = options.zoomWidth / scaleX;
                self.data.zoomLens.height = options.height / scaleY;
            }

            // else read from the zoomedImg
            else {
                self.data.zoomedImg.element.style.display = 'block';
                self.data.zoomLens.width = self.data.zoomedImg.element.clientWidth / scaleX;
                self.data.zoomLens.height = self.data.zoomedImg.element.clientHeight / scaleY;
                self.data.zoomedImg.element.style.display = 'none';
            }

            self.data.zoomLens.element.style.position = 'absolute';
            self.data.zoomLens.element.style.width = self.data.zoomLens.width + 'px';
            self.data.zoomLens.element.style.height = self.data.zoomLens.height + 'px';
            self.data.zoomLens.element.pointerEvents = 'none';
        }

        function setup() {
            // create sourceImg element
            if (options.img) {
                var img = document.createElement('img');
                img.src = options.img;
                self.data.sourceImg.element = container.appendChild(img);
            }

            // or get sourceImg element from specified container
            else {
                self.data.sourceImg.element = container.children[0];

                // if sourceImg is not an img (might be a picture element), try to find one
                if (self.data.sourceImg.element.nodeName !== "IMG") {
                    self.data.sourceImg.element = self.data.sourceImg.element.querySelector('img');
                }
            }

            options = options || {};
            container.style.position = 'relative';
            self.data.sourceImg.element.style.width = options.fillContainer ? '100%' : options.width ? options.width + 'px' : 'auto';
            self.data.sourceImg.element.style.height = options.fillContainer ? '100%' : options.height ? options.height + 'px' : 'auto';

            self.data.zoomLens.element = container.appendChild(lensDiv);
            self.data.zoomLens.element.style.display = 'none';
            self.data.zoomLens.element.classList.add('js-image-zoom__zoomed-area');

            self.data.zoomedImg.element = self.data.zoomContainer.appendChild(div);
            self.data.zoomedImg.element.classList.add('js-image-zoom__zoomed-image');
            self.data.zoomedImg.element.style.backgroundImage = "url('" + self.data.sourceImg.element.src + "')";
            self.data.zoomedImg.element.style.backgroundRepeat = 'no-repeat';
            self.data.zoomedImg.element.style.display = 'none';

            switch (self.data.zoomPosition) {
                case 'left':
                    self.data.zoomedImg.element.style.position = 'absolute';
                    self.data.zoomedImg.element.style.top = self.data.zoomedImgOffset.vertical + 'px';
                    self.data.zoomedImg.element.style.left = self.data.zoomedImgOffset.horizontal - (self.data.zoomedImgOffset.horizontal * 2) + 'px';
                    self.data.zoomedImg.element.style.transform = 'translateX(-100%)';
                    break;

                case 'right':
                    self.data.zoomedImg.element.style.position = 'absolute';
                    self.data.zoomedImg.element.style.top = self.data.zoomedImgOffset.vertical + 'px';
                    self.data.zoomedImg.element.style.left = self.data.zoomedImgOffset.horizontal - (self.data.zoomedImgOffset.horizontal * 2) + 'px';
                    self.data.zoomedImg.element.style.transform = 'translateX(0%)';
                    break;

                case 'top':
                    self.data.zoomedImg.element.style.position = 'absolute';
                    self.data.zoomedImg.element.style.top = self.data.zoomedImgOffset.vertical - (self.data.zoomedImgOffset.vertical * 2) + 'px';
                    self.data.zoomedImg.element.style.left = 'calc(50% + ' + self.data.zoomedImgOffset.horizontal + 'px)';
                    self.data.zoomedImg.element.style.transform = 'translate3d(-50%, -100%, 0)';
                    break;

                case 'bottom':
                    self.data.zoomedImg.element.style.position = 'absolute';
                    self.data.zoomedImg.element.style.bottom = self.data.zoomedImgOffset.vertical - (self.data.zoomedImgOffset.vertical * 2) + 'px';
                    self.data.zoomedImg.element.style.left = 'calc(50% + ' + self.data.zoomedImgOffset.horizontal + 'px)';
                    self.data.zoomedImg.element.style.transform = 'translate3d(-50%, 100%, 0)';
                    break;

                case 'original':
                    self.data.zoomedImg.element.style.position = 'absolute';
                    self.data.zoomedImg.element.style.top = '0px';
                    self.data.zoomedImg.element.style.left = '0px';
                    break;

                // Right Position
                default:
                    self.data.zoomedImg.element.style.position = 'absolute';
                    self.data.zoomedImg.element.style.top = self.data.zoomedImgOffset.vertical + 'px';
                    self.data.zoomedImg.element.style.right = self.data.zoomedImgOffset.horizontal - (self.data.zoomedImgOffset.horizontal * 2) + 'px';
                    self.data.zoomedImg.element.style.transform = 'translateX(100%)';
                    break;
            }


            // setup event listeners
            container.addEventListener('mousemove', events, false);
            container.addEventListener('mouseenter', events, false);
            container.addEventListener('mouseleave', events, false);
            self.data.zoomLens.element.addEventListener('mouseenter', events, false);
            self.data.zoomLens.element.addEventListener('mouseleave', events, false);
            window.addEventListener('scroll', events, false);

            return self.data;
        }

        function kill() {

            // remove event listeners
            container.removeEventListener('mousemove', events, false);
            container.removeEventListener('mouseenter', events, false);
            container.removeEventListener('mouseleave', events, false);
            self.data.zoomLens.element.removeEventListener('mouseenter', events, false);
            self.data.zoomLens.element.removeEventListener('mouseleave', events, false);
            window.removeEventListener('scroll', events, false);

            // remove dom nodes
            if (self.data.zoomLens && self.data.zoomedImg) {
                container.removeChild(self.data.zoomLens.element);
                self.data.zoomContainer.removeChild(self.data.zoomedImg.element);
            }

            if (options.img) {
                container.removeChild(self.data.sourceImg.element);
            } else {
                self.data.sourceImg.element.style.width = '';
                self.data.sourceImg.element.style.height = '';
            }

            return self.data;
        }

        var events = {
            handleEvent: function (event) {
                switch (event.type) {
                    case 'mousemove':
                        return this.handleMouseMove(event);
                    case 'mouseenter':
                        return this.handleMouseEnter(event);
                    case 'mouseleave':
                        return this.handleMouseLeave(event);
                    case 'scroll':
                        return this.handleScroll(event);
                }
            },
            handleMouseMove: function (event) {
                var offsetX;
                var offsetY;
                var backgroundTop;
                var backgroundRight;
                var backgroundPosition;
                if (offset) {
                    offsetX = zoomLensLeft(event.clientX - offset.left);
                    offsetY = zoomLensTop(event.clientY - offset.top);
                    backgroundTop = offsetX * scaleX;
                    backgroundRight = offsetY * scaleY;
                    backgroundPosition = '-' + backgroundTop + 'px ' + '-' + backgroundRight + 'px';
                    self.data.zoomedImg.element.style.backgroundPosition = backgroundPosition;
                    self.data.zoomLens.element.style.cssText += 'transform:' + 'translate(' + offsetX + 'px,' + offsetY +'px);display: block;left:0px;top:0px;'

                }
            },
            handleMouseEnter: function () {
                self.data.zoomedImg.element.style.display = 'block';
                self.data.zoomLens.element.style.display = 'block';

            },
            handleMouseLeave: function () {
                self.data.zoomedImg.element.style.display = 'none';
                self.data.zoomLens.element.style.display = 'none';
            },
            handleScroll: function () {
                offset = getOffset(self.data.sourceImg.element);
            }
        };

        // Setup/Initialize library
        setup();

        if (self.data.sourceImg.element.complete) {
            onSourceImgLoad();
        } else {
            self.data.sourceImg.element.onload = onSourceImgLoad;
        }

        return {
            setup: function () {
                setup();
            },
            kill: function () {
                kill();
            },
            _getInstanceInfo: function () {
                return {
                    setup: setup,
                    kill: kill,
                    onSourceImgLoad: onSourceImgLoad,
                    data: self.data,
                    options: options
                }
            },
            setZoomPosition: function(side) {
                self.data.zoomPosition = side;
                setup()
            },
        }
    }
}));