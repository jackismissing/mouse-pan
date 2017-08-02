export default class MousePan {
    constructor(options) {
        this.resize = this.resize.bind(this);
        this.onMousemove = this.onMousemove.bind(this);
        this.tick = this.tick.bind(this);
        this.$wrapper = options.el;
        this.ease = options.ease || .08;
        this.init();
    }

    init() {
        this.position = {
            x: 0,
            y: 0
        };

        this.destination = {
            x: 0,
            y: 0
        };

        this.size = {
            x: 0,
            y: 0,
            offsetX: 0,
            offsetY: 0,

        };

        this.resize();
        this.bindEvents();
        this.tick();
    }

    resize() {
        this.setWrapperSize();
        this.setWrapperPosition();
    }

    bindEvents() {
        document.addEventListener('mousemove', this.onMousemove);
    }

    /**
     * Sets the wrapper size based on its taller and wider childrens
     */
    setWrapperSize() {
        console.log(this.$wrapper.childNodes);
        this.size = [].slice.call(this.$wrapper.childNodes).reduce(this.getMaxSize);
        this.size.offsetX = this.size.w - window.innerWidth;
        this.size.offsetY = this.size.h - window.innerHeight;
        this.$wrapper.style.width = `${this.size.w}px`;
        this.$wrapper.style.height = `${this.size.h}px`;
    }

    /**
     * Returns the max width and height between two objects
     * @param  {[type]} acc [description]
     * @param  {[type]} cur [description]
     * @return {[type]}     [description]
     */
    getMaxSize(a, b) {
        a.w = a.nodeType !== undefined ? a.offsetWidth : a.w;
        a.h = a.nodeType !== undefined ? a.offsetHeight : a.h;
        const w = b.offsetWidth || 0;
        const h = b.offsetHeight || 0;
        return {
            w: Math.max(a.w, w),
            h: Math.max(a.h, h),
        };
    }

    /**
     * Centers wrapper
     * @return {[type]} [description]
     */
    setWrapperPosition() {
        this.destination.x = .5 * this.size.offsetX;
        this.destination.y = .5 * this.size.offsetY;
    }

    onMousemove(e) {
        const x = e.clientX;
        const y = e.clientY;
        // Map destination x to the overflowing width;
        this.destination.x = this.size.offsetX > 0 ? this.map(x, 0, window.innerWidth, 0, this.size.offsetX) : 0;
        // Map destination y to the overflowing height;
        this.destination.y = this.size.offsetY > 0 ? this.map(y, 0, window.innerHeight, 0, this.size.offsetY) : 0;
    }

    tick() {
        // Put motion in the displacement of the wrapper
        // Instead of setting position = destination
        // We add the distance between the destination and the position to the position
        this.movePosition();
        this.$wrapper.style.transform = `translate3d(-${this.position.x}px, -${this.position.y}px, 0)`;
        window.requestAnimationFrame(this.tick);
    }

    /**
     * Calculates the new position based on the distance between the destination and the current position
     * We add a percentage to add the easing effect
     * https://codepen.io/rachsmith/post/animation-tip-lerp
     * @return {[type]} [description]
     */
    movePosition() {
        this.position.x += (this.destination.x - this.position.x) * .08;
        this.position.y += (this.destination.y - this.position.y) * .08;
    }

    // Utils
    map(val, oldMin, oldMax, newMin, newMax) {
        return newMin + (val - oldMin) * (newMax - newMin) / (oldMax - oldMin);
    }
}
