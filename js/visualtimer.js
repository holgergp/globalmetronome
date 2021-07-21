function set_visual_elements(pcount) {
  pcount = pcount || 4;
  var elem_max = 12;
  if (pcount > elem_max) {
    pcount = elem_max;
  }
  if (pcount < 1) {
    pcount = 1;
  };
  for (var i = 1; i <= elem_max; i++) {
    if (i <= pcount) {
      show_element("cell"+i);
      show_element("cellsmall"+i);
    } else {
      hide_element("cell"+i);
      hide_element("cellsmall"+i);
    }
  }
}

function highlight_visual_beat(pbeat) {
  var visual_count = parseInt(getValueDOM("countInput")) || 4;
  for (var i = 1; i <= visual_count; i++) {
    if (i == pbeat) {
      class4element("cell"+i,"visual-timer-active");
      class4element("cellsmall"+i,"visual-timer-active");
    } else {
      class4element("cell"+i,"visual-timer-cell");
      class4element("cellsmall"+i,"visual-timer-cell");
    }
  }
}


function init_visual_timer() {
  var visual_count = parseInt(getValueDOM("countInput")) || 4;
  set_visual_elements(visual_count);
  highlight_visual_beat(1);
}
