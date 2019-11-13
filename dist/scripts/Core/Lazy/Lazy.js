var Lazy = /** @class */ (function () {
    function Lazy(factory) {
        this.factory = factory;
    }
    Object.defineProperty(Lazy.prototype, "Value", {
        get: function () {
            return this.value || (this.value = this.factory());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lazy.prototype, "isCreated", {
        get: function () {
            return !!this.value;
        },
        enumerable: true,
        configurable: true
    });
    Lazy.create = function (factory) {
        return new Lazy(factory);
    };
    return Lazy;
}());
export { Lazy };
//# sourceMappingURL=Lazy.js.map