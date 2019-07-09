// noinspection ES6CheckImport
import PropTypes from 'prop-types';
import gi from 'node-gtk';
import IndexController from "../Controller/IndexController";

const Gtk = gi.require('Gtk', '3.0');
const {Window, Label, Entry, Grid, Switch, ProgressBar, Button, Box, Align} = Gtk;

const startGui = (args) => {
    gi.startLoop();
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
    grid.attach(new Label({label: `Domain`, halign: 1}), 0, 0, 1, 1);
    const domainEntry = new Entry({text: args.domain, hexpand: true});
    grid.attach(domainEntry, 1, 0, 1, 1);

    grid.attach(new Label({label: `Output`, halign: 1}), 0, 1, 1, 1);
    const outputEntry = new Entry({text: args.output.filename});
    grid.attach(outputEntry, 1, 1, 1, 1);

    grid.attach(new Label({label: `Headers`, halign: 1}), 0, 2, 1, 1);
    const headersSwitch = new Switch({active: args.headers});
    const headersSwitchBox = new Box();
    headersSwitchBox.add(headersSwitch);
    grid.attach(headersSwitchBox, 1, 2, 1, 1);

    const progressBar = new ProgressBar({fraction: 0.0});
    grid.attach(progressBar, 0, 3, 2, 1);

    const startButton = new Button({label: 'Start Index', halign: 2});
    const startButtonBox = new Box({halign: 2});
    startButtonBox.add(startButton);
    grid.attach(startButtonBox, 1, 4, 1, 1);


    startButton.on('clicked', () => {
        let indexController = new IndexController(args);
        startButton.setSensitive(false);
        startButton.setLabel("Indexing Site...");
        indexController.start((event, progress) => {
            if(event === 'progress') {
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
        CENTER: PropTypes.object
    },
    Grid: {
        attach: PropTypes.func
    },
    ProgressBar: {
        setFraction: PropTypes.func
    },
    Button: {
        setSensitive: PropTypes.func,
        setLabel: PropTypes.func
    }
};
Window.propTypes = {
    setWmclass: PropTypes.func,
    setDefaultSize: PropTypes.func,
    showAll: PropTypes.func
};

export default startGui;
