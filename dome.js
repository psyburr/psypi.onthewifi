// ---------- LICENSE ----------//
/*
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2018 Jaume Fuster i Claris
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

// ---------- CONFIGURATION ----------
// div.innerHTML : {a.innerHTML : a.href}

var sites = {

    "Docs": {
        "ADB Commands": "/html/docs/adb_commands/AdbCommands.txt",
        "clipman": "/html/docs/clipman/",
        "FFmpeg-all": "/html/docs/ffmpeg/",
        "LineageOS on ShieldTV": "/html/docs/install_lineageos-shieldtv/",
        "Man-Pages": "/html/sites/man-pages/",
        "MDN (Mozilla Docs)": "/html/docs/MDN/",
        "MPV": "/html/docs/mpv/"
    },

    "Social": {
        "Omegle": "https://www.omegle.com",
        "whereby": "https://whereby.com/loafahbred",
        "Reddit": "https://reddit.com/",
        "Facebook": "https://facebook.com/",
        "gab": "https://gab.com/home"
    },

    "MusicBrainz": {
        "MusicBrainz/psyburr": "https://musicbrainz.org",
        "MusicBrainz Docs": "https://musicbrainz.org/doc/MusicBrainz_Documentation",
        "a-tisket": "https://etc.marlonob.info/atisket/",
        "SpotAPI": "https://tatsumo.pythonanywhere.com/auto",
        "MagicISRC": "https://magicisrc.kepstin.ca/",
        "BMI Repertoire": "https://repertoire.bmi.com/StartPage.aspx"
    },

    "Pi-Software": {
        "PsyCloud": "/nextcloud",
        "rutorrent": "/rutorrent"
    },

    "WebAdmin": {
        "Netgear": "http://192.168.0.1",
        "Netlify": "https://app.netlify.com/sites/psyweb/overview",
        "Pi-hole": "/html/admin",
    },

    "Media": {
        "Mirrors": "/html/mirrors/",
        "Movies": "/html/media/movies/",
        "Music": "/html/media/music/",
        "TV Shows": "/html/media/tv-shows/",
        "Videos": "/html/mediavideos/"
    }
};

var search = { // Query variable name is q, hardcoded, looks like a standard already anyways
    "default": "https://duckduckgo.com/"
};

// ---------- BUILD PAGE ----------

var pivotmatch = 0;
var totallinks = 0;
var prevregexp = "";

function matchLinks(regex = prevregexp) {
    totallinks = 0;
    pivotmatch = regex == prevregexp ? pivotmatch : 0;
    prevregexp = regex;
    pivotbuffer = pivotmatch;
    p = document.getElementById("links");
    while (p.firstChild) {
        p.removeChild(p.firstChild);
    }
    if (regex.charAt(1) == ' ' && search.hasOwnProperty(regex.charAt(0))) {
        document.getElementById("action").action = search[regex.charAt(0)];
        document.getElementById("action").children[0].name = "q";
    } else {
        match = new RegExp(regex ? regex : ".", "i");
        gmatches = false; // kinda ugly, rethink
        for (i = 0; i < Object.keys(sites).length; i++) {
            matches = false;
            sn = Object.keys(sites)[i];
            section = document.createElement("div");
            section.id = sn;
            section.innerHTML = sn;
            section.className = "section";
            inner = document.createElement("div");
            for (l = 0; l < Object.keys(sites[sn]).length; l++) {
                ln = Object.keys(sites[sn])[l];
                if (match.test(ln)) {
                    link = document.createElement("a");
                    link.href = sites[sn][ln];
                    link.innerHTML = ln;
                    if (!pivotbuffer++ && regex != "") {
                        link.className = "selected";
                        document.getElementById("action").action = sites[sn][ln];
                        document.getElementById("action").children[0].removeAttribute("name");
                    }
                    inner.appendChild(link);
                    matches = true;
                    gmatches = true;
                    totallinks++;
                }
            }
            section.appendChild(inner);
            matches ? p.appendChild(section) : false;
        }
        if (!gmatches || regex == "") {
            document.getElementById("action").action = search["default"];
            document.getElementById("action").children[0].name = "q";
        }
    }
    document.getElementById("main").style.height = document.getElementById("main").children[0].offsetHeight + "px";
}

document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 38:
            pivotmatch = pivotmatch >= 0 ? 0 : pivotmatch + 1;
            matchLinks();
            break;
        case 40:
            pivotmatch = pivotmatch <= -totallinks + 1 ? -totallinks + 1 : pivotmatch - 1;
            matchLinks();
            break;
        default:
            break;
    }
    document.getElementById("action").children[0].focus();
}

document.getElementById("action").children[0].onkeypress = function(e) {
    if (e.key == "ArrowDown" || e.key == "ArrowUp") {
        return false;
    }
}

function displayClock() {
    now = new Date();
    clock = (now.getHours() < 10 ? "0" + now.getHours() : now.getHours()) + ":" +
        (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()) + ":" +
        (now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds());
    document.getElementById("clock").innerHTML = clock;
}

window.onload = matchLinks();
document.getElementById("action").onsubmit = function() {
    svalue = this.children[0].value;
    if (svalue.charAt(1) == ' ' && search.hasOwnProperty(svalue.charAt(0))) {
        this.children[0].value = svalue.substring(2);
    }
    return true;
}
displayClock();
setInterval(displayClock, 1000);