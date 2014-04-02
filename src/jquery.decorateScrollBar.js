/**
 * ==============================
 * jquery plug for decorate the browser's default scrollbar
 * If you want to know more infomation about this, please go to
 * github: https://github.com/nange/jquery-decorateScrollBar
 * ==============================
 *
 * @author LanceLi  
 */

;(function(factory) {
  if (typeof define == 'function' && define.amd) {
    //AMD support
    define(['jquery'], factory);
  } else {
    //Browser global
    factory(jQuery);
  }

})(function($) {
  
  var ScrollBar = function(element, options) {
      this.$element = $(element);
      this.options = options;
      this.init();
    };
    
    ScrollBar.DEFAULTS = {
      contentId                 : '',
      contentClassName          : '',
      sbYRailClassName          : 'scrollbar-y-rail',  
      sbYClassName              : 'scrollbar-y',
      sbXRailClassName          : 'scrollbar-x-rail', 
      sbXClassName              : 'scrollbar-x',
      sbYRailWidth              : 12,
      sbXRailHeight             : 12,
      clickMoveSpace            : 30,
      mouseWheelSpeed           : 50,
      railClickMoveCoefficient  : 2
    };

    ScrollBar.prototype = {
      //reset the constructor
      constructor: ScrollBar,
      //the html structure of scrollbarY
      scrollbarYDOM: '<div><div></div></div>',
      //init the scroll bar
      init: function() {
        if (this.hasScrollBar()) {
          this.initCssProperties();
          
          if (this.needScrollBarOnY()) {
            this.initScrollbarY();

            this.bindMousedownOnScrollbarY();

            this.bindClickOnScrollbarYRail();

            this.bindMouseWheel();
          }

          if (this.needScrollBarOnX()) {
            this.initScrollbarX();

            this.bindMousedownOnScrollbarX();

            this.bindClickOnScrollbarXRail();
          }
          
          this.bindResizeOnWindow();
        } 
         
      },
      //reset the container css properties
      initCssProperties: function() {
        var $element = this.$element,
            $content = this.getContentEl();

        if ($element.css('position') === 'static') {
          this.options.originalPosition = 'static';
          $element.css('position', 'relative');
        }

        if ($content.css('overflow') !== 'hidden') {
          this.options.originalOverflow = $content.css('overflow');
          $content.css('overflow', 'hidden');
        }
        
      },
      initScrollbarY: function() {
        var $el = $(this.scrollbarYDOM),
            $sbRail;

        $sbRail = $el.addClass(this.options.sbYRailClassName);
        
        $sbRail.children(':nth-child(1)').addClass(this.options.sbYClassName);
        

        $sbRail.appendTo(this.$element);
        $sbRail.css({
          height: this.getWapperHeight(),
          width: this.options.sbYRailWidth
        });
        
        this.$element.css('padding-right', $sbRail.outerWidth());
        
        this.$element.find('.' + this.options.sbYClassName).css({
          height: this.getScrollYHeight(),
          top: 0
        });
        
      },
      initScrollbarX: function() {
        var $el = $(this.scrollbarYDOM),
            $sbRail;

        $sbRail = $el.addClass(this.options.sbXRailClassName);
        
        $sbRail.children(':nth-child(1)').addClass(this.options.sbXClassName);

        $el.appendTo(this.$element);
        $el.css({
          height: this.options.sbXRailHeight,
          width: this.getWapperWidth()
        });

        this.$element.css('padding-bottom', $sbRail.outerHeight());

        this.$element.find('.' + this.options.sbXClassName).css({
          width: this.getScrollXWidth(),
          left: 0
        });

      },
      //bind mouse down on scroll bar Y, and what should do if mouse move and up
      bindMousedownOnScrollbarY: function() {
        var $element = this.$element,
            _this = this;
            
        $element.find('.' + this.options.sbYClassName).on('mousedown.descrollbar', function(event) {
          var $this = $(this),
              originalScrollTop = _this.getContentEl().scrollTop(),
              originalScrollBarTop = $this.position().top,
              clientY = event.clientY;

          $(document).on('mousemove.descrollbar', function(event) {
            var maxScrollTop = _this.getMaxScrollTop(),
                currentClientY = event.clientY,
                mouseChangeY = currentClientY - clientY,
                contentChangeY = (mouseChangeY / _this.getScrollYRailHeight()) * 
                  _this.getContentHeight();

            afterScrollTop = contentChangeY + originalScrollTop;
            afterScrollBarTop = mouseChangeY + originalScrollBarTop;
            
            if (afterScrollTop >= 0 && afterScrollTop <= maxScrollTop) {
              _this.getContentEl().scrollTop(afterScrollTop);
              
              $this.css('top', afterScrollBarTop);

            }
            
          });

          $(document).on('mouseup.descrollbar', function(event) {
            $(document).off('mousemove.descrollbar');
            $(document).off('mouseup.descrollbar');
          });

          event.preventDefault();
          event.stopPropagation();
        });
      }, 
      
      bindMousedownOnScrollbarX: function() {
        var $element = this.$element,
            _this = this;

        $element.find('.' + this.options.sbXClassName).on('mousedown.descrollbar', function(event) {
          var $this = $(this),
              originalScrollLeft = _this.getContentEl().scrollLeft(),
              originalScrollBarLeft = $this.position().left,
              clientX = event.clientX;

          $(document).on('mousemove.descrollbar', function(event) {
            var maxScrollLeft = _this.getMaxScrollLeft(),
                currentClientX = event.clientX,
                mouseChangeX = currentClientX - clientX,
                contentChangeX = (mouseChangeX / _this.getScrollXRailWidth()) * 
                  _this.getContentWidth();

            afterScrollLeft = contentChangeX + originalScrollLeft;
            afterScrollBarLeft = mouseChangeX + originalScrollBarLeft;
            
            if (afterScrollLeft >= 0 && afterScrollLeft <= maxScrollLeft) {
              _this.getContentEl().scrollLeft(afterScrollLeft);
              
              $this.css('left', afterScrollBarLeft);

            }
            
          });

          $(document).on('mouseup.descrollbar', function(event) {
            $(document).off('mousemove.descrollbar');
            $(document).off('mouseup.descrollbar');
          });

          event.preventDefault();
          event.stopPropagation();
   
        });

      },
      
      bindClickOnScrollbarYRail: function() {
        var $element = this.$element,
            _this = this;

        $element.on('click.descrollbar', function(event) {

          var pageY = event.pageY,
              $scrollbarY = $element.find('.' + _this.options.sbYClassName),
              maxScrollTop = _this.getMaxScrollTop(),
              originalScrollTop = _this.getContentEl().scrollTop(),
              originalScrollBarTop = $scrollbarY.position().top,
              contentChangeY,
              afterScrollTop,
              afterScrollBarTop,
              sbYTopOffset,
              sbYBtmOffset;
          
          if (event.target.className === _this.options.sbYRailClassName) {
            sbYTopOffset = $scrollbarY.offset().top;
            sbYBtmOffset = sbYTopOffset + _this.getScrollYHeight();
            contentChangeY = (_this.options.clickMoveSpace * _this.options.railClickMoveCoefficient / 
              _this.getScrollYRailHeight()) * _this.getContentHeight();

            if (pageY < sbYTopOffset) {
              afterScrollTop = originalScrollTop - contentChangeY;
              afterScrollBarTop = originalScrollBarTop - _this.options.clickMoveSpace * 
                _this.options.railClickMoveCoefficient;

              if (afterScrollTop >= 0) {
                _this.getContentEl().scrollTop(afterScrollTop);
            
                $scrollbarY.css('top', afterScrollBarTop);

              } else {
                _this.getContentEl().scrollTop(0);
            
                $scrollbarY.css('top', 0);
              }

            } else if (pageY > sbYBtmOffset) {
              afterScrollTop = originalScrollTop + contentChangeY;
              afterScrollBarTop = originalScrollBarTop + _this.options.clickMoveSpace * 
                _this.options.railClickMoveCoefficient;

              if (afterScrollTop <= maxScrollTop) {
                _this.getContentEl().scrollTop(afterScrollTop);
            
                $scrollbarY.css('top', afterScrollBarTop);

              } else {
                _this.getContentEl().scrollTop(maxScrollTop);
            
                $scrollbarY.css('top', _this.getScrollYRailHeight() - _this.getScrollYHeight());
              }

            }
          }

        });
      },
      bindClickOnScrollbarXRail: function() {
        var $element = this.$element,
            _this = this;

        $element.on('click.descrollbar', function(event) {
          var pageX = event.pageX,
              $scrollbarX = $element.find('.' + _this.options.sbXClassName),
              maxScrollLeft = _this.getMaxScrollLeft(),
              originalScrollLeft = _this.getContentEl().scrollLeft(),
              originalScrollBarLeft = $scrollbarX.position().left,
              contentChangeX,
              afterScrollLeft,
              afterScrollBarLeft,
              sbXLeftOffset,
              sbXRightOffset;
          
          if (event.target.className === _this.options.sbXRailClassName) {
            sbXLeftOffset = $scrollbarX.offset().left;
            sbXRightOffset = sbXLeftOffset + _this.getScrollXWidth();
            contentChangeX = (_this.options.clickMoveSpace * _this.options.railClickMoveCoefficient / 
              _this.getScrollXRailWidth()) * _this.getContentWidth();

            if (pageX < sbXLeftOffset) {
              afterScrollLeft = originalScrollLeft - contentChangeX;
              afterScrollBarLeft = originalScrollBarLeft - _this.options.clickMoveSpace * 
                _this.options.railClickMoveCoefficient;

              if (afterScrollLeft >= 0) {
                _this.getContentEl().scrollLeft(afterScrollLeft);
            
                $scrollbarX.css('left', afterScrollBarLeft);

              } else {
                _this.getContentEl().scrollLeft(0);
            
                $scrollbarX.css('left', 0);
              }

            } else if (pageX > sbXRightOffset) {
              afterScrollLeft = originalScrollLeft + contentChangeX;
              afterScrollBarLeft = originalScrollBarLeft + _this.options.clickMoveSpace * 
                _this.options.railClickMoveCoefficient;

              if (afterScrollLeft <= maxScrollLeft) {
                _this.getContentEl().scrollLeft(afterScrollLeft);
            
                $scrollbarX.css('left', afterScrollBarLeft);

              } else {
                _this.getContentEl().scrollLeft(maxScrollLeft);
            
                $scrollbarX.css('left', _this.getScrollXRailWidth() - _this.getScrollXWidth());
              }

            }
          }

        });
      },
      bindMouseWheel: function() {
        var _this = this;

        var _mouseWheelHandler = function(event) {
          var $this = $(this),
              delta = event.delta,
              $sbY = $this.find('.' + _this.options.sbYClassName),
              originalScrollTop = _this.getContentEl().scrollTop(),
              originalScrollBarTop = $sbY.position().top,
              maxScrollTop = _this.getMaxScrollTop(),
              contentChangeY,
              afterScrollTop,
              afterScrollBarTop;

          contentChangeY = (_this.options.mouseWheelSpeed / _this.getScrollYRailHeight()) * 
              _this.getContentHeight();
          if (delta > 0) {
            
            afterScrollTop = originalScrollTop - contentChangeY;
            afterScrollBarTop = originalScrollBarTop - _this.options.mouseWheelSpeed;
            
            if (afterScrollTop >= 0) {
              _this.getContentEl().scrollTop(afterScrollTop);
              
              $sbY.css('top', afterScrollBarTop);

            } else {
              _this.getContentEl().scrollTop(0);
              
              $sbY.css('top', 0);
            }
          } else if (delta < 0) {
            
            afterScrollTop = originalScrollTop + contentChangeY;
            afterScrollBarTop = originalScrollBarTop + _this.options.mouseWheelSpeed;
            
            if (afterScrollTop <= maxScrollTop) {
              _this.getContentEl().scrollTop(afterScrollTop);
              
              $sbY.css('top', afterScrollBarTop);

            } else {
              _this.getContentEl().scrollTop(maxScrollTop);
              
              $sbY.css('top', _this.getScrollYRailHeight() - _this.getScrollYHeight());
            }

          }
          event.preventDefault();

        };

        addMouseWheelEvent(this.$element[0], _mouseWheelHandler);
      },
      bindResizeOnWindow: function() {
        var _this = this;

        $(window).on('resize', function() {
          _this.update();
        });

      },
      //get the height of scroll bar y 
      getScrollYHeight: function() {
        return (this.getWapperHeight() / this.getContentHeight()) * 
          this.getScrollYRailHeight();
      },
      
      getScrollXWidth: function() {
        return (this.getWapperWidth() / this.getContentWidth()) * 
          this.getScrollXRailWidth();
        
      },
      //get the outermost container height
      getWapperHeight: function() {
        return this.$element.height();
      },
      //get the outermost container width
      getWapperWidth: function() {
        return this.$element.width();
      },
      //get the real content height
      getContentHeight: function() {
        return this.getContentEl().prop('scrollHeight');
      },
      //get the real content width
      getContentWidth: function() {
        return this.getContentEl().prop('scrollWidth');
      },
      getScrollXRailWidth: function() {
        return this.getWapperWidth();
      },
      //get the rail height of scroll bar y which able to move
      getScrollYRailHeight: function() {
        return this.getWapperHeight();
      },
      
      //get the max scroll top
      getMaxScrollTop: function() {
        return this.getContentHeight() - this.getWapperHeight();
      },
      getMaxScrollLeft: function() {
        return this.getContentWidth() - this.getWapperWidth();
      },
      getContentSelector: function() {
        var contentSelector;

        if (this.options.contentId) {
          contentSelector = '#' + this.options.contentId;

        } else if (this.options.contentClassName) {
          contentSelector = '.' + this.options.contentClassName;
        }

        return contentSelector;
      },
      getContentEl: function() {
        if (this.getContentSelector()) {
          return this.$element.find(contentSelector);
        } else {
          return this.$element.children().first();
        }
      },
      //determine whether need scroll bar on Y
      needScrollBarOnY: function() {
        if (this.getContentHeight() > this.getWapperHeight()) {
          return true;
        }
        return false;
      },
      //determine whether need scroll bar on X
      needScrollBarOnX: function() {
        if (this.getContentWidth() > this.getWapperWidth()) {
          return true;
        }
        return false;
      },
      hasScrollBar: function() {
        return this.needScrollBarOnY() || this.needScrollBarOnX();
      },
      update: function() {
        if (this.needScrollBarOnY()) {
          this.$element.find('.' + this.options.sbYRailClassName).css({
            height: this.getWapperHeight()
          });

          this.$element.find('.' + this.options.sbYClassName).css({
            height: this.getScrollYHeight()
          });
        }
        if (this.needScrollBarOnX()) {
          this.$element.find('.' + this.options.sbXRailClassName).css({
            width: this.getWapperWidth()
          });

          this.$element.find('.' + this.options.sbXClassName).css({
            width: this.getScrollXWidth()
          });
        }

      },
      destroy: function() {
        this.$element.find('.' + this.options.sbYRailClassName).remove();
        this.$element.find('.' + this.options.sbXRailClassName).remove();

        this.$element.off('click.descrollbar');

        if (this.options.originalOverflow) {
          this.getContentEl().css('overflow', this.options.originalOverflow);
        }
        if (this.options.originalPosition) {
          this.$element.css('position', this.options.originalPosition);
        }

        this.$element.css('padding', 0);

        this.$element.removeData('descrollbar');

      }

    };


    $.fn.decorateScrollBar = function (option) {
    
      return this.each(function () {
        var options = $.extend({}, ScrollBar.DEFAULTS, typeof option === 'object' && option);
        var $this = $(this);
        var data  = $this.data('descrollbar');
        var exports = {
          update: 'update',
          destroy: 'destroy'
        };

        if (!data) $this.data('descrollbar', new ScrollBar(this, options));
        if (typeof option === 'string' && option in exports) data[exports[option]]();

      });

    }

    // for mousewheel event 
    function addMouseWheelEvent(el, fn, capture) {
      var type = 'mousewheel';

      var _eventCompat = function(event) {
        event.delta = event.wheelDelta ? event.wheelDelta / 120 : -(event.detail || 0) / 3;

        if ('srcElement' in event && !('target' in event)) {
          event.target = event.srcElement;
        }

        if (!event.preventDefault && 'returnValue' in event) {
          event.preventDefault = function() {
            event.returnValue = false;
          };
        }

        return event;
      };

      if (window.addEventListener) {
        if ('mozHidden' in document) type = 'DOMMouseScroll';

        el.addEventListener(type, function(event) {
          fn.call(this, _eventCompat(event));
        }, capture || false);

      } else if (window.attachEvent) {
        el.attachEvent('on' + type, function(event) {
          event = event || window.event;
          fn.call(el, _eventCompat(event));
        });

      }
    }

});
