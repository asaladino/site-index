"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _nodeGtk = _interopRequireDefault(require("node-gtk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// noinspection ES6CheckImport
const Gtk = _nodeGtk.default.require('Gtk', '3.0');

const Window = Gtk.Window,
      Label = Gtk.Label,
      Entry = Gtk.Entry,
      Grid = Gtk.Grid,
      Switch = Gtk.Switch,
      ProgressBar = Gtk.ProgressBar,
      Button = Gtk.Button;

const startGui = args => {
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
  const grid = new Grid();
  grid.attach(new Label({
    label: "Domain"
  }), 0, 0, 1, 1);
  grid.attach(new Entry({
    text: args.domain
  }), 1, 0, 1, 1);
  grid.attach(new Label({
    label: "Output"
  }), 0, 1, 1, 1);
  grid.attach(new Entry({
    text: args.output.filename
  }), 1, 1, 1, 1);
  grid.attach(new Label({
    label: "Headers"
  }), 0, 2, 1, 1);
  grid.attach(new Switch({
    active: args.headers
  }), 1, 2, 1, 1);
  const progressBar = new ProgressBar({
    fraction: 0.4,
    'show-text': true,
    text: 'Making progress.'
  });
  grid.attach(progressBar, 0, 3, 2, 1);
  const startButton = new Button({
    label: 'Start Index'
  });
  grid.attach(startButton, 1, 4, 1, 1);
  startButton.on('clicked', () => {
    console.log("Let's scan..");
  });
  window.add(grid);
  window.showAll();
  Gtk.main();
};

Gtk.propTypes = {
  WindowPosition: {
    CENTER: _propTypes.default.object
  },
  Grid: {
    attach: _propTypes.default.func
  }
};
Window.propTypes = {
  setWmclass: _propTypes.default.func,
  setDefaultSize: _propTypes.default.func,
  showAll: _propTypes.default.func
};
var _default = startGui;
exports.default = _default;
//# sourceMappingURL=Main.js.map