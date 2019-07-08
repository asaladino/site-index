// noinspection ES6CheckImport
import PropTypes from 'prop-types';
import gi from 'node-gtk';
import IndexController from "../Controller/IndexController";

const Gtk = gi.require('Gtk', '3.0');
const {Window, Label, Entry, Grid, Switch, ProgressBar, Button} = Gtk;

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
    window.setDefaultSize(200, 80);
    const grid = new Grid();
    grid.attach(new Label({label: `Domain`}), 0, 0, 1, 1);
    grid.attach(new Entry({text: args.domain}), 1, 0, 1, 1);

    grid.attach(new Label({label: `Output`}), 0, 1, 1, 1);
    grid.attach(new Entry({text: args.output.filename}), 1, 1, 1, 1);

    grid.attach(new Label({label: `Headers`}), 0, 2, 1, 1);
    grid.attach(new Switch({active: args.headers}), 1, 2, 1, 1);

    const progressBar = new ProgressBar({fraction: 0.0});
    grid.attach(progressBar, 0, 3, 2, 1);

    const startButton = new Button({label: 'Start Index'});
    grid.attach(startButton, 1, 4, 1, 1);


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
