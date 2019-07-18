"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _nodeGtk = _interopRequireDefault(require("node-gtk"));

var _IndexController = _interopRequireDefault(require("../Controller/IndexController"));

var _Args = _interopRequireDefault(require("../Model/Args"));

var _FileDetails = _interopRequireDefault(require("../Model/FileDetails"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// noinspection ES6CheckImport
let Gtk = {};
let Window = {};

const startGui = args => {
  Gtk = _nodeGtk.default.require('Gtk', '3.0');
  const _Gtk = Gtk,
        Window = _Gtk.Window,
        Label = _Gtk.Label,
        Entry = _Gtk.Entry,
        Grid = _Gtk.Grid,
        Switch = _Gtk.Switch,
        ProgressBar = _Gtk.ProgressBar,
        Button = _Gtk.Button,
        Box = _Gtk.Box,
        FileChooserButton = _Gtk.FileChooserButton;

  _nodeGtk.default.startLoop();

  Gtk.init();
  const window = new Window({
    title: 'Site Index',
    window_position: Gtk.WindowPosition.CENTER
  });
  window.on('destroy', () => Gtk.mainQuit());
  window.on('delete-event', () => false);
  window.setWmclass('Site Index', 'Site Index');
  window.setDefaultSize(400, 100);
  const grid = new Grid({
    'column-spacing': 5,
    'row-spacing': 5,
    'margin_left': 5,
    'margin_right': 5,
    'margin_top': 5,
    'margin_bottom': 5
  });
  grid.attach(new Label({
    label: "Domain",
    halign: 1
  }), 0, 0, 1, 1);
  const domainEntry = new Entry({
    text: args.domain,
    hexpand: true
  });
  grid.attach(domainEntry, 1, 0, 1, 1);
  grid.attach(new Label({
    label: "Output",
    halign: 1
  }), 0, 1, 1, 1);
  const fileChooserButton = new FileChooserButton();
  fileChooserButton.setAction(2);
  fileChooserButton.setCurrentFolder(args.output.filename);
  grid.attach(fileChooserButton, 1, 1, 1, 1);
  grid.attach(new Label({
    label: "Headers",
    halign: 1
  }), 0, 2, 1, 1);
  const headersSwitch = new Switch({
    active: args.headers
  });
  const headersSwitchBox = new Box();
  headersSwitchBox.add(headersSwitch);
  grid.attach(headersSwitchBox, 1, 2, 1, 1);
  const progressBar = new ProgressBar({
    fraction: 0.0
  });
  grid.attach(progressBar, 0, 3, 2, 1);
  const startButton = new Button({
    label: 'Start Index',
    halign: 2
  });
  const startButtonBox = new Box({
    halign: 2
  });
  startButtonBox.add(startButton);
  grid.attach(startButtonBox, 1, 4, 1, 1);
  startButton.on('clicked', () => {
    args.domain = domainEntry.getText();
    args.output = new _FileDetails.default(fileChooserButton.getCurrentFolder());
    args.headers = headersSwitch.getState();
    let indexController = new _IndexController.default(args);
    startButton.setSensitive(false);
    startButton.setLabel("Indexing Site...");
    indexController.start((event, progress) => {
      if (event === 'progress') {
        const percentComplete = progress.urls / (progress.urlsPool + progress.urls);
        progressBar.setFraction(percentComplete);
      }
    }).then(() => {
      startButton.setSensitive(true);
      startButton.setLabel("Start Index");
    }).catch(() => {
      startButton.setSensitive(true);
      startButton.setLabel("Start Index");
    });
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
  },
  FileChooserButton: {
    getCurrentFolder: _propTypes.default.func,
    setCurrentFolder: _propTypes.default.func,
    setAction: _propTypes.default.func
  },
  Entry: {
    getText: _propTypes.default.func
  },
  ProgressBar: {
    setFraction: _propTypes.default.func
  },
  Button: {
    setSensitive: _propTypes.default.func,
    setLabel: _propTypes.default.func
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