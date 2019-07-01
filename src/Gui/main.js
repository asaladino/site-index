import gi from 'node-gtk';
import menu from "../Model/Menu.js";

console.log(menu);

const Gtk = gi.require('Gtk', '3.0');
const {Window, Label} = Gtk;

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
window.add(new Label({label: `Let's scan a site.`}));

window.showAll();
Gtk.main();