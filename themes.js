// TODO: For a different theme use this as board background? "#1a1a2e"
export class ColorTheme {
  constructor(
    pageBackground,
    textColor,
    boardBackground,
    boardGrid,
    blockShadowTop,
    blockShadowBottom,
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
    this.pageBackground = pageBackground;
    this.textColor = textColor;
    this.boardBackground = boardBackground;
    this.boardGrid = boardGrid;
    this.blockShadowTop = blockShadowTop;
    this.blockShadowBottom = blockShadowBottom;
    this.previewTransparency = previewTransparency;

    this.pieceColors = pieceColors;
    this.availablePieces = availablePieces;
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
  "#11111e",
  "white",
  "#1a1a2e",
  "rgba(255, 255, 255, 0.05)",
  "rgba(255, 255, 255, 0.2)",
  "rgba(0, 0, 0, 0.3)",
  "80",
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

// This is the light theme which is used by default
ColorTheme.Default = new ColorTheme(
  "#fff0f2",
  "black",
  "#dadada",
  "rgba(0, 0, 0, 0.05)",
  "rgba(255, 255, 255, 0.5)",
  "rgba(0, 0, 0, 0.3)",
  "70",
  ["#f0f000", "#f0a000", "#00f000", "#00f0f0", "#a000f0", "#e74c3c"],
);

// TODO: Add levels associated with the themes
// -> Clears all blocks, applies new theme
// Should happen every N points, maybe every 1000 points?

// A soft pastel theme, all pieces are prime numbers
ColorTheme.Pastel = new ColorTheme(
  "#bebebe",
  "white",
  "#aeaeae",
  "rgba(255, 255, 255, 0.05)",
  "rgba(255, 255, 255, 0.2)",
  "rgba(0, 0, 0, 0.3)",
  "70",
  [
    //
    "#d7f9f8",
    "#ffffea",
    "#fff0d4",
    "#fbe0e0",
    "#e5d4ef",
    "#f2ccab",
  ],
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
  "#1c1c1c",
  "white",
  "#232323",
  "rgba(255, 255, 255, 0.05)",
  "rgba(255, 255, 255, 0.2)",
  "rgba(0, 0, 0, 0.3)",
  "80",
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
  "#000000",
  "#39ff14",
  "#0f0f0f",
  "rgba(57, 255, 20, 0.1)",
  "rgba(57, 255, 20, 0.5)",
  "rgba(0, 0, 0, 0.7)",
  "90",
  ["#39ff14", "#ff073a", "#1e90ff", "#ff8c00", "#ff00ff", "#00ffff"],
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
  "#e0f2e9",
  "#2e4d32",
  "#c3e6cb",
  "rgba(0, 0, 0, 0.05)",
  "rgba(255, 255, 255, 0.3)",
  "rgba(0, 0, 0, 0.2)",
  "70",
  ["#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800"],
);

// In this theme, all pieces are the same color and there are only two different pieces.
ColorTheme.DarkBlue = new ColorTheme(
  "#1c1c1c",
  "white",
  "#232323",
  "rgba(255, 255, 255, 0.05)",
  "rgba(255, 255, 255, 0.2)",
  "rgba(0, 0, 0, 0.3)",
  "80",
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
