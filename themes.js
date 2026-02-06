import { adjustBrightnessBy } from "./utils.js";

export class ColorTheme {
  constructor(
    textColor,
    previewTransparency,
    pieceColors = [],
    availablePieces = [
      [
        [1, 1], //
      ],
      [
        [1, 1, 1], //
      ],
      [
        [1, 1, 1, 1], //
      ],
      [
        [1, 1],
        [1, 1], //
      ],
      [
        [1],
        [1],
        [1], //
      ],
      [
        [1],
        [1], //
      ],
    ],
  ) {
    this.pageBackground = "#1c1c1c";
    this.textColor = textColor;
    this._boardBackground = "#232323";
    this.previewTransparency = previewTransparency;

    this.pieceColors = pieceColors;
    this.availablePieces = availablePieces;
  }

  get landingTransparency() {
    return this.previewTransparency;
  }

  get boardGrid() {
    return adjustBrightnessBy(this.boardBackground, 0.3);
  }

  get boardBackground() {
    return adjustBrightnessBy(this._boardBackground, -0.1);
  }

  get sidebarBackground() {
    return this.boardBackground;
  }

  get pieces() {
    return this.availablePieces
      .keys()
      .map((idx) => {
        return {
          layout: this.availablePieces[idx],
          color:
            idx < this.pieceColors.length
              ? this.pieceColors[idx]
              : this.pieceColors[0] || "blue",
        };
      })
      .toArray();
  }
}

ColorTheme.Dark = new ColorTheme(
  "#efe691",
  0.5,
  ["#ca9fbb", "#b1e9a8", "#ff9cb5", "#42cabb", "#48b9d1", "#e4bf7a"],
  [
    [
      //
      [0, 1, 0],
      [1, 1, 1],
    ],
    [
      //
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      //
      [1],
      [1],
    ],
    [
      //
      [1, 1],
    ],
  ],
);

ColorTheme.Default = new ColorTheme("#a5b7ff", 0.44, [
  "#ef4444",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
]);

// A soft pastel theme, all pieces are prime numbers
ColorTheme.Pastel = new ColorTheme(
  "#c96e85",
  0.43,
  ["#ff80ab", "#b39ddb", "#81d4fa", "#a5d6a7", "#fff59d", "#ffcc80"],
  [
    [
      //
      [1, 1],
    ],
    [
      //
      [1, 1, 1],
    ],
    [
      //
      [1, 1, 1, 1, 1],
    ],
  ],
);

// In this theme, all pieces are the same color and there are only two different pieces.
ColorTheme.DarkRed = new ColorTheme(
  "#ee5656",
  0.5,
  [
    "#f03f3f",
    "#f03f3f",
    "#f03f3f",
    "#f03f3f",
    "#f03f3f",
    "#f03f3f",
    "#f03f3f",
    "#f03f3f",
  ],
  [
    [
      [1, 1, 1, 1], //
    ],
    [
      [1, 1], //
    ],
  ],
);

ColorTheme.Neon = new ColorTheme(
  "#39ff14",
  0.56,
  ["#39ff14", "#6cf602", "#06D001", "#008BFF", "#ff00ff", "#E4FF30"],
  [
    [
      //
      [1],
      [1],
      [1],
      [1],
    ],
    [
      //
      [1, 0],
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    [
      //
      [0, 1],
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1], //
    ],
    [
      [1, 1], //
    ],
  ],
);

ColorTheme.Forest = new ColorTheme(
  "#3ea977", // Dark green text
  0.43,
  ["#4caf50", "#729748", "#cddc39", "#6a3902", "#ffc107", "#ff9800"],
);

// In this theme, all pieces are the same color and there are only two different pieces.
ColorTheme.DarkBlue = new ColorTheme(
  "#98bffc",
  0.5,
  ["#3b82f6", "#3be0f6", "#523bf6", "#84b1f9"],
  [
    [
      [1],
      [1],
      [1],
      [1], //
    ],
    [
      [1], //
      [1],
    ],
    [
      [1],
      [1],
      [1],
      [1], //
    ],
    [
      [1], //
      [1],
    ],
  ],
);

ColorTheme.all = [
  ColorTheme.Default,
  ColorTheme.Dark,
  ColorTheme.Pastel,
  ColorTheme.DarkRed,
  ColorTheme.Neon,
  ColorTheme.Forest,
  ColorTheme.DarkBlue,
];
