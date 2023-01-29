import Identicon from "identicon.js";


export function HashAvatar(address) {
    
    // address 15+ hex chars
    var options = {
        // foreground: [r, g, b, 255],               // rgba black
        background: [255, 255, 255, 255],         // rgba white
        // margin: 0.2,                              // 20% margin
        // size: 420,                                // 420px square
        format: 'svg'                             // use SVG instead of PNG
        };
    // create a base64 encoded SVG
    var data = new Identicon(address, options).toString();
    // var data = new Identicon(address, {format: 'svg'}).toString();
    data = `data:image/svg+xml;base64,${data}`
    return data
}