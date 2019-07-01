"use strict";

var _nodeGtk = _interopRequireDefault(require("node-gtk"));

var _Menu = _interopRequireDefault(require("../Model/Menu.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_Menu.default);

const Gtk = _nodeGtk.default.require('Gtk', '3.0');

const Window = Gtk.Window,
      Label = Gtk.Label;

_nodeGtk.default.startLoop();

Gtk.init();
const window = new Window({
  title: 'Site Index',
  window_position: Gtk.WindowPosition.CENTER
});
window.on('destroy', () => Gtk.mainQuit());
window.on('delete-event', () => false);
window.setWmclass('Site Index', 'Site Index');
window.setDefaultSize(200, 80);
window.add(new Label({
  label: "Let's scan a site."
}));
window.showAll();
Gtk.main();
//# sourceMappingURL=main.js.map