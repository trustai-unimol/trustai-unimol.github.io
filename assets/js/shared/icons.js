// Curated line-icon set for TrustAI. window.Icon({name, size, className, stroke})
(function(){
  const P = {
    shield: 'M12 3l7 3v5c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9V6l7-3z|M9 12l2 2 4-4',
    code: 'M8.5 8L4.5 12l4 4|M15.5 8l4 4-4 4|M13 6l-2 12',
    cycle: 'M5 9.5A7 7 0 0 1 16.5 7l1.5 1.3|M17.5 5.2v3.2h-3.2|M19 14.5A7 7 0 0 1 7.5 17l-1.5-1.3|M6.5 18.8v-3.2h3.2',
    sparkles: 'M11 4l1.6 4.4L17 10l-4.4 1.6L11 16l-1.6-4.4L5 10l4.4-1.6L11 4z|M18 14l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9L15.4 17l1.9-.7L18 14z',
    eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z|M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    lock: 'M5.5 11.5h13v8.5h-13z|M8 11.5V8a4 4 0 0 1 8 0v3.5|M12 15v2.5',
    chart: 'M3.5 20.5h17|M7 20.5v-6|M12 20.5v-11|M17 20.5v-8',
    scan: 'M4 8.5V5.5a1.5 1.5 0 0 1 1.5-1.5h3|M15.5 4h3A1.5 1.5 0 0 1 20 5.5v3|M20 15.5v3a1.5 1.5 0 0 1-1.5 1.5h-3|M8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3|M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    rocket: 'M12 3.2c3 2.2 4.2 6 4.2 9.3L12 16l-4.2-3.5c0-3.3 1.2-7.1 4.2-9.3z|M12 11.2a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z|M7.8 13.5l-2 2.2.3 3.3 3-1.6|M16.2 13.5l2 2.2-.3 3.3-3-1.6',
    flask: 'M9 3.5h6|M10 3.5v6.2l-4.2 7.6a2 2 0 0 0 1.8 3h8.8a2 2 0 0 0 1.8-3L14 9.7V3.5|M7.2 15.5h9.6',
    cap: 'M3 9l9-4 9 4-9 4-9-4z|M6.5 11v4.2c0 1.3 2.5 2.3 5.5 2.3s5.5-1 5.5-2.3V11|M21 9.2v4.8',
    transfer: 'M6.5 8.5H18|M15 5.5l3 3-3 3|M17.5 15.5H6|M9 12.5l-3 3 3 3',
    building: 'M5.5 20.5V4.5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v16|M3.5 20.5h17|M9 7.5h2|M13 7.5h2|M9 11h2|M13 11h2|M10 20.5v-3.5h4v3.5',
    landmark: 'M3.5 20.5h17|M5 20.5V10|M19 20.5V10|M9.5 20.5V10|M14.5 20.5V10|M3.5 10l8.5-5.5L20.5 10z',
    users: 'M9 11a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 9 11z|M2.5 20c0-3.4 2.9-5.6 6.5-5.6s6.5 2.2 6.5 5.6|M16.5 4.8a3 3 0 0 1 0 6|M17.5 14.6c2.6.3 4 2.4 4 5.4',
    megaphone: 'M3.5 11v2.5l11 4.5V6.5l-11 4.5z|M14.5 8.2a4 4 0 0 1 0 8.1|M6 14.5v3.2h3',
    book: 'M12 6.2c-2-1.4-5-1.4-7.5 0v12c2.5-1.4 5.5-1.4 7.5 0 2-1.4 5-1.4 7.5 0v-12c-2.5-1.4-5.5-1.4-7.5 0z|M12 6.2v12',
    share: 'M6.5 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z|M17.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z|M17.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z|M8.7 10.8l6.6-3.8|M8.7 13.2l6.6 3.8',
    globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z|M3.2 12h17.6|M12 3c2.8 2.6 2.8 15.4 0 18|M12 3c-2.8 2.6-2.8 15.4 0 18',
    network: 'M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z|M5 7a1.6 1.6 0 1 0 0-.1|M19 7a1.6 1.6 0 1 0 0-.1|M5 18a1.6 1.6 0 1 0 0-.1|M19 18a1.6 1.6 0 1 0 0-.1|M10.3 10.3L6.2 7.4|M13.7 10.3l4.1-2.9|M10.3 13.7l-4.1 2.9|M13.7 13.7l4.1 2.9',
    spark1: 'M12 3v4|M12 17v4|M3 12h4|M17 12h4|M6 6l2.5 2.5|M15.5 15.5L18 18|M18 6l-2.5 2.5|M8.5 15.5L6 18',
    chip: 'M7 7h10v10H7z|M9.5 9.5h5v5h-5z|M9 4v3|M15 4v3|M9 17v3|M15 17v3|M4 9h3|M4 15h3|M17 9h3|M17 15h3',
    arrowRight: 'M5 12h14|M13 6l6 6-6 6',
    play: 'M8 5.5l11 6.5-11 6.5z',
    mail: 'M3.5 6.5h17v11h-17z|M3.5 7l8.5 6 8.5-6',
    pin: 'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z|M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    doc: 'M6.5 3.5h7l4 4v13h-11z|M13 3.5V8h4|M9 12h6|M9 15.5h6|M9 8.5h2',
    check: 'M5 12.5l4.5 4.5L19 7'
  };

  function escapeAttr(value){
    return String(value || "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function Icon(props){
    props = props || {};
    const name = props.name;
    const size = props.size || 24;
    const d = P[name];
    if(!d) return "";
    const stroke = props.stroke || "currentColor";
    const strokeWidth = props.strokeWidth || 1.7;
    const className = props.className ? ' class="' + escapeAttr(props.className) + '"' : "";
    const style = props.style ? ' style="' + escapeAttr(props.style) + '"' : "";
    const paths = d.split("|").map((segment) => '<path d="' + escapeAttr(segment) + '"></path>').join("");
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + escapeAttr(stroke) + '" stroke-width="' + strokeWidth + '" stroke-linecap="round" stroke-linejoin="round"' + className + style + ' aria-hidden="true">' + paths + '</svg>';
  }

  window.Icon = Icon;
  // semantic maps
  window.AREA_ICONS = ['shield','code','cycle','sparkles','eye','lock','chart','scan','rocket'];
  window.PILLAR_ICONS = ['flask','cap','transfer'];
  window.COLLAB_ICONS = ['building','landmark','cap','users'];
  window.OUTREACH_ICONS = ['book','users','megaphone','share'];
  window.BRIDGE_ICONS = ['flask','cap','globe'];

})();
