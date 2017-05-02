'use strict';
import { render } from 'react-dom';

const TOOLTIP_ID = 'chartjs-tooltip';

export default function (contentFn) {
  return function (tooltip) {
    // Tooltip element.
    var tooltipEl = document.getElementById(TOOLTIP_ID);
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = TOOLTIP_ID;
      document.body.appendChild(tooltipEl);
    }

    // Hide if no tooltip.
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      tooltipEl.style.top = 0;
      return;
    }

    render(contentFn(tooltip.dataPoints[0].index), tooltipEl);

    let elSize = tooltipEl.getBoundingClientRect();
    var position = this._chart.canvas.getBoundingClientRect();

    // Display, position, and set styles for font.
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = position.left + tooltip.caretX + 'px';
    tooltipEl.style.top = window.pageYOffset - elSize.height - 10 + position.top + tooltip.caretY + 'px';
    // tooltipEl.style.fontFamily = tooltip._fontFamily;
    // tooltipEl.style.fontSize = tooltip.fontSize;
    // tooltipEl.style.fontStyle = tooltip._fontStyle;
    tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
  };
}
